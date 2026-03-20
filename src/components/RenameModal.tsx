import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import Modal from "@/components/Modal";
import { MESSAGES } from "@/constants/messages";
import useFileRename from "@/hooks/useFileRename";
import { type DirectoryItem, isErrorResponse } from "@/types/api";
import commonStyles from "./ModalCommon.module.css";
import styles from "./RenameModal.module.css";

export type RenameModalProps = {
	item: DirectoryItem;
	currentPath: string;
	onClose: () => void;
	onSuccess: () => void;
};

const RenameModal = ({
	item,
	currentPath,
	onClose,
	onSuccess,
}: RenameModalProps) => {
	const originalName = item.name;
	const dotIndex = item.type === "file" ? originalName.lastIndexOf(".") : -1;
	const hasExtension = dotIndex > 0;
	const nameWithoutExt = hasExtension
		? originalName.substring(0, dotIndex)
		: originalName;
	const extension = hasExtension ? originalName.substring(dotIndex) : "";

	const [newName, setNewName] = useState(nameWithoutExt);
	const [error, setError] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const { renameFile, isLoading } = useFileRename();

	const validateName = (trimmed: string): string | null => {
		if (trimmed === "." || trimmed === "..") {
			return MESSAGES.INVALID_NAME;
		}

		const invalidChars = ["<", ">", ":", '"', "/", "\\", "|", "?", "*"];
		const hasInvalidChar = invalidChars.some((char) => trimmed.includes(char));

		const hasControlChar = trimmed.split("").some((char) => {
			const code = char.charCodeAt(0);
			return code < 32 || (code >= 127 && code <= 159);
		});

		if (hasInvalidChar || hasControlChar) {
			return MESSAGES.INVALID_NAME_CHARACTERS;
		}

		return null;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const trimmed = newName.trim();
		const validationError = validateName(trimmed);

		if (validationError) {
			setError(validationError);
			return;
		}

		const fullNewName = trimmed + extension;

		if (trimmed === nameWithoutExt) {
			onClose();
			return;
		}

		try {
			const response = await renameFile({
				path: currentPath,
				name: originalName,
				newName: fullNewName,
			});

			if (isErrorResponse(response)) {
				setError(response.message || MESSAGES.FILE_RENAME_ERROR);
				return;
			}

			onSuccess();
		} catch (error) {
			setError(
				error instanceof Error ? error.message : MESSAGES.FILE_RENAME_ERROR,
			);
		}
	};

	useEffect(() => {
		if (!inputRef.current) return;
		inputRef.current.focus();
		inputRef.current.select();
	}, []);

	return (
		<Modal onClose={onClose}>
			<section>
				<div className={commonStyles.header}>
					<Icon icon="line-md:edit" className={commonStyles.icon} />
					<span className={commonStyles.title}>{MESSAGES.RENAME}</span>
				</div>

				<form onSubmit={handleSubmit}>
					<div className={styles.formGroup}>
						<input
							ref={inputRef}
							type="text"
							value={newName}
							onChange={(e) => {
								setNewName(e.target.value);
								setError(null);
							}}
							disabled={isLoading}
							className={styles.input}
						/>
						{error && (
							<p className={`${commonStyles.error} ${styles.error}`}>{error}</p>
						)}
					</div>

					<div className={commonStyles.actions}>
						<button
							type="submit"
							disabled={
								isLoading ||
								!newName.trim() ||
								newName.trim() === nameWithoutExt
							}
							className={`${commonStyles.submitButton} ${styles.submitButton}`}
						>
							{MESSAGES.CONFIRM}
						</button>
					</div>
				</form>
			</section>
		</Modal>
	);
};

export default RenameModal;
