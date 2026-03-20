import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import useApiRequest from "./useApiRequest";

describe("useApiRequest", () => {
	const originalFetch = global.fetch;

	beforeEach(() => {
		vi.resetAllMocks();
	});

	afterEach(() => {
		global.fetch = originalFetch;
		vi.restoreAllMocks();
	});

	it("should initialize with default state", () => {
		const { result } = renderHook(() =>
			useApiRequest({ endpoint: "/api/test" }),
		);

		expect(result.current.isLoading).toBe(false);
		expect(result.current.error).toBeNull();
		expect(typeof result.current.execute).toBe("function");
		expect(typeof result.current.abort).toBe("function");
	});

	it("should set loading state during request", async () => {
		const mockFetch = vi.fn().mockImplementation(
			() =>
				new Promise((resolve) =>
					setTimeout(
						() =>
							resolve({
								ok: true,
								text: () => Promise.resolve('{"status":"success"}'),
							}),
						100,
					),
				),
		);
		global.fetch = mockFetch;

		const { result } = renderHook(() =>
			useApiRequest({ endpoint: "/api/test" }),
		);

		act(() => {
			result.current.execute({}, () => new URLSearchParams());
		});

		expect(result.current.isLoading).toBe(true);
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
			useApiRequest({ endpoint: "/api/test" }),
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

	it("should handle fetch errors", async () => {
		const mockFetch = vi.fn().mockRejectedValue(new Error("Network error"));
		global.fetch = mockFetch;

		const { result } = renderHook(() =>
			useApiRequest({ endpoint: "/api/test" }),
		);

		await act(async () => {
			try {
				await result.current.execute({}, () => new URLSearchParams());
			} catch {
				// Expected
			}
		});

		expect(result.current.error).toBe("Network error");
		expect(result.current.isLoading).toBe(false);
	});

	it("should handle non-ok response", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: false,
			text: () => Promise.resolve("Not Found"),
		});
		global.fetch = mockFetch;

		const { result } = renderHook(() =>
			useApiRequest({ endpoint: "/api/test" }),
		);

		await act(async () => {
			try {
				await result.current.execute({}, () => new URLSearchParams());
			} catch {
				// Expected
			}
		});

		expect(result.current.error).toBe("Not Found");
	});

	it("should handle invalid JSON response", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			text: () => Promise.resolve("invalid json"),
		});
		global.fetch = mockFetch;

		const { result } = renderHook(() =>
			useApiRequest({ endpoint: "/api/test" }),
		);

		await act(async () => {
			try {
				await result.current.execute({}, () => new URLSearchParams());
			} catch {
				// Expected
			}
		});

		expect(result.current.error).toBe("Invalid JSON response from server");
	});

	it("should abort request on unmount", async () => {
		const abortSpy = vi.fn();
		const mockFetch = vi.fn().mockImplementation((_url, options) => {
			options?.signal?.addEventListener("abort", abortSpy);
			return new Promise(() => {}); // Never resolves
		});
		global.fetch = mockFetch;

		const { result, unmount } = renderHook(() =>
			useApiRequest({ endpoint: "/api/test" }),
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
			useApiRequest({ endpoint: "/api/test" }),
		);

		act(() => {
			result.current.execute({}, () => new URLSearchParams());
		});

		await act(async () => {
			await result.current.execute({}, () => new URLSearchParams());
		});

		expect(abortSpy).toHaveBeenCalled();
	});

	it("should use FormData when provided", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			text: () => Promise.resolve('{"status":"success"}'),
		});
		global.fetch = mockFetch;

		const { result } = renderHook(() =>
			useApiRequest({ endpoint: "/api/upload" }),
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
			useApiRequest({ endpoint: "/api/test" }),
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
