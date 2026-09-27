import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import useLongPress from "./useLongPress";

/** Creates a minimal mouse event with a real currentTarget element. */
const makeMouseEvent = (element: HTMLElement, button = 0) =>
  ({ currentTarget: element, button }) as unknown as React.MouseEvent;

/** Creates a minimal touch event with a real currentTarget element. */
const makeTouchEvent = (element: HTMLElement, clientX = 0, clientY = 0) =>
  ({
    currentTarget: element,
    touches: [{ clientX, clientY }],
  }) as unknown as React.TouchEvent;

describe("useLongPress", () => {
  let element: HTMLButtonElement;

  beforeEach(() => {
    vi.clearAllMocks();
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
    it("ignores presses of buttons other than the primary one", () => {
      const callback = vi.fn();
      const { result } = renderHook(() => useLongPress(callback));

      act(() => {
        result.current.onMouseDown("data")(makeMouseEvent(element, 2));
      });
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(callback).not.toHaveBeenCalled();
    });

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

    it("does not call the callback when the finger moves beyond the tolerance", () => {
      const callback = vi.fn();
      const { result } = renderHook(() => useLongPress(callback));

      act(() => {
        result.current.onTouchStart("data")(makeTouchEvent(element, 100, 100));
      });
      act(() => {
        result.current.onTouchMove(makeTouchEvent(element, 100, 120));
      });
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(callback).not.toHaveBeenCalled();
    });

    it("still calls the callback when the finger only jitters within the tolerance", () => {
      const callback = vi.fn();
      const { result } = renderHook(() => useLongPress(callback));

      act(() => {
        result.current.onTouchStart("data")(makeTouchEvent(element, 100, 100));
      });
      act(() => {
        result.current.onTouchMove(makeTouchEvent(element, 103, 104));
      });
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(callback).toHaveBeenCalledWith("data", element);
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

  describe("click suppression", () => {
    const makeClickEvent = (detail = 1) =>
      ({ detail, stopPropagation: vi.fn() }) as unknown as React.MouseEvent;

    it("swallows exactly one click after a completed long press", () => {
      const { result } = renderHook(() => useLongPress(vi.fn()));

      act(() => {
        result.current.onMouseDown("data")(makeMouseEvent(element));
        vi.advanceTimersByTime(300);
      });

      const firstClick = makeClickEvent();
      const secondClick = makeClickEvent();
      result.current.onClickCapture(firstClick);
      result.current.onClickCapture(secondClick);

      expect(firstClick.stopPropagation).toHaveBeenCalledOnce();
      expect(secondClick.stopPropagation).not.toHaveBeenCalled();
    });

    it("lets a keyboard click through even after a long press without a click", () => {
      const { result } = renderHook(() => useLongPress(vi.fn()));

      act(() => {
        result.current.onTouchStart("data")(makeTouchEvent(element));
        vi.advanceTimersByTime(300);
      });

      const keyboardClick = makeClickEvent(0);
      result.current.onClickCapture(keyboardClick);
      const nextPointerClick = makeClickEvent();
      result.current.onClickCapture(nextPointerClick);

      expect(keyboardClick.stopPropagation).not.toHaveBeenCalled();
      expect(nextPointerClick.stopPropagation).not.toHaveBeenCalled();
    });

    it("does not swallow clicks after a short press", () => {
      const { result } = renderHook(() => useLongPress(vi.fn()));

      act(() => {
        result.current.onMouseDown("data")(makeMouseEvent(element));
        vi.advanceTimersByTime(100);
        result.current.onMouseUp();
      });

      const click = makeClickEvent();
      result.current.onClickCapture(click);

      expect(click.stopPropagation).not.toHaveBeenCalled();
    });

    it("swallows the replayed click after a touch long press", () => {
      const callback = vi.fn();
      const { result } = renderHook(() => useLongPress(callback));

      act(() => {
        result.current.onTouchStart("data")(makeTouchEvent(element));
        vi.advanceTimersByTime(300);
        result.current.onTouchEnd();
        // Browser-emulated mouse events for the same tap.
        result.current.onMouseDown("data")(makeMouseEvent(element));
        result.current.onMouseUp();
      });

      const click = makeClickEvent();
      result.current.onClickCapture(click);

      expect(click.stopPropagation).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledOnce();
    });

    it("forgets a long press that no click followed once a new press starts", () => {
      const { result } = renderHook(() => useLongPress(vi.fn()));

      act(() => {
        result.current.onTouchStart("data")(makeTouchEvent(element));
        vi.advanceTimersByTime(300);
        result.current.onTouchEnd();
      });
      act(() => {
        result.current.onTouchStart("data")(makeTouchEvent(element));
        result.current.onTouchEnd();
      });

      const click = makeClickEvent();
      result.current.onClickCapture(click);

      expect(click.stopPropagation).not.toHaveBeenCalled();
    });
  });
});
