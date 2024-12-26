import Breadcrumb from "@/components/Breadcrumb";
import ErrorModal from "@/components/ErrorErrorModal";
import FileList from "@/components/FileList";
import Header from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import useFileList from "@/hooks/useFileList";
import { useEffect, useState } from "react";

const App = () => {
	const [hash, setHash] = useState(() => window.location.hash ?? "");
	const path = hash?.slice(1);
	const paths = path ? path.split("/").filter(Boolean) : [];
	const { data, error, isLoading } = useFileList(path);
	const redirectToRoot = () => {
		window.location.href = "/";
	};

	useEffect(() => {
		const handleHashChange = () => setHash(window.location.hash);
		window.addEventListener("hashchange", handleHashChange);
		return () => window.removeEventListener("hashchange", handleHashChange);
	}, []);

	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<Breadcrumb paths={paths} />

			<main className="flex-grow container mx-auto p-6">
				{isLoading ? (
					<LoadingSpinner />
				) : data?.list ? (
					<FileList list={data.list} />
				) : (
					<div>データはありません</div>
				)}
			</main>

			<ErrorModal isOpen={!!error} onClose={redirectToRoot}>
				エラーが発生しました。
			</ErrorModal>
		</div>
	);
};

export default App;
