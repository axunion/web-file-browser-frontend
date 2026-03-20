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
} as const;

export const getFileItemAriaLabel = (
	name: string,
	type: "file" | "directory",
) => `${name}、${type === "directory" ? "フォルダ" : "ファイル"}`;

export const getOpenFileAriaLabel = (name: string) =>
	`${name} を新しいタブで開く`;

export const getImageAlt = (name: string) => `${name} のプレビュー`;

export type MessageKey = keyof typeof MESSAGES;
