import type { ApiResponse } from "@/types/api";
import useSWR from "swr";

type Fetcher = (...args: [RequestInfo, RequestInit?]) => Promise<ApiResponse>;

const endpoint: string = import.meta.env.VITE_ENDPOINT_LIST;
const fetcher: Fetcher = (...args) => fetch(...args).then((res) => res.json());

const useFileList = (path: string) => {
	const key = `${endpoint}${path}`;
	const { data, error, isLoading } = useSWR<ApiResponse, Error>(key, fetcher);

	return {
		data,
		error,
		isLoading,
	};
};

export default useFileList;
