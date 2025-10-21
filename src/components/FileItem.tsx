import { Icon } from "@iconify/react";
import type { DirectoryItem } from "@/types/api";
import { getFileType } from "@/utils/fileType";

export type FileItemProps = {
	file: DirectoryItem;
	dirPath: string;
};

const iconSize = "w-16 h-16";
const icons = {
	video: <Icon icon="flat-color-icons:video-file" className={iconSize} />,
	audio: <Icon icon="flat-color-icons:audio-file" className={iconSize} />,
	text: <Icon icon="flat-color-icons:document" className={iconSize} />,
	pdf: <Icon icon="vscode-icons:file-type-pdf2" className={iconSize} />,
	file: <Icon icon="flat-color-icons:file" className={iconSize} />,
};
const nameStyle = "line-clamp-2 p-1 text-xs break-all";

const FileItem = ({ file, dirPath }: FileItemProps) => {
	if (file.type === "directory") {
		return (
			<>
				<Icon icon="flat-color-icons:folder" className={iconSize} />
				<div className={nameStyle}>{file.name}</div>
			</>
		);
	}

	const fileType = getFileType(file.name);
	const src = `${dirPath}${file.name}`;

	if (fileType === "image") {
		return (
			<>
				<img src={src} className="h-16" alt="" loading="lazy" />
				<div className={nameStyle}>{file.name}</div>
			</>
		);
	}

	return (
		<a
			href={src}
			target="_blank"
			rel="noreferrer"
			className="flex flex-col items-center"
			onClick={(e) => e.stopPropagation()}
		>
			{icons[fileType] ?? icons.file}
			<div className={nameStyle}>{file.name}</div>
		</a>
	);
};

export default FileItem;
