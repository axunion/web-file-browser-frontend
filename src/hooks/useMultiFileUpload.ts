import { useCallback, useEffect, useRef, useState } from "react";
import { ENDPOINT_UPLOAD } from "@/constants/config";
import type { UploadFileResponse } from "@/types/api";

export type FileUploadStatus = "pending" | "uploading" | "success" | "error";

type UseMultiFileUploadReturn = {
  isUploading: boolean;
  statuses: FileUploadStatus[];
  /**
   * Resolves with each file's final status, or null when the run was aborted.
   * Files marked "success" in `previousStatuses` are kept and not sent again.
   */
  uploadFiles: (
    files: File[],
    path: string,
    previousStatuses?: FileUploadStatus[],
  ) => Promise<FileUploadStatus[] | null>;
};

const useMultiFileUpload = (): UseMultiFileUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [statuses, setStatuses] = useState<FileUploadStatus[]>([]);

  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  const uploadFiles = useCallback(
    async (
      files: File[],
      path: string,
      previousStatuses: FileUploadStatus[] = [],
    ) => {
      abortControllerRef.current?.abort();
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      // A run superseded by a newer call or by unmount stops touching state.
      const isCurrent = () =>
        isMountedRef.current && abortControllerRef.current === abortController;

      const result: FileUploadStatus[] = files.map((_, i) =>
        previousStatuses[i] === "success" ? "success" : "pending",
      );
      const publish = () => {
        if (isCurrent()) {
          setStatuses([...result]);
        }
      };

      setIsUploading(true);
      publish();

      for (let i = 0; i < files.length; i++) {
        if (abortController.signal.aborted) {
          break;
        }

        if (result[i] === "success") {
          continue;
        }

        result[i] = "uploading";
        publish();

        try {
          const formData = new FormData();
          formData.append("file", files[i]);
          formData.append("path", path);

          const response = await fetch(ENDPOINT_UPLOAD, {
            method: "POST",
            body: formData,
            signal: abortController.signal,
          });

          const data = response.ok
            ? ((await response.json()) as UploadFileResponse)
            : null;
          result[i] = data?.status === "success" ? "success" : "error";
        } catch (err) {
          if (err instanceof Error && err.name === "AbortError") {
            break;
          }
          result[i] = "error";
        }

        publish();
      }

      if (abortController.signal.aborted) {
        return null;
      }

      if (isCurrent()) {
        setIsUploading(false);
      }

      return result;
    },
    [],
  );

  return { isUploading, statuses, uploadFiles };
};

export default useMultiFileUpload;
