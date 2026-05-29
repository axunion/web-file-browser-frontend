import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import useLongPress from "./useLongPress";

/** Creates a minimal mouse event with a real currentTarget element. */
const makeMouseEvent = (element: HTMLElement) =>
	({ currentTarget: element }) as unknown as React.MouseEvent;

/** Creates a minimal touch event with a real currentTarget element. */
const makeTouchEvent = (element: HTMLElement) =>
	({ currentTarget: element }) as unknown as React.TouchEvent;

describe("useLongPress", () => {
	let element: HTMLButtonElement;

	beforeEach(() => {
		vi.useFakeTimers();
		element = document.createElement("button");
		document.body.appendChild(element);
	});

	afterEach(() => {
		vi.useRealTimers();
		document.body.removeChild(element);
	});

	describe("callback triggering", () => {
		it("calls the callback with data and element after the default delay (300ms)", () => {
			const callback = vi.fn();
			const { result } = renderHook(() => useLongPress(callback));

			act(() => {
				result.current.onMouseDown("payload")(makeMouseEvent(element));
			});

			expect(callback).not.toHaveBeenCalled();

			act(() => {
				vi.advanceTimersByTime(300);
			});

			expect(callback).toHaveBeenCalledWith("payload", element);
		});

		it("calls the callback after a custom delay", () => {
			const callback = vi.fn();
			const { result } = renderHook(() =>
				useLongPress(callback, { delay: 500 }),
			);

			act(() => {
				result.current.onMouseDown("data")(makeMouseEvent(element));
			});

			act(() => {
				vi.advanceTimersByTime(499);
			});
			expect(callback).not.toHaveBeenCalled();

			act(() => {
				vi.advanceTimersByTime(1);
			});
			expect(callback).toHaveBeenCalledWith("data", element);
		});

		it("triggers via touch events after the delay", () => {
			const callback = vi.fn();
			const { result } = renderHook(() => useLongPress(callback));

			act(() => {
				result.current.onTouchStart("touch-payload")(makeTouchEvent(element));
			});

			act(() => {
				vi.advanceTimersByTime(300);
			});

			expect(callback).toHaveBeenCalledWith("touch-payload", element);
		});
	});

	describe("cancellation", () => {
		it("does not call the callback when onMouseUp fires before the delay", () => {
			const callback = vi.fn();
			const { result } = renderHook(() => useLongPress(callback));

			act(() => {
				result.current.onMouseDown("data")(makeMouseEvent(element));
			});
			act(() => {
				result.current.onMouseUp();
			});
			act(() => {
				vi.advanceTimersByTime(300);
			});

			expect(callback).not.toHaveBeenCalled();
		});

		it("does not call the callback when onMouseLeave fires before the delay", () => {
			const callback = vi.fn();
			const { result } = renderHook(() => useLongPress(callback));

			act(() => {
				result.current.onMouseDown("data")(makeMouseEvent(element));
			});
			act(() => {
				result.current.onMouseLeave();
			});
			act(() => {
				vi.advanceTimersByTime(300);
			});

			expect(callback).not.toHaveBeenCalled();
		});

		it("does not call the callback when onTouchEnd fires before the delay", () => {
			const callback = vi.fn();
			const { result } = renderHook(() => useLongPress(callback));

			act(() => {
				result.current.onTouchStart("data")(makeTouchEvent(element));
			});
			act(() => {
				result.current.onTouchEnd();
			});
			act(() => {
				vi.advanceTimersByTime(300);
			});

			expect(callback).not.toHaveBeenCalled();
		});

		it("does not call the callback when onTouchCancel fires before the delay", () => {
			const callback = vi.fn();
			const { result } = renderHook(() => useLongPress(callback));

			act(() => {
				result.current.onTouchStart("data")(makeTouchEvent(element));
			});
			act(() => {
				result.current.onTouchCancel();
			});
			act(() => {
				vi.advanceTimersByTime(300);
			});

			expect(callback).not.toHaveBeenCalled();
		});
	});

	describe("cleanup", () => {
		it("clears the pending timer on unmount", () => {
			const callback = vi.fn();
			const { result, unmount } = renderHook(() => useLongPress(callback));

			act(() => {
				result.current.onMouseDown("data")(makeMouseEvent(element));
			});

			unmount();

			act(() => {
				vi.advanceTimersByTime(300);
			});

			expect(callback).not.toHaveBeenCalled();
		});

		it("cancels the previous timer when a new press starts", () => {
			const callback = vi.fn();
			const { result } = renderHook(() => useLongPress(callback));

			act(() => {
				result.current.onMouseDown("first")(makeMouseEvent(element));
			});
			act(() => {
				vi.advanceTimersByTime(150); // half delay
			});

			// Start a new press — clears previous timer, restarts
			act(() => {
				result.current.onMouseDown("second")(makeMouseEvent(element));
			});
			act(() => {
				vi.advanceTimersByTime(300);
			});

			// Only the second press's callback should fire
			expect(callback).toHaveBeenCalledTimes(1);
			expect(callback).toHaveBeenCalledWith("second", element);
		});
	});
});
