import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useMultiFileUpload from "./useMultiFileUpload";

const makeFile = (name: string) => new File(["x"], name);

const successResponse = () =>
  new Response(JSON.stringify({ status: "success" }), { status: 200 });

const errorResponse = (message: string) =>
  new Response(JSON.stringify({ status: "error", message }), { status: 200 });

describe("useMultiFileUpload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("initializes with empty progress and isUploading false", () => {
    const { result } = renderHook(() => useMultiFileUpload());
    expect(result.current.progress).toEqual([]);
    expect(result.current.isUploading).toBe(false);
  });

  describe("sequential progress transitions", () => {
    it("marks all files as success when all uploads succeed", async () => {
      vi.mocked(global.fetch)
        .mockResolvedValueOnce(successResponse())
        .mockResolvedValueOnce(successResponse());

      const { result } = renderHook(() => useMultiFileUpload());

      await act(async () => {
        await result.current.uploadFiles(
          [makeFile("a.txt"), makeFile("b.txt")],
          "docs",
        );
      });

      expect(result.current.progress).toEqual([
        { fileName: "a.txt", status: "success" },
        { fileName: "b.txt", status: "success" },
      ]);
      expect(result.current.isUploading).toBe(false);
    });

    it("marks the file as error when the API returns error status", async () => {
      vi.mocked(global.fetch)
        .mockResolvedValueOnce(successResponse())
        .mockResolvedValueOnce(errorResponse("Upload failed"));

      const { result } = renderHook(() => useMultiFileUpload());

      await act(async () => {
        await result.current.uploadFiles(
          [makeFile("a.txt"), makeFile("b.txt")],
          "docs",
        );
      });

      expect(result.current.progress[0].status).toBe("success");
      expect(result.current.progress[1].status).toBe("error");
    });

    it("marks the file as error when response is not ok", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(
        new Response("Internal Server Error", { status: 500 }),
      );

      const { result } = renderHook(() => useMultiFileUpload());

      await act(async () => {
        await result.current.uploadFiles([makeFile("a.txt")], "docs");
      });

      expect(result.current.progress[0].status).toBe("error");
    });

    it("sets isUploading to false after all uploads complete", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(successResponse());

      const { result } = renderHook(() => useMultiFileUpload());

      await act(async () => {
        await result.current.uploadFiles([makeFile("a.txt")], "docs");
      });

      expect(result.current.isUploading).toBe(false);
    });
  });

  describe("FormData payload", () => {
    it("sends the file and path in FormData to the upload endpoint", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(successResponse());

      const { result } = renderHook(() => useMultiFileUpload());
      const file = makeFile("photo.jpg");

      await act(async () => {
        await result.current.uploadFiles([file], "albums/2026");
      });

      expect(global.fetch).toHaveBeenCalledOnce();
      const [url, options] = vi.mocked(global.fetch).mock.calls[0];
      expect(url).toBe("http://localhost/api/upload/");
      const body = options?.body as FormData;
      expect(body.get("file")).toBe(file);
      expect(body.get("path")).toBe("albums/2026");
    });
  });

  describe("abort", () => {
    it("marks in-progress and remaining files as error when aborted during fetch", async () => {
      vi.mocked(global.fetch).mockImplementation((_url, options) => {
        return new Promise<Response>((_, reject) => {
          options?.signal?.addEventListener("abort", () => {
            reject(
              new DOMException("The operation was aborted.", "AbortError"),
            );
          });
        });
      });

      const { result } = renderHook(() => useMultiFileUpload());

      act(() => {
        void result.current.uploadFiles(
          [makeFile("a.txt"), makeFile("b.txt")],
          "docs",
        );
      });

      await waitFor(() =>
        expect(result.current.progress[0].status).toBe("uploading"),
      );

      act(() => {
        result.current.abort();
      });

      await waitFor(() => {
        expect(result.current.progress[0].status).toBe("error");
        expect(result.current.progress[1].status).toBe("error");
        expect(result.current.isUploading).toBe(false);
      });
    });

    it("aborts the previous upload when a new uploadFiles call is made", async () => {
      const abortSpy = vi.fn();

      vi.mocked(global.fetch)
        .mockImplementationOnce((_url, options) => {
          options?.signal?.addEventListener("abort", abortSpy);
          return new Promise<Response>(() => {}); // never resolves
        })
        .mockResolvedValueOnce(successResponse());

      const { result } = renderHook(() => useMultiFileUpload());

      act(() => {
        void result.current.uploadFiles([makeFile("a.txt")], "docs");
      });

      await waitFor(() =>
        expect(result.current.progress[0].status).toBe("uploading"),
      );

      await act(async () => {
        await result.current.uploadFiles([makeFile("b.txt")], "docs");
      });

      expect(abortSpy).toHaveBeenCalled();
    });
  });
});
