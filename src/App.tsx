import ErrorModal from "@/components/ErrorModal";
import FileList from "@/components/FileList";
import Header from "@/components/Header";
import TabBar from "@/components/TabBar";
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
		<>
			<Header title={hashResult.paths.slice(-1).pop()} />

			<main className="min-h-screen relative grow w-full px-4 py-16">
				{isLoading ? (
					<>
						<div className="absolute inset-0 flex items-center justify-center">
							<Icon icon="eos-icons:loading" className="h-6 w-6" />
						</div>
					</>
				) : fileList ? (
					<FileList list={fileList} />
				) : (
					<div>データはありません</div>
				)}
			</main>

			<TabBar />

			{error && (
				<ErrorModal onClose={resetPath}>エラーが発生しました。</ErrorModal>
			)}
		</>
	);
};

export default App;
