import { useState, useEffect } from "react";

type Params = Record<string, string | number | boolean>;
type FetchState<T> = {
  response: T | null;
  error: Error | null;
  loading: boolean;
};

const useFetch = <T>(
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
        url.searchParams.append(key, String(value));
      });
    }

    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true }));
        const response = await fetch(url.toString(), { ...options, signal });

        if (!response.ok) {
          throw new Error(
            `HTTP error! status: ${response.status} - ${response.statusText}`
          );
        }

        // const json = [
        //   { name: "ドキュメント", type: "directory" },
        //   { name: "動画.mp4", type: "video" },
        //   { name: "音声.m4a", type: "audio" },
        //   { name: "写真.jpg", type: "image" },
        //   { name: "メモ.txt", type: "text" },
        // ] as T;
        const json = await response.json();
        await new Promise((resolve) => setTimeout(resolve, 500));

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
  }, [baseUrl, options, params]);

  return state;
};

export default useFetch;
