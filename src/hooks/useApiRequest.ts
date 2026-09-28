import { useCallback, useEffect, useRef, useState } from "react";
import {
  type ApiResponse,
  type ErrorResponse,
  isSuccessResponse,
} from "@/types/api";

// Only messages from the server reach the UI; anything else (network failures,
// unexpected throws) shows the caller's fallback message instead.
class ServerError extends Error {}

type ApiRequestOptions = {
  endpoint: string;
  fallbackErrorMessage: string;
};

type ApiRequestState = {
  isLoading: boolean;
  error: string | null;
};

type UseApiRequestReturn<TParams, TResponse> = ApiRequestState & {
  execute: (
    params: TParams,
    prepareBody: (params: TParams) => FormData | URLSearchParams,
  ) => Promise<Exclude<TResponse, ErrorResponse>>;
  abort: () => void;
};

const useApiRequest = <TParams, TResponse extends ApiResponse>(
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
    ): Promise<Exclude<TResponse, ErrorResponse>> => {
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
            : { "Content-Type": "application/x-www-form-urlencoded" },
          body: isFormData ? body : body.toString(),
          signal: abortController.signal,
        });

        // Read the body outside the parse guard so an abort during the read
        // still surfaces as an AbortError.
        const text = await response.text();
        let data: TResponse | null = null;

        try {
          data = JSON.parse(text) as TResponse | null;
        } catch {
          // Non-JSON bodies (e.g. a proxy's HTML error page) fall back below.
        }

        if (response.ok && data && isSuccessResponse(data)) {
          return data;
        }

        const message = (data as { message?: unknown } | null)?.message;
        throw new ServerError(
          typeof message === "string" && message
            ? message
            : options.fallbackErrorMessage,
        );
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          throw err;
        }

        const errorMessage =
          err instanceof ServerError
            ? err.message
            : options.fallbackErrorMessage;

        if (isMountedRef.current) {
          setError(errorMessage);
        }
        throw err;
      } finally {
        // A superseded request must not end the loading state of its successor.
        if (
          isMountedRef.current &&
          abortControllerRef.current === abortController
        ) {
          setIsLoading(false);
        }
      }
    },
    [options.endpoint, options.fallbackErrorMessage],
  );

  return { isLoading, error, execute, abort };
};

export default useApiRequest;
