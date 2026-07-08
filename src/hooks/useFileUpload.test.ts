import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useFileUpload from "./useFileUpload";

const successResponse = (extra: Record<string, unknown> = {}) =>
  new Response(JSON.stringify({ status: "success", ...extra }), {
    status: 200,
  });

describe("useFileUpload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  it("aborts an in-flight upload", () => {
    const abortSpy = vi.fn();
    vi.mocked(global.fetch).mockImplementationOnce((_url, options) => {
      options?.signal?.addEventListener("abort", abortSpy);
      return new Promise(() => {}); // Never resolves
    });

    const { result } = renderHook(() => useFileUpload());

    act(() => {
      void result.current.uploadFile(new File([], "a.txt"), "");
    });
    act(() => {
      result.current.abort();
    });

    expect(abortSpy).toHaveBeenCalled();
  });
});
