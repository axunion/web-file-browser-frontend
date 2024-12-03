import type { ApiResponse } from "@/types/api";
import FileList from "@/components/FileList";
import Header from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import PagePath from "@/components/PagePath";
import useFetch from "@/hooks/useFetch";
import useHash from "@/hooks/useHash";

const App = () => {
  const [hash] = useHash();
  const baseUrl = import.meta.env.VITE_ENDPOINT_LIST;
  const path = hash && hash.slice(1);
  const params = path ? { path } : undefined;
  const paths = path ? path.split("/").filter(Boolean) : [];
  const { response, error, loading } = useFetch<ApiResponse>(baseUrl, params);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>エラーが発生しました。再試行してください。</div>;
  if (!response || !response.list) return <div>データが見つかりません。</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <PagePath paths={paths} />
      <main className="flex-grow container mx-auto p-6">
        <FileList list={response.list} />
      </main>
    </div>
  );
};

export default App;
