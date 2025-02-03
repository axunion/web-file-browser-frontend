import type { DirectoryItem } from "@/types/api";
import { getFileType } from "@/utils/fileType";
import { appendPath } from "@/utils/path";
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
	text: <Icon icon="flat-color-icons:document" className={iconSize} />,
};

const FileItem = ({ file }: FileItemProps) => {
	const fileType = getFileType(file.name);

	const handleClick = () => {
		if (file.type === "directory") {
			appendPath(file.name);
		}
	};

	return (
		<button
			type="button"
			aria-label={`File type is ${file.type}`}
			className="max-w-full mx-auto flex flex-col items-center justify-center p-2 cursor-pointer"
			onClick={handleClick}
		>
			{icons[fileType]}

			<div className="line-clamp-2 mt-1 px-2 text-xs text-left break-all">
				{file.name}
			</div>
		</button>
	);
};

export default FileItem;
