import { createPortal } from "react-dom";

const LoadingSpinner = () => {
	return createPortal(
		<div className="fixed inset-0 bg-[#ffffff80] flex items-center justify-center z-50">
			<div className="animate-spin rounded-full h-8 w-8 border-t-4 border-amber-900" />
		</div>,
		document.body,
	);
};

export default LoadingSpinner;
