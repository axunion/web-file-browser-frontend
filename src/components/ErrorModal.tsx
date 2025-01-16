import Modal from "@/components/Modal";
import { Icon } from "@iconify/react";

export type ErrorProps = {
	onClose: () => void;
	children: React.ReactNode;
};

const ErrorModal = ({ onClose, children }: ErrorProps) => {
	return (
		<Modal onClose={onClose}>
			<section>
				<div className="flex gap-2 items-center">
					<Icon icon="flat-color-icons:high-priority" className="w-6 h-6" />
					<span className="text-xl">Error</span>
				</div>

				<p className="my-8 text-sm">{children}</p>
			</section>
		</Modal>
	);
};

export default ErrorModal;
