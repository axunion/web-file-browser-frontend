import { Icon } from "@iconify/react";
import { MESSAGES } from "@/constants/messages";

export type BackButtonProps = {
	onBack: () => void;
};

const BackButton = ({ onBack }: BackButtonProps) => {
	return (
		<button
			type="button"
			className="text-(--primary-color)"
			onClick={onBack}
			aria-label={MESSAGES.BACK}
		>
			<Icon icon="line-md:chevron-left" className="w-8 h-8" />
		</button>
	);
};

export default BackButton;
