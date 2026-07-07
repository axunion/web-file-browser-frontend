import { useCallback } from "react";
import { ENDPOINT_UPLOAD } from "@/constants/config";
import type { UploadFileRequest, UploadFileResponse } from "@/types/api";
import useApiRequest from "./useApiRequest";

const useFileUpload = () => {
  const { isLoading, error, execute, abort } = useApiRequest<
    UploadFileRequest,
    UploadFileResponse
  >({ endpoint: ENDPOINT_UPLOAD });

  const uploadFile = useCallback(
    (file: File, path: string) =>
      execute({ file, path }, (params) => {
        const formData = new FormData();
        formData.append("file", params.file);
        formData.append("path", params.path);
        return formData;
      }),
    [execute],
  );

  return { isLoading, error, uploadFile, abort };
};

export default useFileUpload;
