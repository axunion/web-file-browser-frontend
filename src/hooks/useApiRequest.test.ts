import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import useApiRequest from "./useApiRequest";

describe("useApiRequest", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() =>
      useApiRequest({
        endpoint: "/api/test",
        fallbackErrorMessage: "Fallback",
      }),
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.execute).toBe("function");
    expect(typeof result.current.abort).toBe("function");
  });

  it("should set loading state during request", async () => {
    let resolveFetch: (value: unknown) => void = () => {};
    global.fetch = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        }),
    );

    const { result } = renderHook(() =>
      useApiRequest({
        endpoint: "/api/test",
        fallbackErrorMessage: "Fallback",
      }),
    );

    let executePromise: Promise<unknown> = Promise.resolve();
    act(() => {
      executePromise = result.current.execute({}, () => new URLSearchParams());
    });

    expect(result.current.isLoading).toBe(true);

    resolveFetch({
      ok: true,
      text: () => Promise.resolve('{"status":"success"}'),
    });
    await act(async () => {
      await executePromise;
    });

    expect(result.current.isLoading).toBe(false);
  });

  it("should handle successful response", async () => {
    const mockResponse = { status: "success", data: "test" } as const;
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify(mockResponse)),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() =>
      useApiRequest<Record<string, never>, typeof mockResponse>({
        endpoint: "/api/test",
        fallbackErrorMessage: "Fallback",
      }),
    );

    let response: typeof mockResponse | undefined;
    await act(async () => {
      response = await result.current.execute({}, () => new URLSearchParams());
    });

    expect(response).toEqual(mockResponse);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should reject API error responses", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () =>
        Promise.resolve(
          '{"status":"error","message":"Server validation failed"}',
        ),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() =>
      useApiRequest({
        endpoint: "/api/test",
        fallbackErrorMessage: "Fallback",
      }),
    );

    await act(async () => {
      try {
        await result.current.execute({}, () => new URLSearchParams());
      } catch {
        // Expected
      }
    });

    expect(result.current.error).toBe("Server validation failed");
    expect(result.current.isLoading).toBe(false);
  });

  it("should show the fallback message instead of a network error's own text", async () => {
    const mockFetch = vi
      .fn()
      .mockRejectedValue(new TypeError("Failed to fetch"));
    global.fetch = mockFetch;

    const { result } = renderHook(() =>
      useApiRequest({
        endpoint: "/api/test",
        fallbackErrorMessage: "Fallback",
      }),
    );

    await act(async () => {
      try {
        await result.current.execute({}, () => new URLSearchParams());
      } catch {
        // Expected
      }
    });

    expect(result.current.error).toBe("Fallback");
    expect(result.current.isLoading).toBe(false);
  });

  it("should show the message from a non-ok JSON error body", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      text: () =>
        Promise.resolve('{"status":"error","message":"Permission denied"}'),
    });

    const { result } = renderHook(() =>
      useApiRequest({
        endpoint: "/api/test",
        fallbackErrorMessage: "Fallback",
      }),
    );

    await act(async () => {
      await expect(
        result.current.execute({}, () => new URLSearchParams()),
      ).rejects.toThrow("Permission denied");
    });

    expect(result.current.error).toBe("Permission denied");
  });

  it("should show the fallback message when the error message is not a string", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('{"status":"error","message":{"code":1}}'),
    });

    const { result } = renderHook(() =>
      useApiRequest({
        endpoint: "/api/test",
        fallbackErrorMessage: "Fallback",
      }),
    );

    await act(async () => {
      await expect(
        result.current.execute({}, () => new URLSearchParams()),
      ).rejects.toThrow("Fallback");
    });

    expect(result.current.error).toBe("Fallback");
  });

  it("should show the fallback message for a non-ok HTML body", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      text: () =>
        Promise.resolve("<html><title>502 Bad Gateway</title></html>"),
    });

    const { result } = renderHook(() =>
      useApiRequest({
        endpoint: "/api/test",
        fallbackErrorMessage: "Fallback",
      }),
    );

    await act(async () => {
      await expect(
        result.current.execute({}, () => new URLSearchParams()),
      ).rejects.toThrow("Fallback");
    });

    expect(result.current.error).toBe("Fallback");
  });

  it("should handle invalid JSON response", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve("invalid json"),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() =>
      useApiRequest({
        endpoint: "/api/test",
        fallbackErrorMessage: "Fallback",
      }),
    );

    await act(async () => {
      try {
        await result.current.execute({}, () => new URLSearchParams());
      } catch {
        // Expected
      }
    });

    expect(result.current.error).toBe("Fallback");
  });

  it("should fall back to the configured message for an empty error body", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      text: () => Promise.resolve(""),
    });

    const { result } = renderHook(() =>
      useApiRequest({
        endpoint: "/api/test",
        fallbackErrorMessage: "Fallback",
      }),
    );

    await act(async () => {
      await expect(
        result.current.execute({}, () => new URLSearchParams()),
      ).rejects.toThrow("Fallback");
    });

    expect(result.current.error).toBe("Fallback");
  });

  it("should fall back to the configured message for an error payload without a message", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('{"status":"error"}'),
    });

    const { result } = renderHook(() =>
      useApiRequest({
        endpoint: "/api/test",
        fallbackErrorMessage: "Fallback",
      }),
    );

    await act(async () => {
      await expect(
        result.current.execute({}, () => new URLSearchParams()),
      ).rejects.toThrow("Fallback");
    });

    expect(result.current.error).toBe("Fallback");
  });

  it("should abort request on unmount", async () => {
    const abortSpy = vi.fn();
    const mockFetch = vi.fn().mockImplementation((_url, options) => {
      options?.signal?.addEventListener("abort", abortSpy);
      return new Promise(() => {}); // Never resolves
    });
    global.fetch = mockFetch;

    const { result, unmount } = renderHook(() =>
      useApiRequest({
        endpoint: "/api/test",
        fallbackErrorMessage: "Fallback",
      }),
    );

    act(() => {
      result.current.execute({}, () => new URLSearchParams());
    });

    unmount();

    await waitFor(() => {
      expect(abortSpy).toHaveBeenCalled();
    });
  });

  it("should abort previous request when new request is made", async () => {
    const abortSpy = vi.fn();
    let requestCount = 0;
    const mockFetch = vi.fn().mockImplementation((_url, options) => {
      requestCount++;
      if (requestCount === 1) {
        options?.signal?.addEventListener("abort", abortSpy);
        return new Promise(() => {}); // First request never resolves
      }
      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve('{"status":"success"}'),
      });
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() =>
      useApiRequest({
        endpoint: "/api/test",
        fallbackErrorMessage: "Fallback",
      }),
    );

    act(() => {
      result.current.execute({}, () => new URLSearchParams());
    });

    await act(async () => {
      await result.current.execute({}, () => new URLSearchParams());
    });

    expect(abortSpy).toHaveBeenCalled();
  });

  it("should stay loading when a superseded request settles", async () => {
    let requestCount = 0;
    let resolveSecond: (value: Response) => void = () => {};
    global.fetch = vi.fn().mockImplementation((_url, options) => {
      requestCount++;
      if (requestCount === 1) {
        return new Promise((_resolve, reject) => {
          // jsdom's DOMException is not an Error instance, unlike browsers'.
          options?.signal?.addEventListener("abort", () =>
            reject(Object.assign(new Error("Aborted"), { name: "AbortError" })),
          );
        });
      }
      return new Promise<Response>((resolve) => {
        resolveSecond = resolve;
      });
    });

    const { result } = renderHook(() =>
      useApiRequest({
        endpoint: "/api/test",
        fallbackErrorMessage: "Fallback",
      }),
    );

    let first: Promise<unknown> = Promise.resolve();
    act(() => {
      first = result.current.execute({}, () => new URLSearchParams());
    });

    let second: Promise<unknown> = Promise.resolve();
    await act(async () => {
      second = result.current.execute({}, () => new URLSearchParams());
      await first.catch(() => {});
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolveSecond(
        new Response(JSON.stringify({ status: "success" }), { status: 200 }),
      );
      await second;
    });

    expect(result.current.isLoading).toBe(false);
  });

  it("should not set an error when aborted while reading the body", async () => {
    const text = vi.fn();
    global.fetch = vi.fn().mockImplementation((_url, options) => {
      text.mockImplementation(
        () =>
          new Promise((_resolve, reject) => {
            options?.signal?.addEventListener("abort", () =>
              reject(
                Object.assign(new Error("Aborted"), { name: "AbortError" }),
              ),
            );
          }),
      );
      return Promise.resolve({ ok: true, text });
    });

    const { result } = renderHook(() =>
      useApiRequest({
        endpoint: "/api/test",
        fallbackErrorMessage: "Fallback",
      }),
    );

    let pending: Promise<unknown> = Promise.resolve();
    act(() => {
      pending = result.current.execute({}, () => new URLSearchParams());
    });

    await waitFor(() => expect(text).toHaveBeenCalled());

    await act(async () => {
      result.current.abort();
      await expect(pending).rejects.toMatchObject({ name: "AbortError" });
    });

    expect(result.current.error).toBeNull();
  });

  it("should use FormData when provided", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('{"status":"success"}'),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() =>
      useApiRequest({
        endpoint: "/api/upload",
        fallbackErrorMessage: "Fallback",
      }),
    );

    await act(async () => {
      await result.current.execute({}, () => {
        const formData = new FormData();
        formData.append("file", new Blob(["test"]));
        return formData;
      });
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/upload",
      expect.objectContaining({
        method: "POST",
        headers: undefined,
      }),
    );
  });

  it("should use URLSearchParams with correct content-type", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('{"status":"success"}'),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() =>
      useApiRequest({
        endpoint: "/api/test",
        fallbackErrorMessage: "Fallback",
      }),
    );

    await act(async () => {
      await result.current.execute({}, () => {
        const params = new URLSearchParams();
        params.append("key", "value");
        return params;
      });
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/test",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }),
    );
  });
});
