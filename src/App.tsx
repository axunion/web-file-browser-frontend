import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ErrorModal from "@/components/ErrorModal";
import FileList from "@/components/FileList";
import Header from "@/components/Header";
import { MESSAGES } from "@/constants/messages";
import useFileList from "@/hooks/useFileList";
import { getPath } from "@/utils/path";
import styles from "./App.module.css";

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
			<div className={styles.header}>
				<Header
					title={hashResult.paths.slice(-1).pop()}
					paths={hashResult.paths}
					onFileListUpdate={handleFileListUpdate}
				/>
			</div>

			<div className={styles.breadcrumb}>
				{hashResult.paths.length > 0 && <Breadcrumb paths={hashResult.paths} />}
			</div>

			<main className={styles.main} aria-busy={isLoading}>
				{isLoading ? (
					<div className={styles.loadingState}>
						<Icon icon="eos-icons:loading" className={styles.loadingIcon} />
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
