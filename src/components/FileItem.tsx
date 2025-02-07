import type { DirectoryItem } from "@/types/api";
import { getFileType } from "@/utils/fileType";
import { Icon } from "@iconify/react";

export type FileItemProps = {
	file: DirectoryItem;
	dirPath: string;
};

const iconSize = "w-16 h-16";
const icons = {
	audio: <Icon icon="flat-color-icons:audio-file" className={iconSize} />,
	text: <Icon icon="flat-color-icons:document" className={iconSize} />,
	file: <Icon icon="flat-color-icons:file" className={iconSize} />,
};

const FileItem = ({ file, dirPath }: FileItemProps) => {
	const fileType = getFileType(file.name);
	const src = `${dirPath}/${file.name}`;

	const renderContent = () => {
		switch (fileType) {
			case "image":
				return <img src={src} className="h-15 pb-1" alt="" />;
			case "video":
				return (
					<video src={src} className="h-16 aspect-video" controls>
						<track kind="captions" />
					</video>
				);
			default:
				return icons[fileType] || icons.file;
		}
	};

	return (
		<span className="max-w-full mx-auto flex flex-col items-center justify-center p-2 cursor-pointer">
			{renderContent()}
			<div className="line-clamp-2 mt-1 px-2 text-xs text-left break-all">
				{file.name}
			</div>
		</span>
	);
};

export default FileItem;
