import { Icon } from "@iconify/react";
import { createPortal } from "react-dom";

const LoadingSpinner = () => {
	return createPortal(
		<div className="fixed inset-0 bg-[#ffffff80] flex items-center justify-center z-50">
			<Icon icon="eos-icons:loading" className="h-10 w-10" />
		</div>,
		document.body,
	);
};

export default LoadingSpinner;
