import { Icon } from "@iconify/react";
import { useCallback, useEffect, useRef, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ErrorModal from "@/components/ErrorModal";
import FileList from "@/components/FileList";
import Header from "@/components/Header";
import Toast from "@/components/Toast";
import { MESSAGES } from "@/constants/messages";
import useFileList from "@/hooks/useFileList";
import useToast from "@/hooks/useToast";
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
  // Hidden while the retry started by closing the modal is in flight, so a
  // retry that fails with the same message shows the modal again. Tracked per
  // path so another folder's error isn't hidden by this retry.
  const [retryingPath, setRetryingPath] = useState<string | null>(null);
  const errorMessage =
    retryingPath === hashResult.path ? null : fileListErrorMessage;
  const isNavigatingRef = useRef(false);
  const { toasts, showToast, dismissToast } = useToast();

  useEffect(() => {
    const handleHashChange = () => {
      setHashResult(getPath());
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleErrorClose = () => {
    const path = hashResult.path;
    setRetryingPath(path);
    void refresh().finally(() =>
      setRetryingPath((current) => (current === path ? null : current)),
    );
  };

  const handleFileListUpdate = useCallback(() => {
    void refresh();
  }, [refresh]);

  return (
    <>
      <div className={styles.header}>
        <Header
          title={hashResult.paths.at(-1)}
          paths={hashResult.paths}
          onFileListUpdate={handleFileListUpdate}
          showToast={showToast}
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
          // Keyed by path so menus and dialogs opened for one folder can't
          // act on a same-named item after navigating to another.
          <FileList
            key={hashResult.path}
            list={items}
            paths={hashResult.paths}
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

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </>
  );
};

export default App;
