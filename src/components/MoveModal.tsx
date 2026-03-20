import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";
import Modal from "@/components/Modal";
import { MESSAGES } from "@/constants/messages";
import useFileList from "@/hooks/useFileList";
import useFileMove from "@/hooks/useFileMove";
import { type DirectoryItem, isErrorResponse } from "@/types/api";
import { toEncodedPath } from "@/utils/path";
import commonStyles from "./ModalCommon.module.css";
import styles from "./MoveModal.module.css";

export type MoveModalProps = {
	item: DirectoryItem;
	currentPath: string;
	onClose: () => void;
	onSuccess: () => void;
};

const MoveModal = ({
	item,
	currentPath,
	onClose,
	onSuccess,
}: MoveModalProps) => {
	const [browsePaths, setBrowsePaths] = useState<string[]>([]);
	const [error, setError] = useState<string | null>(null);
	const { moveFile, isLoading } = useFileMove();
	const {
		items,
		isLoading: isLoadingDirs,
		setPath,
	} = useFileList("", {
		isolated: true,
	});

	const browsePath = useMemo(() => toEncodedPath(browsePaths), [browsePaths]);

	const directories = useMemo(
		() => items.filter((listItem) => listItem.type === "directory"),
		[items],
	);

	const handleNavigateUp = () => {
		const newPaths = browsePaths.slice(0, -1);
		setBrowsePaths(newPaths);
		setPath(toEncodedPath(newPaths));
	};

	const handleNavigateInto = (dirName: string) => {
		const newPaths = [...browsePaths, dirName];
		setBrowsePaths(newPaths);
		setPath(toEncodedPath(newPaths));
	};

	const handleMove = async () => {
		try {
			const response = await moveFile({
				path: currentPath,
				name: item.name,
				destinationPath: browsePath || "/",
			});

			if (isErrorResponse(response)) {
				setError(response.message || MESSAGES.FILE_MOVE_ERROR);
				return;
			}

			onSuccess();
		} catch (moveError) {
			setError(
				moveError instanceof Error
					? moveError.message
					: MESSAGES.FILE_MOVE_ERROR,
			);
		}
	};

	const canMove = browsePath !== currentPath;
	const displayPath =
		browsePaths.length > 0 ? `/${browsePaths.join("/")}` : "/";

	return (
		<Modal onClose={onClose}>
			<section>
				<div className={commonStyles.header}>
					<Icon icon="mdi:folder-move-outline" className={commonStyles.icon} />
					<span className={commonStyles.title}>{MESSAGES.MOVE}</span>
				</div>

				<div className={styles.pathSection}>
					<p className={styles.pathLabel}>{MESSAGES.SELECT_DESTINATION}</p>
					<div className={styles.pathValue}>{displayPath}</div>
				</div>

				<div className={styles.directoryList}>
					{browsePaths.length > 0 && (
						<button
							type="button"
							className={`${styles.directoryButton} ${styles.navigateUpButton}`}
							onClick={handleNavigateUp}
							aria-label={MESSAGES.NAVIGATE_PARENT}
						>
							<Icon icon="mdi:folder-open" className={styles.folderIcon} />
							<span aria-hidden="true">..</span>
						</button>
					)}

					{isLoadingDirs ? (
						<div className={styles.stateMessage}>{MESSAGES.LOADING}</div>
					) : directories.length === 0 ? (
						<div className={styles.stateMessage}>{MESSAGES.NO_DIRECTORIES}</div>
					) : (
						directories
							.filter(
								(dir) =>
									!(browsePath === currentPath && dir.name === item.name),
							)
							.map((dir) => (
								<button
									key={dir.name}
									type="button"
									className={styles.directoryButton}
									onClick={() => handleNavigateInto(dir.name)}
								>
									<Icon icon="mdi:folder" className={styles.folderIcon} />
									<span className={styles.directoryName}>{dir.name}</span>
								</button>
							))
					)}
				</div>

				{error && (
					<p className={`${commonStyles.error} ${styles.error}`}>{error}</p>
				)}

				<div className={`${commonStyles.actions} ${styles.actions}`}>
					<button
						type="button"
						onClick={handleMove}
						disabled={isLoading || !canMove}
						className={`${commonStyles.submitButton} ${styles.submitButton}`}
					>
						{MESSAGES.CONFIRM}
					</button>
				</div>
			</section>
		</Modal>
	);
};

export default MoveModal;
