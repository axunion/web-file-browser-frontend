import { ChevronLeft } from "lucide-react";
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
      <ChevronLeft className={styles.icon} />
    </button>
  );
};

export default BackButton;
