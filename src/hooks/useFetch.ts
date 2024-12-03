import { useState, useEffect, useMemo } from "react";

type Params = Record<string, string | number | boolean | null | undefined>;
type FetchState<T> = {
  response: T | null;
  error: Error | null;
  loading: boolean;
};

const useFetch = <T = unknown>(
  baseUrl: string,
  params?: Params,
  options?: RequestInit
): FetchState<T> => {
  const [state, setState] = useState<FetchState<T>>({
    response: null,
    error: null,
    loading: true,
  });

  const memoizedParams = useMemo(() => params, [params]);
  const memoizedOptions = useMemo(() => options, [options]);

  useEffect(() => {
    const url = new URL(baseUrl);

    if (memoizedParams) {
      Object.entries(memoizedParams).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true }));
        const response = await fetch(url.toString(), {
          ...memoizedOptions,
          signal,
        });

        if (!response.ok) {
          throw new Error(
            `HTTP error! status: ${response.status} - ${response.statusText}`
          );
        }

        const json = await response.json();

        setState({
          response: json,
          error: null,
          loading: false,
        });
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
          console.log("Fetch aborted");
          return;
        }

        setState({
          response: null,
          error: error instanceof Error ? error : new Error("Unknown error"),
          loading: false,
        });
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [baseUrl, memoizedOptions, memoizedParams]);

  return state;
};

export default useFetch;
