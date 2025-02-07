import FileItem from "@/components/FileItem";
import type { DirectoryItem } from "@/types/api";
import { appendPath, getPath } from "@/utils/path";
import { Icon } from "@iconify/react";

export type FileListProps = {
	list: DirectoryItem[];
};

const endpoint: string = import.meta.env.VITE_ENDPOINT_DATA ?? "";

const FileList = ({ list }: FileListProps) => {
	const dirPath = `${endpoint}${getPath().path}/`;
	const gridClasses =
		"grid gap-x-2 gap-y-4 grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10";

	return (
		<div className={`fade-in ${gridClasses}`}>
			{list.map((item, index) => (
				<div key={`${item.name}-${index}`}>
					{item.type === "directory" ? (
						<button
							type="button"
							aria-label={`File type is ${item.type}`}
							className="max-w-full mx-auto flex flex-col items-center justify-center p-2 cursor-pointer"
							onClick={() => appendPath(item.name)}
						>
							<Icon icon="flat-color-icons:folder" className="w-16 h-16" />

							<div className="line-clamp-2 px-2 text-xs text-left break-all">
								{item.name}
							</div>
						</button>
					) : (
						<FileItem file={item} dirPath={dirPath} />
					)}
				</div>
			))}
		</div>
	);
};

export default FileList;
