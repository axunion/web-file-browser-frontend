import { useCallback, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { ENDPOINT_LIST } from "@/constants/config";
import type { DirectoryItem, FileListResponse } from "@/types/api";

type Fetcher = (
	...args: [RequestInfo, RequestInit?]
) => Promise<FileListResponse>;

const fetcher: Fetcher = (...args) => fetch(...args).then((res) => res.json());
const buildUrl = (path: string) =>
	ENDPOINT_LIST + (path ? `?path=${path}` : "");

const useFileList = (initPath: string) => {
	const [path, setPath] = useState(initPath);
	const [fileList, setFileList] = useState<DirectoryItem[]>([]);

	const memoizedFetcher = useCallback(fetcher, []);
	const { data, error, isValidating } = useSWR<FileListResponse>(
		buildUrl(path),
		memoizedFetcher,
		{ revalidateOnFocus: false },
	);

	useEffect(() => {
		if (data?.status === "success") {
			setFileList(data.list);
		} else {
			setFileList([]);
		}
	}, [data]);

	const fetchFileList = useCallback((newPath: string) => {
		setPath(newPath);
		mutate(buildUrl(newPath));
	}, []);

	return {
		fileList,
		isLoading: isValidating,
		error,
		fetchFileList,
	};
};

export default useFileList;
