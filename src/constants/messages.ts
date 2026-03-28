export const MESSAGES = {
	APP_TITLE: "Web File Browser",
	BREADCRUMB: "パンくずリスト",
	BREADCRUMB_ROOT: "TOP",
	BACK: "戻る",
	CLOSE_MODAL: "モーダルを閉じる",
	FILE_ACTIONS: "ファイル操作",
	CONFIRM: "OK",
	ERROR_OCCURRED: "エラーが発生しました。",
	FILE_LOAD_ERROR: "ファイルの読み込み中にエラーが発生しました。",
	FILE_UPLOAD_ERROR: "アップロードに失敗しました。",
	FILE_RENAME_ERROR: "名前の変更に失敗しました。",
	FILE_MOVE_ERROR: "移動に失敗しました。",
	FILE_DELETE_ERROR: "削除に失敗しました。",
	NO_DATA: "データはありません",
	LOADING: "読み込み中...",
	UPLOAD: "アップロード",
	RENAME: "名前を変更",
	MOVE: "移動",
	DELETE: "削除",
	SELECT_DESTINATION: "移動先を選択",
	NO_DIRECTORIES: "ディレクトリがありません",
	CONFIRM_DELETE: "削除しますか",
	INVALID_NAME: "この名前は使用できません",
	INVALID_NAME_CHARACTERS: "使用できない文字が含まれています",
	ERROR: "エラー",
	RETRY: "再試行",
	UPLOAD_FILE_ARIA_LABEL: "ファイルをアップロード",
	FILE_UPLOAD_BUTTON_ARIA_LABEL: "アップロードするファイルを選択",
	NAVIGATE_PARENT: "親ディレクトリへ移動",
	UPLOAD_IMAGES: "アップロード",
	UPLOAD_IMAGES_ARIA_LABEL: "アップロード",
	IMAGE_UPLOAD_ERROR: "画像のアップロードに失敗しました。",
	IMAGE_UPLOAD_INVALID_TYPE: "JPEG または PNG のみアップロードできます",
	IMAGE_UPLOAD_TOO_MANY: "アップロードできるのは10件までです",
	IMAGE_UPLOAD_FILE_TOO_LARGE: "1ファイルあたり10MB以下にしてください",
	IMAGE_UPLOAD_TOTAL_TOO_LARGE: "合計サイズが30MBを超えています",
	UPLOAD_FILES: "アップロード",
	UPLOAD_FILES_ARIA_LABEL: "アップロード",
	MULTI_FILE_UPLOAD_SUCCESS: "すべてのファイルをアップロードしました",
	MULTI_FILE_UPLOAD_PARTIAL_ERROR: "一部のファイルのアップロードに失敗しました",
	UPLOAD_SUCCESS: "アップロードが完了しました",
	DISMISS_TOAST: "通知を閉じる",
} as const;

export const getFileItemAriaLabel = (
	name: string,
	type: "file" | "directory",
) => `${name}、${type === "directory" ? "フォルダ" : "ファイル"}`;

export const getOpenFileAriaLabel = (name: string) =>
	`${name} を新しいタブで開く`;

export const getImageAlt = (name: string) => `${name} のプレビュー`;

export const getImageUploadCountLabel = (count: number) => `${count} 件の画像`;

export const getMultiFileUploadCountLabel = (count: number) =>
	`${count} 件のファイル`;

export const getMultiFileUploadProgressLabel = (
	current: number,
	total: number,
) => `${current} / ${total}`;

export type MessageKey = keyof typeof MESSAGES;
