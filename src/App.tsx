import Breadcrumb from "@/components/Breadcrumb";
import ErrorModal from "@/components/ErrorModal";
import FileList from "@/components/FileList";
import Header from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import useFileList from "@/hooks/useFileList";
import { getPath, resetPath } from "@/utils/path";
import { Icon } from "@iconify/react";
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

			<main className="grow container mx-auto px-4 pb-8">
				{isLoading ? (
					<LoadingSpinner />
				) : fileList ? (
					<FileList list={fileList} />
				) : (
					<div>データはありません</div>
				)}

				<div className="fixed bottom-4 right-2">
					<Icon
						icon={`flat-color-icons:${fileList ? "empty" : "full"}-trash`}
						className="w-16 h-16"
					/>
				</div>
			</main>

			{error && (
				<ErrorModal onClose={resetPath}>エラーが発生しました。</ErrorModal>
			)}
		</div>
	);
};

export default App;
