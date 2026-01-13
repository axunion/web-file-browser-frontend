import { useCallback, useEffect, useRef, useState } from "react";

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
	abort: () => void;
};

const useApiRequest = <TParams, TResponse>(
	options: ApiRequestOptions,
): UseApiRequestReturn<TParams, TResponse> => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const isMountedRef = useRef(true);
	const abortControllerRef = useRef<AbortController | null>(null);

	useEffect(() => {
		isMountedRef.current = true;

		return () => {
			isMountedRef.current = false;
			abortControllerRef.current?.abort();
		};
	}, []);

	const abort = useCallback(() => {
		abortControllerRef.current?.abort();
	}, []);

	const execute = useCallback(
		async (
			params: TParams,
			prepareBody: (params: TParams) => FormData | URLSearchParams,
		): Promise<TResponse> => {
			abortControllerRef.current?.abort();

			const abortController = new AbortController();
			abortControllerRef.current = abortController;

			if (isMountedRef.current) {
				setIsLoading(true);
				setError(null);
			}

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
					signal: abortController.signal,
				});

				if (!response.ok) {
					const errorText = await response.text();
					throw new Error(errorText || "Request failed");
				}

				const text = await response.text();
				let data: TResponse;

				try {
					data = JSON.parse(text) as TResponse;
				} catch {
					throw new Error("Invalid JSON response from server");
				}

				return data;
			} catch (err) {
				if (err instanceof Error && err.name === "AbortError") {
					throw err;
				}

				const errorMessage =
					err instanceof Error ? err.message : "An unknown error occurred";

				if (isMountedRef.current) {
					setError(errorMessage);
				}
				throw err;
			} finally {
				if (isMountedRef.current) {
					setIsLoading(false);
				}
			}
		},
		[options.endpoint, options.contentType],
	);

	return { isLoading, error, execute, abort };
};

export default useApiRequest;
