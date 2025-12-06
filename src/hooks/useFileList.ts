import { useCallback, useEffect, useId, useState } from "react";
import useSWR, { mutate } from "swr";
import { ENDPOINT_LIST } from "@/constants/config";
import type { DirectoryItem, FileListResponse } from "@/types/api";

type Fetcher = (
	...args: [RequestInfo, RequestInit?]
) => Promise<FileListResponse>;

type UseFileListOptions = {
	isolated?: boolean;
};

const fetcher: Fetcher = (...args) => fetch(...args).then((res) => res.json());
const buildUrl = (path: string) =>
	ENDPOINT_LIST + (path ? `?path=${path}` : "");

const useFileList = (initPath: string, options: UseFileListOptions = {}) => {
	const { isolated = false } = options;
	const instanceId = useId();
	const [path, setPath] = useState(initPath);
	const [fileList, setFileList] = useState<DirectoryItem[]>([]);

	const swrKey = isolated ? `${instanceId}:${buildUrl(path)}` : buildUrl(path);

	const memoizedFetcher = useCallback(
		(_key: string) => {
			const url = isolated ? _key.split(":").slice(1).join(":") : _key;
			return fetcher(url);
		},
		[isolated],
	);

	const { data, error, isValidating } = useSWR<FileListResponse>(
		swrKey,
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

	const fetchFileList = useCallback(
		(newPath: string) => {
			setPath(newPath);
			const newKey = isolated
				? `${instanceId}:${buildUrl(newPath)}`
				: buildUrl(newPath);
			mutate(newKey);
		},
		[isolated, instanceId],
	);

	const refreshFileList = useCallback(() => {
		mutate(swrKey);
	}, [swrKey]);

	return {
		fileList,
		isLoading: isValidating,
		error,
		fetchFileList,
		refreshFileList,
	};
};

export default useFileList;
