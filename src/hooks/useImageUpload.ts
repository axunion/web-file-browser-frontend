import { useCallback } from "react";
import { ENDPOINT_UPLOAD_IMAGES } from "@/constants/config";
import type { UploadImagesRequest, UploadImagesResponse } from "@/types/api";
import useApiRequest from "./useApiRequest";

const useImageUpload = () => {
  const { isLoading, error, execute, abort } = useApiRequest<
    UploadImagesRequest,
    UploadImagesResponse
  >({ endpoint: ENDPOINT_UPLOAD_IMAGES });

  const uploadImages = useCallback(
    (images: File[], path: string) =>
      execute({ images, path }, (params) => {
        const formData = new FormData();
        formData.append("path", params.path);
        for (const image of params.images) {
          formData.append("images[]", image);
        }
        return formData;
      }),
    [execute],
  );

  return { isLoading, error, uploadImages, abort };
};

export default useImageUpload;
