import { ENDPOINT_UPLOAD } from "@/constants/config";
import type { UploadFileResponse } from "@/types/api";
import { useCallback, useState } from "react";

const useFileUpload = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const uploadFile = useCallback(
		async (file: File): Promise<UploadFileResponse> => {
			setIsLoading(true);
			setError(null);

			const formData = new FormData();
			formData.append("file", file);

			try {
				const response = await fetch(ENDPOINT_UPLOAD, {
					method: "POST",
					body: formData,
				});

				if (!response.ok) {
					const errorText = await response.text();
					throw new Error(errorText || "Upload failed");
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
		uploadFile,
	};
};

export default useFileUpload;
