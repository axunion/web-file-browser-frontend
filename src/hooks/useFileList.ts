import { useCallback, useMemo } from "react";
import useSWR from "swr";
import { ENDPOINT_LIST } from "@/constants/config";
import { MESSAGES } from "@/constants/messages";
import {
  type DirectoryItem,
  type FileListResponse,
  type FileListSuccessResponse,
  isSuccessResponse,
} from "@/types/api";

// Only messages from the server reach the UI; network failures and other
// throws show MESSAGES.FILE_LOAD_ERROR instead.
class ServerError extends Error {}

type UseFileListReturn = {
  items: DirectoryItem[];
  isLoading: boolean;
  errorMessage: string | null;
  refresh: () => Promise<FileListSuccessResponse | undefined>;
};

const buildUrl = (path: string) => {
  if (!path) {
    return ENDPOINT_LIST;
  }

  const searchParams = new URLSearchParams();
  searchParams.set("path", path);
  return `${ENDPOINT_LIST}?${searchParams.toString()}`;
};

const fetcher = async (url: string): Promise<FileListSuccessResponse> => {
  const response = await fetch(url);
  let data: FileListResponse | null = null;

  try {
    data = JSON.parse(await response.text()) as FileListResponse | null;
  } catch {
    // Non-JSON bodies (e.g. a proxy's HTML error page) fall back below.
  }

  if (response.ok && data && isSuccessResponse(data)) {
    return data;
  }

  const message = (data as { message?: unknown } | null)?.message;
  throw new ServerError(
    typeof message === "string" && message ? message : MESSAGES.FILE_LOAD_ERROR,
  );
};

const useFileList = (path: string): UseFileListReturn => {
  const {
    data,
    error,
    isLoading,
    mutate: revalidate,
  } = useSWR<FileListSuccessResponse>(buildUrl(path), fetcher, {
    revalidateOnFocus: false,
  });

  const items = useMemo(() => data?.list ?? [], [data]);

  const errorMessage = error
    ? error instanceof ServerError
      ? error.message
      : MESSAGES.FILE_LOAD_ERROR
    : null;

  const refresh = useCallback(() => revalidate(), [revalidate]);

  return {
    items,
    isLoading,
    errorMessage,
    refresh,
  };
};

export default useFileList;
