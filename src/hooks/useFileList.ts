import type { DirectoryItem, ApiResponse } from "@/types/api";
import useSWR from "swr";

type Fetcher = (...args: [RequestInfo, RequestInit?]) => Promise<ApiResponse>;
type UseFileList = {
	fileList?: DirectoryItem[];
	error?: Error;
	isLoading: boolean;
};

const endpoint: string = import.meta.env.VITE_ENDPOINT_LIST;
const fetcher: Fetcher = (...args) => fetch(...args).then((res) => res.json());

const useFileList = (path: string): UseFileList => {
	const key = `${endpoint}${path}`;
	const { data, error, isLoading } = useSWR<ApiResponse, Error>(key, fetcher);

	return {
		fileList: data?.list,
		error,
		isLoading,
	};
};

export default useFileList;
