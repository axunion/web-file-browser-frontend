import type { ApiResponse, DirectoryItem } from "@/types/api";
import { useCallback, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";

type Fetcher = (...args: [RequestInfo, RequestInit?]) => Promise<ApiResponse>;

const endpoint: string = import.meta.env.VITE_ENDPOINT_LIST ?? "";
const fetcher: Fetcher = (...args) => fetch(...args).then((res) => res.json());
const buildPath = (path: string) => endpoint + (path ? `?path=${path}` : "");

const useFileList = (initPath: string) => {
	const [path, setPath] = useState(initPath);
	const [fileList, setFileList] = useState<DirectoryItem[]>([]);

	const memoizedFetcher = useCallback(fetcher, []);
	const { data, error, isValidating } = useSWR<ApiResponse>(
		buildPath(path),
		memoizedFetcher,
	);

	useEffect(() => {
		if (Array.isArray(data?.list)) {
			setFileList(data.list);
		}
	}, [data]);

	const fetchFileList = useCallback((newPath: string) => {
		setPath(newPath);
		mutate(buildPath(newPath));
	}, []);

	return {
		fileList,
		isLoading: isValidating,
		error,
		fetchFileList,
	};
};

export default useFileList;
