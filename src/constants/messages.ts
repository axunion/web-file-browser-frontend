// Every user-visible string lives here; translate this file to localize the UI.
export const MESSAGES = {
  APP_TITLE: "Web File Browser",
  BREADCRUMB: "Breadcrumb",
  BREADCRUMB_ROOT: "TOP",
  BACK: "Back",
  CLOSE_MODAL: "Close dialog",
  FILE_ACTIONS: "File actions",
  CONFIRM: "OK",
  FILE_LOAD_ERROR: "Failed to load files.",
  FILE_UPLOAD_ERROR: "Upload failed.",
  FILE_RENAME_ERROR: "Rename failed.",
  FILE_MOVE_ERROR: "Move failed.",
  FILE_DELETE_ERROR: "Delete failed.",
  NO_DATA: "No items",
  LOADING: "Loading...",
  UPLOAD: "Upload",
  RENAME: "Rename",
  MOVE: "Move",
  DELETE: "Delete",
  SELECT_DESTINATION: "Select destination",
  NO_DIRECTORIES: "No folders",
  CONFIRM_DELETE: "Delete this item?",
  INVALID_NAME: "This name can't be used",
  INVALID_NAME_CHARACTERS: "The name contains characters that aren't allowed",
  ERROR: "Error",
  UPLOAD_FILE_ARIA_LABEL: "Upload file",
  FILE_UPLOAD_BUTTON_ARIA_LABEL: "Choose files to upload",
  NAVIGATE_PARENT: "Go to parent folder",
  UPLOAD_FILES: "Upload",
  UPLOAD_FILES_ARIA_LABEL: "Upload",
  MULTI_FILE_UPLOAD_SUCCESS: "All files uploaded",
  MULTI_FILE_UPLOAD_PARTIAL_ERROR: "Some files failed to upload",
  DISMISS_TOAST: "Dismiss notification",
} as const;

export const getFileItemAriaLabel = (
  name: string,
  type: "file" | "directory",
) => `${name}, ${type === "directory" ? "folder" : "file"}`;

export const getOpenFileAriaLabel = (name: string) =>
  `Open ${name} in a new tab`;

export const getImageAlt = (name: string) => `Preview of ${name}`;

export const getMultiFileUploadCountLabel = (count: number) => `${count} files`;

export const getMultiFileUploadProgressLabel = (
  current: number,
  total: number,
) => `${current} / ${total}`;
