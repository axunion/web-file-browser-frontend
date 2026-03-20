import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { SWRConfig } from "swr";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import useFileList from "./useFileList";

const createResponse = (body: string, ok = true) => ({
	ok,
	text: () => Promise.resolve(body),
});

const wrapper = ({ children }: { children: ReactNode }) =>
	createElement(SWRConfig, { value: { dedupingInterval: 0 } }, children);

describe("useFileList", () => {
	const originalFetch = global.fetch;

	beforeEach(() => {
		vi.resetAllMocks();
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

		const { result } = renderHook(() => useFileList(""), { wrapper });

		await waitFor(() => {
			expect(result.current.items).toEqual([
				{ name: "root.txt", type: "file" },
			]);
		});

		act(() => {
			result.current.setPath("special%20folder");
		});

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
