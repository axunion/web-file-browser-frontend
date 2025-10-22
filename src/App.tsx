import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import ErrorModal from "@/components/ErrorModal";
import FileList from "@/components/FileList";
import Header from "@/components/Header";
import TabBar from "@/components/TabBar";
import { MESSAGES } from "@/constants/messages";
import useFileList from "@/hooks/useFileList";
import { getPath } from "@/utils/path";

const App = () => {
	const [hashResult, setHashResult] = useState(getPath());
	const { fileList, isLoading, error, fetchFileList, refreshFileList } =
		useFileList(hashResult.path);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const isNavigatingRef = useRef(false);

	useEffect(() => {
		const handleHashChange = () => {
			const hashResult = getPath();
			setHashResult(hashResult);
			fetchFileList(hashResult.path);
		};

		window.addEventListener("hashchange", handleHashChange);
		return () => window.removeEventListener("hashchange", handleHashChange);
	}, [fetchFileList]);

	useEffect(() => {
		if (error) {
			setErrorMessage(MESSAGES.FILE_LOAD_ERROR);
		}
	}, [error]);

	const handleErrorClose = () => {
		setErrorMessage(null);
		fetchFileList(hashResult.path);
	};

	const handleFileListUpdate = () => {
		refreshFileList();
	};

	return (
		<>
			<div className="fixed top-0 inset-x-0 z-10 bg-(--background-color)/50 backdrop-blur-lg">
				<Header title={hashResult.paths.slice(-1).pop()} />
			</div>

			<main className="min-h-dvh px-4 py-16">
				{isLoading ? (
					<div className="absolute inset-0 flex items-center justify-center">
						<Icon icon="eos-icons:loading" className="h-6 w-6" />
					</div>
				) : fileList ? (
					<FileList
						list={fileList}
						onFileListUpdate={handleFileListUpdate}
						isNavigatingRef={isNavigatingRef}
					/>
				) : (
					<div>{MESSAGES.NO_DATA}</div>
				)}
			</main>

			<div className="fixed bottom-0 inset-x-0 z-10 bg-(--background-color)/50 backdrop-blur-lg">
				<TabBar />
			</div>

			{errorMessage && (
				<ErrorModal onClose={handleErrorClose}>{errorMessage}</ErrorModal>
			)}
		</>
	);
};

export default App;
