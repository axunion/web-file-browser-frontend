import { useCallback } from "react";
import { ENDPOINT_DELETE } from "@/constants/config";
import type { DeleteFileRequest, DeleteFileResponse } from "@/types/api";
import useApiRequest from "./useApiRequest";

const useDelete = () => {
	const { isLoading, error, execute } = useApiRequest<
		DeleteFileRequest,
		DeleteFileResponse
	>({ endpoint: ENDPOINT_DELETE });

	const deleteFile = useCallback(
		(params: DeleteFileRequest) =>
			execute(params, (p) => {
				const formData = new URLSearchParams();
				formData.append("path", p.path ?? "");
				formData.append("name", p.name);
				return formData;
			}),
		[execute],
	);

	return { isLoading, error, deleteFile };
};

export default useDelete;
