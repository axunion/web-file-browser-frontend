import { useCallback } from "react";
import { ENDPOINT_MOVE } from "@/constants/config";
import type { MoveFileRequest, MoveFileResponse } from "@/types/api";
import useApiRequest from "./useApiRequest";

const useFileMove = () => {
	const { isLoading, error, execute } = useApiRequest<
		MoveFileRequest,
		MoveFileResponse
	>({ endpoint: ENDPOINT_MOVE });

	const moveFile = useCallback(
		(params: MoveFileRequest) =>
			execute(params, (p) => {
				const formData = new URLSearchParams();
				formData.append("path", p.path ?? "");
				formData.append("name", p.name);
				formData.append("destinationPath", p.destinationPath);
				return formData;
			}),
		[execute],
	);

	return { isLoading, error, moveFile };
};

export default useFileMove;
