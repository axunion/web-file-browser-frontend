import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ErrorModal from "@/components/ErrorModal";
import FileList from "@/components/FileList";
import Header from "@/components/Header";
import { MESSAGES } from "@/constants/messages";
import useFileList from "@/hooks/useFileList";
import { getPath } from "@/utils/path";

const App = () => {
	const [hashResult, setHashResult] = useState(() => getPath());
	const {
		items,
		isLoading,
		errorMessage: fileListErrorMessage,
		refresh,
	} = useFileList(hashResult.path);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const isNavigatingRef = useRef(false);

	useEffect(() => {
		const handleHashChange = () => {
			setHashResult(getPath());
		};

		window.addEventListener("hashchange", handleHashChange);
		return () => window.removeEventListener("hashchange", handleHashChange);
	}, []);

	useEffect(() => {
		setErrorMessage(fileListErrorMessage);
	}, [fileListErrorMessage]);

	const handleErrorClose = () => {
		setErrorMessage(null);
		void refresh();
	};

	const handleFileListUpdate = () => {
		void refresh();
	};

	return (
		<>
			<div className="fixed top-0 inset-x-0 z-10 bg-(--background-color)/50 backdrop-blur-lg">
				<Header
					title={hashResult.paths.slice(-1).pop()}
					paths={hashResult.paths}
					onFileListUpdate={handleFileListUpdate}
				/>
			</div>

			<div className="min-h-6 mt-16 mb-4">
				{hashResult.paths.length > 0 && <Breadcrumb paths={hashResult.paths} />}
			</div>

			<main className="px-4 pb-20" aria-busy={isLoading}>
				{isLoading ? (
					<div className="absolute inset-0 flex items-center justify-center">
						<Icon icon="eos-icons:loading" className="h-6 w-6" />
					</div>
				) : items.length > 0 ? (
					<FileList
						list={items}
						currentPath={hashResult.path}
						onFileListUpdate={handleFileListUpdate}
						isNavigatingRef={isNavigatingRef}
					/>
				) : (
					<div>{MESSAGES.NO_DATA}</div>
				)}
			</main>

			{errorMessage && (
				<ErrorModal onClose={handleErrorClose}>{errorMessage}</ErrorModal>
			)}
		</>
	);
};

export default App;
