import { appendPath } from "@/utils/path";
import FileItem from "@/components/FileItem";
import type { DirectoryItem } from "@/types/api";
import { Icon } from "@iconify/react";

export type FileListProps = {
	list: DirectoryItem[];
};

const FileList = ({ list }: FileListProps) => {
	const gridClasses =
		"grid gap-x-2 gap-y-4 grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10";

	return (
		<div className={`fade-in ${gridClasses}`}>
			{list.map((file, index) => (
				<div key={`${file.name}-${index}`}>
					{file.type === "directory" ? (
						<button
							type="button"
							aria-label={`File type is ${file.type}`}
							className="max-w-full mx-auto flex flex-col items-center justify-center p-2 cursor-pointer"
							onClick={() => appendPath(file.name)}
						>
							<Icon icon="flat-color-icons:folder" className="w-16 h-16" />

							<div className="line-clamp-2 mt-1 px-2 text-xs text-left break-all">
								{file.name}
							</div>
						</button>
					) : (
						<FileItem file={file} />
					)}
				</div>
			))}
		</div>
	);
};

export default FileList;
