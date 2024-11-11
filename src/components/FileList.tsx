import FileItem, { type File } from "@/components/FileItem";
import LoadingSpinner from "@/components/LoadingSpinner";
import useFetch from "@/hooks/useFetch";

const FileList = () => {
  const { data } = useFetch<File[]>("");

  const gridClasses =
    "grid gap-3 grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10";

  return !data || data.length === 0 ? (
    <LoadingSpinner />
  ) : (
    <div className={`fade-in ${gridClasses}`}>
      {data.map((file, index) => (
        <div>
          <FileItem key={`${file.name}-${index}`} file={file} />
        </div>
      ))}
    </div>
  );
};

export default FileList;
