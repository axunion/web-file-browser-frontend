import type { DirectoryItem } from "@/types/api";
import { getFileType } from "@/utils/getFileType";
import { Icon } from "@iconify/react";

export type FileItemProps = {
	file: DirectoryItem;
};

const iconSize = "w-16 h-16";
const icons = {
	directory: <Icon icon="flat-color-icons:folder" className={iconSize} />,
	file: <Icon icon="flat-color-icons:file" className={iconSize} />,
	video: <Icon icon="flat-color-icons:video-file" className={iconSize} />,
	audio: <Icon icon="flat-color-icons:audio-file" className={iconSize} />,
	image: <Icon icon="flat-color-icons:image-file" className={iconSize} />,
	text: <Icon icon="flat-color-icons:file" className={iconSize} />,
};

const FileItem = ({ file }: FileItemProps) => {
	const fileType =
		file.type === "directory" ? "directory" : getFileType(file.name);

	const handleClick = () => {
		console.log(file);
	};

	return (
		<button
			type="button"
			aria-label={`File type is ${file.type}`}
			className="max-w-full mx-auto flex flex-col items-center justify-center p-2"
			onClick={handleClick}
		>
			{icons[fileType]}
			<span className=" mt-2 text-xs text-left line-clamp-2">{file.name}</span>
		</button>
	);
};

export default FileItem;
