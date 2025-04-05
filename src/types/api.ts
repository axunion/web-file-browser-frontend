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

export type UploadFileRequest = {
	file: File;
};

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

export type RenameFileRequest = {
	path?: string;
	name: string;
	newName: string;
};

export type RenameFileSuccessResponse = {
	status: "success";
	path: string;
	filename: string;
};

export type RenameFileErrorResponse = {
	status: "error";
	message: string;
};

export type RenameFileResponse =
	| RenameFileSuccessResponse
	| RenameFileErrorResponse;
