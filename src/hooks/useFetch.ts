import { useState, useEffect } from "react";

type Params = Record<string, string>;
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

  useEffect(() => {
    const url = new URL(baseUrl);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          url.searchParams.append(key, value);
        }
      });
    }

    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true }));
        const response = await fetch(url.toString(), {
          ...options,
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
  }, [baseUrl, params, options]);

  return state;
};

export default useFetch;
