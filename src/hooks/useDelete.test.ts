import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useDelete from "./useDelete";

const successResponse = (extra: Record<string, unknown> = {}) =>
  new Response(JSON.stringify({ status: "success", ...extra }), {
    status: 200,
  });

describe("useDelete", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  it("aborts an in-flight delete", () => {
    const abortSpy = vi.fn();
    vi.mocked(global.fetch).mockImplementationOnce((_url, options) => {
      options?.signal?.addEventListener("abort", abortSpy);
      return new Promise(() => {}); // Never resolves
    });

    const { result } = renderHook(() => useDelete());

    act(() => {
      void result.current.deleteFile({ path: "", name: "x.txt" });
    });
    act(() => {
      result.current.abort();
    });

    expect(abortSpy).toHaveBeenCalled();
  });
});
