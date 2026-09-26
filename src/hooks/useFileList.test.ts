import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { SWRConfig } from "swr";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MESSAGES } from "@/constants/messages";
import useFileList from "./useFileList";

const createResponse = (body: string, ok = true) => ({
  ok,
  text: () => Promise.resolve(body),
});

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(
    SWRConfig,
    { value: { dedupingInterval: 0, provider: () => new Map() } },
    children,
  );

describe("useFileList", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("should return items for a successful response", async () => {
    global.fetch = vi.fn().mockResolvedValue(
      createResponse(
        JSON.stringify({
          status: "success",
          list: [{ name: "photo.jpg", type: "file" }],
        }),
      ),
    );

    const { result } = renderHook(() => useFileList("my%20folder"), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.items).toEqual([
        { name: "photo.jpg", type: "file" },
      ]);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("path=my%2520folder"),
    );
    expect(result.current.errorMessage).toBeNull();
  });

  it("should expose API error payloads as an error message", async () => {
    global.fetch = vi.fn().mockResolvedValue(
      createResponse(
        JSON.stringify({
          status: "error",
          message: "Directory listing failed",
        }),
      ),
    );

    const { result } = renderHook(() => useFileList(""), { wrapper });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe("Directory listing failed");
    });

    expect(result.current.items).toEqual([]);
  });

  it("should expose non-ok responses as an error message", async () => {
    global.fetch = vi.fn().mockResolvedValue(
      createResponse(
        JSON.stringify({
          status: "error",
          message: "Request denied",
        }),
        false,
      ),
    );

    const { result } = renderHook(() => useFileList(""), { wrapper });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe("Request denied");
    });
  });

  it("should fetch again when the path changes", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(
        createResponse(
          JSON.stringify({
            status: "success",
            list: [{ name: "root.txt", type: "file" }],
          }),
        ),
      )
      .mockResolvedValueOnce(
        createResponse(
          JSON.stringify({
            status: "success",
            list: [{ name: "nested.txt", type: "file" }],
          }),
        ),
      );

    const { result, rerender } = renderHook(
      ({ path }: { path: string }) => useFileList(path),
      { wrapper, initialProps: { path: "" } },
    );

    await waitFor(() => {
      expect(result.current.items).toEqual([
        { name: "root.txt", type: "file" },
      ]);
    });

    rerender({ path: "special%20folder" });

    await waitFor(() => {
      expect(result.current.items).toEqual([
        { name: "nested.txt", type: "file" },
      ]);
    });

    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("path=special%2520folder"),
    );
  });

  it("should never expose the previous path's items after the path changes", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(
        createResponse(
          JSON.stringify({
            status: "success",
            list: [{ name: "root.txt", type: "file" }],
          }),
        ),
      )
      .mockImplementationOnce(() => new Promise(() => {}));

    const { result, rerender } = renderHook(
      ({ path }: { path: string }) => useFileList(path),
      { wrapper, initialProps: { path: "" } },
    );

    await waitFor(() => {
      expect(result.current.items).toEqual([
        { name: "root.txt", type: "file" },
      ]);
    });

    rerender({ path: "nested" });

    expect(result.current.items).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });

  it("should share one request between hooks reading the same path", async () => {
    global.fetch = vi.fn().mockResolvedValue(
      createResponse(
        JSON.stringify({
          status: "success",
          list: [{ name: "shared.txt", type: "file" }],
        }),
      ),
    );

    const { result } = renderHook(
      () => ({ first: useFileList("docs"), second: useFileList("docs") }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.second.items).toEqual([
        { name: "shared.txt", type: "file" },
      ]);
    });

    expect(result.current.first.items).toEqual([
      { name: "shared.txt", type: "file" },
    ]);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("should fall back to the load error message when the request itself fails", async () => {
    global.fetch = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));

    const { result } = renderHook(() => useFileList(""), { wrapper });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe(MESSAGES.FILE_LOAD_ERROR);
    });
  });

  it("should fall back to the load error message for a non-ok HTML body", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValue(
        createResponse("<html><title>502 Bad Gateway</title></html>", false),
      );

    const { result } = renderHook(() => useFileList(""), { wrapper });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe(MESSAGES.FILE_LOAD_ERROR);
    });
  });

  it("should fall back to the load error message for a non-string message", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValue(
        createResponse(
          JSON.stringify({ status: "error", message: { code: 1 } }),
          false,
        ),
      );

    const { result } = renderHook(() => useFileList(""), { wrapper });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe(MESSAGES.FILE_LOAD_ERROR);
    });
  });

  it("should fall back to the load error message for invalid JSON", async () => {
    global.fetch = vi.fn().mockResolvedValue(createResponse("<html>"));

    const { result } = renderHook(() => useFileList(""), { wrapper });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe(MESSAGES.FILE_LOAD_ERROR);
    });
  });

  it("should keep isLoading false while a refresh revalidates", async () => {
    let resolveRefetch: (value: unknown) => void = () => {};
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(
        createResponse(
          JSON.stringify({
            status: "success",
            list: [{ name: "old.txt", type: "file" }],
          }),
        ),
      )
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveRefetch = resolve;
          }),
      );

    const { result } = renderHook(() => useFileList(""), { wrapper });

    await waitFor(() => {
      expect(result.current.items).toEqual([{ name: "old.txt", type: "file" }]);
    });

    let refreshPromise: Promise<unknown> = Promise.resolve();
    act(() => {
      refreshPromise = result.current.refresh();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.items).toEqual([{ name: "old.txt", type: "file" }]);

    resolveRefetch(
      createResponse(JSON.stringify({ status: "success", list: [] })),
    );
    await act(async () => {
      await refreshPromise;
    });

    expect(result.current.items).toEqual([]);
  });

  it("should revalidate the current path when refreshed", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(
        createResponse(
          JSON.stringify({
            status: "success",
            list: [{ name: "old.txt", type: "file" }],
          }),
        ),
      )
      .mockResolvedValueOnce(
        createResponse(
          JSON.stringify({
            status: "success",
            list: [{ name: "new.txt", type: "file" }],
          }),
        ),
      );

    const { result } = renderHook(() => useFileList(""), { wrapper });

    await waitFor(() => {
      expect(result.current.items).toEqual([{ name: "old.txt", type: "file" }]);
    });

    await act(async () => {
      await result.current.refresh();
    });

    await waitFor(() => {
      expect(result.current.items).toEqual([{ name: "new.txt", type: "file" }]);
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
