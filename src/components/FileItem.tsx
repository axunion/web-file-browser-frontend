import { Icon } from "@iconify/react";
import { memo } from "react";
import { getImageAlt, getOpenFileAriaLabel } from "@/constants/messages";
import type { DirectoryItem } from "@/types/api";
import { getFileType } from "@/utils/fileType";
import styles from "./FileItem.module.css";

export type FileItemProps = {
	file: DirectoryItem;
	dirPath: string;
};

const icons = {
	video: <Icon icon="flat-color-icons:video-file" className={styles.icon} />,
	audio: <Icon icon="flat-color-icons:audio-file" className={styles.icon} />,
	text: <Icon icon="flat-color-icons:document" className={styles.icon} />,
	pdf: <Icon icon="vscode-icons:file-type-pdf2" className={styles.icon} />,
	file: <Icon icon="flat-color-icons:file" className={styles.icon} />,
};

const FileItem = memo(({ file, dirPath }: FileItemProps) => {
	if (file.type === "directory") {
		return (
			<>
				<Icon icon="flat-color-icons:folder" className={styles.icon} />
				<div className={styles.name}>{file.name}</div>
			</>
		);
	}

	const fileType = getFileType(file.name);
	const src = `${dirPath}${encodeURIComponent(file.name)}`;

	if (fileType === "image") {
		return (
			<>
				<img
					src={src}
					className={styles.image}
					alt={getImageAlt(file.name)}
					loading="lazy"
				/>
				<div className={styles.name}>{file.name}</div>
			</>
		);
	}

	return (
		<a
			href={src}
			target="_blank"
			rel="noreferrer"
			className={styles.link}
			onClick={(e) => e.stopPropagation()}
			aria-label={getOpenFileAriaLabel(file.name)}
		>
			{icons[fileType] ?? icons.file}
			<div className={styles.name}>{file.name}</div>
		</a>
	);
});

export default FileItem;
