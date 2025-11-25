import { useCallback } from "react";
import { ENDPOINT_RENAME } from "@/constants/config";
import type { RenameFileRequest, RenameFileResponse } from "@/types/api";
import useApiRequest from "./useApiRequest";

const useRenameFile = () => {
	const { isLoading, error, execute } = useApiRequest<
		RenameFileRequest,
		RenameFileResponse
	>({ endpoint: ENDPOINT_RENAME });

	const renameFile = useCallback(
		(params: RenameFileRequest) =>
			execute(params, (p) => {
				const formData = new URLSearchParams();
				formData.append("path", p.path ?? "");
				formData.append("name", p.name);
				formData.append("newName", p.newName);
				return formData;
			}),
		[execute],
	);

	return { isLoading, error, renameFile };
};

export default useRenameFile;
