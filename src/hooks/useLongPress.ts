import { useCallback, useEffect, useRef } from "react";

// Browsers replay a tap as mousedown/mouseup/click shortly after touchend.
const EMULATED_MOUSE_WINDOW_MS = 1000;

type LongPressCallback<T> = (data: T, element: HTMLElement) => void;

type LongPressOptions = {
  delay?: number;
};

type LongPressResult<T> = {
  onMouseDown: (data: T) => (event: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onTouchStart: (data: T) => (event: React.TouchEvent) => void;
  onTouchEnd: () => void;
  onTouchCancel: () => void;
  /** Swallows the pointer click that follows a completed long press. */
  onClickCapture: (event: React.MouseEvent) => void;
};

const useLongPress = <T>(
  callback: LongPressCallback<T>,
  options: LongPressOptions = {},
): LongPressResult<T> => {
  const { delay = 300 } = options;
  const timeoutRef = useRef<number | null>(null);
  const firedRef = useRef(false);
  const lastTouchEndRef = useRef(0);

  const clearLongPress = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const startLongPress = useCallback(
    (data: T, event: React.MouseEvent | React.TouchEvent) => {
      clearLongPress();
      firedRef.current = false;

      const element = event.currentTarget as HTMLElement;
      if (!element) return;

      timeoutRef.current = window.setTimeout(() => {
        firedRef.current = true;
        callback(data, element);
      }, delay);
    },
    [callback, delay, clearLongPress],
  );

  const endTouch = useCallback(() => {
    clearLongPress();
    lastTouchEndRef.current = Date.now();
  }, [clearLongPress]);

  useEffect(() => {
    return () => {
      clearLongPress();
    };
  }, [clearLongPress]);

  return {
    onMouseDown: useCallback(
      (data: T) => (event: React.MouseEvent) => {
        // Ignore the replayed mousedown so it can't reset a completed touch long press.
        if (Date.now() - lastTouchEndRef.current < EMULATED_MOUSE_WINDOW_MS) {
          return;
        }
        startLongPress(data, event);
      },
      [startLongPress],
    ),
    onMouseUp: clearLongPress,
    onMouseLeave: clearLongPress,
    onTouchStart: useCallback(
      (data: T) => (event: React.TouchEvent) => startLongPress(data, event),
      [startLongPress],
    ),
    onTouchEnd: endTouch,
    onTouchCancel: endTouch,
    onClickCapture: useCallback((event: React.MouseEvent) => {
      if (!firedRef.current) return;
      firedRef.current = false;
      // Keyboard-activated clicks (detail 0) never end a press, so let them through.
      if (event.detail !== 0) {
        event.stopPropagation();
      }
    }, []),
  };
};

export default useLongPress;
