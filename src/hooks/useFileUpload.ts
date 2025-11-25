import { useCallback } from "react";
import { ENDPOINT_UPLOAD } from "@/constants/config";
import type { UploadFileResponse } from "@/types/api";
import useApiRequest from "./useApiRequest";

const useFileUpload = () => {
	const { isLoading, error, execute } = useApiRequest<File, UploadFileResponse>(
		{ endpoint: ENDPOINT_UPLOAD },
	);

	const uploadFile = useCallback(
		(file: File) =>
			execute(file, (f) => {
				const formData = new FormData();
				formData.append("file", f);
				return formData;
			}),
		[execute],
	);

	return { isLoading, error, uploadFile };
};

export default useFileUpload;
