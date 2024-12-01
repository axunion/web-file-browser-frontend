import type { ApiResponse } from "@/types/api";
import FileItem from "@/components/FileItem";
import LoadingSpinner from "@/components/LoadingSpinner";
import useFetch from "@/hooks/useFetch";
import useHash from "@/hooks/useHash";

const FileList = () => {
  const [hash] = useHash();
  const baseUrl = import.meta.env.VITE_ENDPOINT_LIST;
  const params = hash ? { path: hash.slice(1) } : undefined;
  const { response, error, loading } = useFetch<ApiResponse>(baseUrl, params);

  const gridClasses =
    "grid gap-x-2 gap-y-4 grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10";

  return loading || error || !response || !response.list ? (
    <LoadingSpinner />
  ) : (
    <div className={`fade-in ${gridClasses}`}>
      {response.list.map((file, index) => (
        <div key={`${file.name}-${index}`}>
          <FileItem file={file} />
        </div>
      ))}
    </div>
  );
};

export default FileList;
