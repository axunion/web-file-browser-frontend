/**
 * Integration tests for the thin API wrapper hooks:
 * useFileUpload, useDelete, useFileMove, useFileRename
 *
 * Each hook composes useApiRequest and is responsible for building the correct
 * request payload and targeting the correct endpoint.
 */
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useDelete from "./useDelete";
import useFileMove from "./useFileMove";
import useFileRename from "./useFileRename";
import useFileUpload from "./useFileUpload";

const successResponse = (extra: Record<string, unknown> = {}) =>
  new Response(JSON.stringify({ status: "success", ...extra }), {
    status: 200,
  });

describe("useFileUpload", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it("POSTs FormData with file and path to the upload endpoint", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(successResponse());

    const { result } = renderHook(() => useFileUpload());
    const file = new File(["content"], "report.pdf");

    await act(async () => {
      await result.current.uploadFile(file, "documents");
    });

    expect(global.fetch).toHaveBeenCalledOnce();
    const [url, options] = vi.mocked(global.fetch).mock.calls[0];
    expect(url).toBe("http://localhost/api/upload/");
    const body = options?.body as FormData;
    expect(body.get("file")).toBe(file);
    expect(body.get("path")).toBe("documents");
  });

  it("exposes isLoading and error from the underlying hook", () => {
    global.fetch = vi.fn().mockReturnValue(new Promise(() => {})); // pending
    const { result } = renderHook(() => useFileUpload());

    act(() => {
      void result.current.uploadFile(new File([], "a.txt"), "");
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });
});

describe("useDelete", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it("POSTs URLSearchParams with path and name to the delete endpoint", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      successResponse({ path: "docs", filename: "old.txt" }),
    );

    const { result } = renderHook(() => useDelete());

    await act(async () => {
      await result.current.deleteFile({ path: "docs", name: "old.txt" });
    });

    const [url, options] = vi.mocked(global.fetch).mock.calls[0];
    expect(url).toBe("http://localhost/api/delete/");
    const params = new URLSearchParams(options?.body as string);
    expect(params.get("path")).toBe("docs");
    expect(params.get("name")).toBe("old.txt");
  });

  it("sends an empty string for path when path is undefined", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      successResponse({ path: "", filename: "root.txt" }),
    );

    const { result } = renderHook(() => useDelete());

    await act(async () => {
      // DeleteFileRequest requires path but coerce via cast to test edge case
      await result.current.deleteFile({
        path: undefined as unknown as string,
        name: "root.txt",
      });
    });

    const [, options] = vi.mocked(global.fetch).mock.calls[0];
    const params = new URLSearchParams(options?.body as string);
    expect(params.get("path")).toBe("");
  });
});

describe("useFileMove", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it("POSTs URLSearchParams with path, name, and destinationPath to the move endpoint", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      successResponse({ path: "archive", filename: "report.pdf" }),
    );

    const { result } = renderHook(() => useFileMove());

    await act(async () => {
      await result.current.moveFile({
        path: "documents",
        name: "report.pdf",
        destinationPath: "archive",
      });
    });

    const [url, options] = vi.mocked(global.fetch).mock.calls[0];
    expect(url).toBe("http://localhost/api/move/");
    const params = new URLSearchParams(options?.body as string);
    expect(params.get("path")).toBe("documents");
    expect(params.get("name")).toBe("report.pdf");
    expect(params.get("destinationPath")).toBe("archive");
  });
});

describe("useFileRename", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it("POSTs URLSearchParams with path, name, and newName to the rename endpoint", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      successResponse({ path: "docs", filename: "b.txt" }),
    );

    const { result } = renderHook(() => useFileRename());

    await act(async () => {
      await result.current.renameFile({
        path: "docs",
        name: "a.txt",
        newName: "b.txt",
      });
    });

    const [url, options] = vi.mocked(global.fetch).mock.calls[0];
    expect(url).toBe("http://localhost/api/rename/");
    const params = new URLSearchParams(options?.body as string);
    expect(params.get("path")).toBe("docs");
    expect(params.get("name")).toBe("a.txt");
    expect(params.get("newName")).toBe("b.txt");
  });

  it("sends an empty string for path when path is undefined", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      successResponse({ path: "", filename: "b.txt" }),
    );

    const { result } = renderHook(() => useFileRename());

    await act(async () => {
      await result.current.renameFile({
        path: undefined as unknown as string,
        name: "a.txt",
        newName: "b.txt",
      });
    });

    const [, options] = vi.mocked(global.fetch).mock.calls[0];
    const params = new URLSearchParams(options?.body as string);
    expect(params.get("path")).toBe("");
  });
});
