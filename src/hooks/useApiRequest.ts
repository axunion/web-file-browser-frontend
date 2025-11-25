import { useCallback, useState } from "react";

type ApiRequestOptions = {
	endpoint: string;
	contentType?: string;
};

type ApiRequestState = {
	isLoading: boolean;
	error: string | null;
};

type UseApiRequestReturn<TParams, TResponse> = ApiRequestState & {
	execute: (
		params: TParams,
		prepareBody: (params: TParams) => FormData | URLSearchParams,
	) => Promise<TResponse>;
};

const useApiRequest = <TParams, TResponse>(
	options: ApiRequestOptions,
): UseApiRequestReturn<TParams, TResponse> => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const execute = useCallback(
		async (
			params: TParams,
			prepareBody: (params: TParams) => FormData | URLSearchParams,
		): Promise<TResponse> => {
			setIsLoading(true);
			setError(null);

			try {
				const body = prepareBody(params);
				const isFormData = body instanceof FormData;

				const response = await fetch(options.endpoint, {
					method: "POST",
					headers: isFormData
						? undefined
						: {
								"Content-Type":
									options.contentType ?? "application/x-www-form-urlencoded",
							},
					body: isFormData ? body : body.toString(),
				});

				if (!response.ok) {
					const errorText = await response.text();
					throw new Error(errorText || "Request failed");
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
		[options.endpoint, options.contentType],
	);

	return { isLoading, error, execute };
};

export default useApiRequest;
