import { Icon } from "@iconify/react";
import type { DirectoryItem } from "@/types/api";
import { getFileType } from "@/utils/fileType";

export type FileItemProps = {
	file: DirectoryItem;
	dirPath: string;
};

const iconSize = "w-16 h-16";
const icons = {
	text: <Icon icon="flat-color-icons:document" className={iconSize} />,
	pdf: <Icon icon="vscode-icons:file-type-pdf2" className={iconSize} />,
	file: <Icon icon="flat-color-icons:file" className={iconSize} />,
};

const FileItem = ({ file, dirPath }: FileItemProps) => {
	const fileType = getFileType(file.name);
	const src = `${dirPath}${file.name}`;

	switch (fileType) {
		case "video":
			return (
				<video controls src={src} className="h-16 aspect-video">
					<track kind="captions" />
				</video>
			);
		case "audio":
			return (
				<audio controls src={src}>
					<track kind="captions" />
				</audio>
			);
		case "image":
			return <img src={src} className="h-15 pb-1" alt="" />;
		default:
			return (
				<a href={src} target="_blank" rel="noreferrer">
					{icons[fileType] ?? icons.file}
				</a>
			);
	}
};

export default FileItem;
