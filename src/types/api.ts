export type ErrorResponse = {
	status: "error";
	message: string;
};

export type DirectoryItem = {
	type: "file" | "directory";
	name: string;
};

export type FileListSuccessResponse = {
	status: "success";
	list: DirectoryItem[];
};

export type FileListErrorResponse = ErrorResponse;

export type FileListResponse = FileListSuccessResponse | FileListErrorResponse;

export type UploadFileRequest = {
	file: File;
};

export type UploadFileSuccessResponse = {
	status: "success";
};

export type UploadFileErrorResponse = ErrorResponse;

export type UploadFileResponse =
	| UploadFileSuccessResponse
	| UploadFileErrorResponse;

export type RenameFileRequest = {
	path: string;
	name: string;
	newName: string;
};

export type RenameFileSuccessResponse = {
	status: "success";
	path: string;
	filename: string;
};

export type RenameFileErrorResponse = ErrorResponse;

export type RenameFileResponse =
	| RenameFileSuccessResponse
	| RenameFileErrorResponse;

export type MoveFileRequest = {
	path: string;
	name: string;
	destinationPath: string;
};

export type MoveFileSuccessResponse = {
	status: "success";
	path: string;
	filename: string;
};

export type MoveFileErrorResponse = ErrorResponse;

export type MoveFileResponse = MoveFileSuccessResponse | MoveFileErrorResponse;

export type DeleteFileRequest = {
	path: string;
	name: string;
};

export type DeleteFileSuccessResponse = {
	status: "success";
	path: string;
	filename: string;
};

export type DeleteFileErrorResponse = ErrorResponse;

export type DeleteFileResponse =
	| DeleteFileSuccessResponse
	| DeleteFileErrorResponse;
