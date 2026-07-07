import { useCallback, useEffect, useRef, useState } from "react";
import { ENDPOINT_UPLOAD } from "@/constants/config";
import type { UploadFileResponse } from "@/types/api";

export type FileUploadStatus = "pending" | "uploading" | "success" | "error";

export type FileUploadProgress = {
  fileName: string;
  status: FileUploadStatus;
};

type UseMultiFileUploadReturn = {
  isUploading: boolean;
  progress: FileUploadProgress[];
  uploadFiles: (files: File[], path: string) => Promise<void>;
  abort: () => void;
};

const markAbortedFromIndex = (
  prev: FileUploadProgress[],
  fromIndex: number,
): FileUploadProgress[] =>
  prev.map((p, idx) =>
    idx >= fromIndex && (p.status === "pending" || p.status === "uploading")
      ? { ...p, status: "error" }
      : p,
  );

const useMultiFileUpload = (): UseMultiFileUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<FileUploadProgress[]>([]);

  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  const abort = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const uploadFiles = useCallback(async (files: File[], path: string) => {
    abortControllerRef.current?.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const initial: FileUploadProgress[] = files.map((f) => ({
      fileName: f.name,
      status: "pending",
    }));

    if (isMountedRef.current) {
      setProgress(initial);
      setIsUploading(true);
    }

    for (let i = 0; i < files.length; i++) {
      if (abortController.signal.aborted) {
        if (isMountedRef.current) {
          setProgress((prev) => markAbortedFromIndex(prev, i));
        }
        break;
      }

      if (isMountedRef.current) {
        setProgress((prev) =>
          prev.map((p, idx) => (idx === i ? { ...p, status: "uploading" } : p)),
        );
      }

      try {
        const formData = new FormData();
        formData.append("file", files[i]);
        formData.append("path", path);

        const response = await fetch(ENDPOINT_UPLOAD, {
          method: "POST",
          body: formData,
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error("Request failed");
        }

        const data = (await response.json()) as UploadFileResponse;
        const status: FileUploadStatus =
          data.status === "success" ? "success" : "error";

        if (isMountedRef.current) {
          setProgress((prev) =>
            prev.map((p, idx) => (idx === i ? { ...p, status } : p)),
          );
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          if (isMountedRef.current) {
            setProgress((prev) => markAbortedFromIndex(prev, i));
          }
          break;
        }

        if (isMountedRef.current) {
          setProgress((prev) =>
            prev.map((p, idx) => (idx === i ? { ...p, status: "error" } : p)),
          );
        }
      }
    }

    if (isMountedRef.current) {
      setIsUploading(false);
    }
  }, []);

  return { isUploading, progress, uploadFiles, abort };
};

export default useMultiFileUpload;
