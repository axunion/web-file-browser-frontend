import { useCallback, useEffect, useRef } from "react";

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
};

/**
 * Hook for handling long press interactions on elements
 * @param callback Function to call when long press is detected
 * @param options Configuration options (delay, etc.)
 * @returns Object with event handlers for long press detection
 */
const useLongPress = <T>(
	callback: LongPressCallback<T>,
	options: LongPressOptions = {},
): LongPressResult<T> => {
	const { delay = 300 } = options;
	const timeoutRef = useRef<number | null>(null);

	const clearLongPress = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	}, []);

	const startLongPress = useCallback(
		(data: T, event: React.MouseEvent | React.TouchEvent) => {
			event.preventDefault();

			clearLongPress();

			const element = event.currentTarget as HTMLElement;
			if (!element) return;

			timeoutRef.current = setTimeout(() => {
				callback(data, element);
			}, delay);
		},
		[callback, delay, clearLongPress],
	);

	useEffect(() => {
		return () => {
			clearLongPress();
		};
	}, [clearLongPress]);

	return {
		onMouseDown: useCallback(
			(data: T) => (event: React.MouseEvent) => startLongPress(data, event),
			[startLongPress],
		),
		onMouseUp: clearLongPress,
		onMouseLeave: clearLongPress,
		onTouchStart: useCallback(
			(data: T) => (event: React.TouchEvent) => startLongPress(data, event),
			[startLongPress],
		),
		onTouchEnd: clearLongPress,
	};
};

export default useLongPress;
