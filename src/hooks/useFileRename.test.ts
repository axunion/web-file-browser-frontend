import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useFileRename from "./useFileRename";

const successResponse = (extra: Record<string, unknown> = {}) =>
  new Response(JSON.stringify({ status: "success", ...extra }), {
    status: 200,
  });

describe("useFileRename", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  it("aborts an in-flight rename", () => {
    const abortSpy = vi.fn();
    vi.mocked(global.fetch).mockImplementationOnce((_url, options) => {
      options?.signal?.addEventListener("abort", abortSpy);
      return new Promise(() => {}); // Never resolves
    });

    const { result } = renderHook(() => useFileRename());

    act(() => {
      void result.current.renameFile({
        path: "",
        name: "a.txt",
        newName: "b.txt",
      });
    });
    act(() => {
      result.current.abort();
    });

    expect(abortSpy).toHaveBeenCalled();
  });
});
