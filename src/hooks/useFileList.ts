import { useCallback, useEffect, useId, useMemo, useState } from "react";
import useSWR, { mutate } from "swr";
import { ENDPOINT_LIST } from "@/constants/config";
import { MESSAGES } from "@/constants/messages";
import {
	type DirectoryItem,
	type FileListResponse,
	isErrorResponse,
	isSuccessResponse,
} from "@/types/api";

type UseFileListOptions = {
	isolated?: boolean;
};

type UseFileListReturn = {
	items: DirectoryItem[];
	isLoading: boolean;
	errorMessage: string | null;
	setPath: (path: string) => void;
	refresh: () => Promise<FileListResponse | undefined>;
};

const SWR_KEY_SEPARATOR = "__file-list__";

const buildUrl = (path: string) => {
	if (!path) {
		return ENDPOINT_LIST;
	}

	const searchParams = new URLSearchParams();
	searchParams.set("path", path);
	return `${ENDPOINT_LIST}?${searchParams.toString()}`;
};

const getFetchUrl = (key: string) => {
	const separatorIndex = key.indexOf(SWR_KEY_SEPARATOR);

	return separatorIndex === -1
		? key
		: key.slice(separatorIndex + SWR_KEY_SEPARATOR.length);
};

const fetcher = async (key: string): Promise<FileListResponse> => {
	const response = await fetch(getFetchUrl(key));
	const text = await response.text();

	if (!response.ok) {
		let message = text || MESSAGES.FILE_LOAD_ERROR;

		try {
			const data = JSON.parse(text) as Partial<FileListResponse>;

			if (
				data &&
				typeof data === "object" &&
				"message" in data &&
				typeof data.message === "string"
			) {
				message = data.message;
			}
		} catch {
			// Ignore JSON parse failure here and keep the raw response text.
		}

		throw new Error(message);
	}

	try {
		return JSON.parse(text) as FileListResponse;
	} catch {
		throw new Error("Invalid JSON response from server");
	}
};

const useFileList = (
	initPath: string,
	options: UseFileListOptions = {},
): UseFileListReturn => {
	const { isolated = false } = options;
	const instanceId = useId();
	const [path, setPath] = useState(initPath);

	useEffect(() => {
		setPath(initPath);
	}, [initPath]);

	const scopeKey = isolated ? instanceId : "shared";
	const swrKey = useMemo(
		() => `${scopeKey}${SWR_KEY_SEPARATOR}${buildUrl(path)}`,
		[path, scopeKey],
	);

	const { data, error, isLoading, isValidating } = useSWR<FileListResponse>(
		swrKey,
		fetcher,
		{ revalidateOnFocus: false },
	);

	const items = useMemo(
		() => (data && isSuccessResponse(data) ? data.list : []),
		[data],
	);

	const errorMessage = useMemo(() => {
		if (error instanceof Error) {
			return error.message || MESSAGES.FILE_LOAD_ERROR;
		}

		if (data && isErrorResponse(data)) {
			return data.message || MESSAGES.FILE_LOAD_ERROR;
		}

		return null;
	}, [data, error]);

	const refresh = useCallback(() => mutate<FileListResponse>(swrKey), [swrKey]);

	return {
		items,
		isLoading: isLoading || isValidating,
		errorMessage,
		setPath,
		refresh,
	};
};

export default useFileList;
