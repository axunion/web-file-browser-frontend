import FileItem from "@/components/FileItem";
import type { DirectoryItem } from "@/types/api";

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
					<FileItem file={file} />
				</div>
			))}
		</div>
	);
};

export default FileList;
