import { useEffect, useMemo, useState } from "react";
import type { ApiResponse } from "@/types/api";
import Breadcrumb from "@/components/Breadcrumb";
import FileList from "@/components/FileList";
import Header from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import useFetch from "@/hooks/useFetch";

const App = () => {
  const [hash, setHash] = useState(() => window.location.hash ?? "");
  const baseUrl = import.meta.env.VITE_ENDPOINT_LIST;
  const path = hash && hash.slice(1);
  const memorizedParams = useMemo(() => (path ? { path } : undefined), [path]);
  const paths = path ? path.split("/").filter(Boolean) : [];
  const { response, error, loading } = useFetch<ApiResponse>(
    baseUrl,
    memorizedParams
  );

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  if (error) return <div>エラーが発生しました。再試行してください。</div>;
  if (!response || !response.list) return <div>データが見つかりません。</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Breadcrumb paths={paths} />

      <main className="flex-grow container mx-auto p-6">
        {loading ? <LoadingSpinner /> : <FileList list={response.list} />}
      </main>
    </div>
  );
};

export default App;
