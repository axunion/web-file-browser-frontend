import Breadcrumb from "@/components/Breadcrumb";
import ErrorModal from "@/components/ErrorModal";
import FileList from "@/components/FileList";
import Header from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import useFileList from "@/hooks/useFileList";
import { getPath, resetPath } from "@/utils/path";
import { useEffect, useState } from "react";

const App = () => {
	const [hashResult, setHashResult] = useState(getPath());
	const { fileList, isLoading, error, fetchFileList } = useFileList(
		hashResult.path,
	);

	useEffect(() => {
		const handleHashChange = () => {
			const hashResult = getPath();
			setHashResult(hashResult);
			fetchFileList(hashResult.path);
		};

		window.addEventListener("hashchange", handleHashChange);
		return () => window.removeEventListener("hashchange", handleHashChange);
	}, [fetchFileList]);

	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<Breadcrumb paths={hashResult.paths} />

			<main className="flex-grow container mx-auto p-6">
				{isLoading ? (
					<LoadingSpinner />
				) : fileList ? (
					<FileList list={fileList} />
				) : (
					<div>データはありません</div>
				)}
			</main>

			<ErrorModal isOpen={!!error} onClose={resetPath}>
				エラーが発生しました。
			</ErrorModal>
		</div>
	);
};

export default App;
