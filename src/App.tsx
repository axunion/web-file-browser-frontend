import Breadcrumb from "@/components/Breadcrumb";
import ErrorModal from "@/components/ErrorErrorModal";
import FileList from "@/components/FileList";
import Header from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import useFileList from "@/hooks/useFileList";
import { type HashResult, getHash } from "@/utils/getHash";
import { useEffect, useState } from "react";

const App = () => {
	const [hashResult, setHashResult] = useState<HashResult>(getHash());
	const { fileList, error, isLoading } = useFileList(hashResult.path);
	const redirectToRoot = () => {
		window.location.href = "/";
	};

	useEffect(() => {
		const handleHashChange = () => setHashResult(getHash());
		window.addEventListener("hashchange", handleHashChange);
		return () => window.removeEventListener("hashchange", handleHashChange);
	}, []);

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

			<ErrorModal isOpen={!!error} onClose={redirectToRoot}>
				エラーが発生しました。
			</ErrorModal>
		</div>
	);
};

export default App;
