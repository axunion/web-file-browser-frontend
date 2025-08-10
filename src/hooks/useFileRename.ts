import { ENDPOINT_RENAME } from "@/constants/config";
import type { RenameFileRequest, RenameFileResponse } from "@/types/api";
import { useCallback, useState } from "react";

const useRenameFile = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const renameFile = useCallback(
		async (params: RenameFileRequest): Promise<RenameFileResponse> => {
			setIsLoading(true);
			setError(null);

			const formData = new URLSearchParams();
			formData.append("path", params.path ?? "");
			formData.append("name", params.name);
			formData.append("newName", params.newName);

			try {
				const response = await fetch(ENDPOINT_RENAME, {
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
		renameFile,
	};
};

export default useRenameFile;
