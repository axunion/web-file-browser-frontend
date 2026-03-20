import { Icon } from "@iconify/react";
import { MESSAGES } from "@/constants/messages";
import styles from "./BackButton.module.css";

export type BackButtonProps = {
	onBack: () => void;
};

const BackButton = ({ onBack }: BackButtonProps) => {
	return (
		<button
			type="button"
			className={styles.button}
			onClick={onBack}
			aria-label={MESSAGES.BACK}
		>
			<Icon icon="line-md:chevron-left" className={styles.icon} />
		</button>
	);
};

export default BackButton;
