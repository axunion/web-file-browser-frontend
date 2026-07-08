import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useFileMove from "./useFileMove";

const successResponse = (extra: Record<string, unknown> = {}) =>
  new Response(JSON.stringify({ status: "success", ...extra }), {
    status: 200,
  });

describe("useFileMove", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  it("exposes the API error message when the move fails", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({ status: "error", message: "移動できません" }),
        { status: 200 },
      ),
    );

    const { result } = renderHook(() => useFileMove());

    await act(async () => {
      try {
        await result.current.moveFile({
          path: "a",
          name: "b.txt",
          destinationPath: "c",
        });
      } catch {
        // Expected: useApiRequest throws on error status
      }
    });

    expect(result.current.error).toBe("移動できません");
    expect(result.current.isLoading).toBe(false);
  });

  it("aborts an in-flight move", () => {
    const abortSpy = vi.fn();
    vi.mocked(global.fetch).mockImplementationOnce((_url, options) => {
      options?.signal?.addEventListener("abort", abortSpy);
      return new Promise(() => {}); // Never resolves
    });

    const { result } = renderHook(() => useFileMove());

    act(() => {
      void result.current.moveFile({
        path: "a",
        name: "b.txt",
        destinationPath: "c",
      });
    });
    act(() => {
      result.current.abort();
    });

    expect(abortSpy).toHaveBeenCalled();
  });
});
