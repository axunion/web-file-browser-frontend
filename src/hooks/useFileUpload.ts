import type { UploadFileResponse } from "@/types/api";
import { useState, useCallback } from "react";

const endpoint: string = import.meta.env.VITE_ENDPOINT_UPLOAD ?? "";

const useFileUpload = () => {
	const [file, setFile] = useState<File | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const uploadFile = useCallback(
		async (file: File): Promise<UploadFileResponse> => {
			if (!endpoint) {
				throw new Error("Upload endpoint is not defined");
			}

			setIsLoading(true);
			setError(null);

			const formData = new FormData();
			formData.append("file", file);

			try {
				const response = await fetch(endpoint, {
					method: "POST",
					body: formData,
				});

				if (!response.ok) {
					const errorText = await response.text();
					throw new Error(errorText || "Upload failed");
				}

				const data: UploadFileResponse = await response.json();
				setFile(null);
				return data;
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
		file,
		setFile,
		isLoading,
		error,
		uploadFile,
	};
};

export default useFileUpload;