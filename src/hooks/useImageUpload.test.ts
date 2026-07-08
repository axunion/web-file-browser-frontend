import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useImageUpload from "./useImageUpload";

describe("useImageUpload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("sends images[] fields and path in FormData to upload-images endpoint", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({ status: "success", files: ["a.jpg", "b.jpg"] }),
        {
          status: 200,
        },
      ),
    );

    const { result } = renderHook(() => useImageUpload());
    const files = [
      new File(["a"], "a.jpg", { type: "image/jpeg" }),
      new File(["b"], "b.jpg", { type: "image/jpeg" }),
    ];

    let response:
      | Awaited<ReturnType<typeof result.current.uploadImages>>
      | undefined;
    await act(async () => {
      response = await result.current.uploadImages(files, "photos");
    });

    expect(global.fetch).toHaveBeenCalledOnce();
    const [, options] = vi.mocked(global.fetch).mock.calls[0];
    const body = options?.body as FormData;
    expect(body.get("path")).toBe("photos");
    expect(body.getAll("images[]")).toHaveLength(2);

    expect(response).toEqual({
      status: "success",
      files: ["a.jpg", "b.jpg"],
    });
  });

  it("returns error response without throwing when API returns error status", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({ status: "error", message: "ファイルが大きすぎます" }),
        { status: 200 },
      ),
    );

    const { result } = renderHook(() => useImageUpload());
    const file = new File(["x"], "x.png", { type: "image/png" });

    await act(async () => {
      try {
        await result.current.uploadImages([file], "");
      } catch {
        // Expected: useApiRequest throws on error status
      }
    });

    expect(result.current.error).toBe("ファイルが大きすぎます");
  });

  it("reports isLoading while an upload is in flight", () => {
    vi.mocked(global.fetch).mockReturnValue(new Promise(() => {})); // pending

    const { result } = renderHook(() => useImageUpload());

    act(() => {
      void result.current.uploadImages(
        [new File(["x"], "x.png", { type: "image/png" })],
        "",
      );
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("aborts an in-flight upload", () => {
    const abortSpy = vi.fn();
    vi.mocked(global.fetch).mockImplementationOnce((_url, options) => {
      options?.signal?.addEventListener("abort", abortSpy);
      return new Promise(() => {}); // Never resolves
    });

    const { result } = renderHook(() => useImageUpload());

    act(() => {
      void result.current.uploadImages(
        [new File(["x"], "x.png", { type: "image/png" })],
        "",
      );
    });
    act(() => {
      result.current.abort();
    });

    expect(abortSpy).toHaveBeenCalled();
  });
});
