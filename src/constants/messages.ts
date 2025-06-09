export const MESSAGES = {
	ERROR_OCCURRED: "エラーが発生しました。",
	FILE_LOAD_ERROR: "ファイルの読み込み中にエラーが発生しました。",
	NO_DATA: "データはありません",
	LOADING: "読み込み中...",
	UPLOAD: "アップロード",
	ERROR: "エラー",
	RETRY: "再試行",
} as const;

export type MessageKey = keyof typeof MESSAGES;
