import { useCallback, useState } from "react";
import { ENDPOINT_DELETE } from "@/constants/config";
import type { DeleteFileRequest, DeleteFileResponse } from "@/types/api";

const useDelete = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const deleteFile = useCallback(
		async (params: DeleteFileRequest): Promise<DeleteFileResponse> => {
			setIsLoading(true);
			setError(null);

			const formData = new URLSearchParams();
			formData.append("path", params.path ?? "");
			formData.append("name", params.name);

			try {
				const response = await fetch(ENDPOINT_DELETE, {
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
					body: formData.toString(),
				});

				if (!response.ok) {
					const errorText = await response.text();
					throw new Error(errorText || "Rename failed");
				}

				return await response.json();
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "An unknown error occurred";
				setError(errorMessage);
				throw err;
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	return {
		isLoading,
		error,
		deleteFile,
	};
};

export default useDelete;
