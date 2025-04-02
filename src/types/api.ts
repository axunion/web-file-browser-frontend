export type DirectoryItem = {
	type: "file" | "directory";
	name: string;
};

export type FileListSuccessResponse = {
	status: "success";
	list: DirectoryItem[];
};

export type FileListErrorResponse = {
	status: "error";
	message: string;
};

export type FileListResponse = FileListSuccessResponse | FileListErrorResponse;

export type UploadFileSuccessResponse = {
	status: "success";
};

export type UploadFileErrorResponse = {
	status: "error";
	message: string;
};

export type UploadFileResponse =
	| UploadFileSuccessResponse
	| UploadFileErrorResponse;
