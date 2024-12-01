export type DirectoryItem = {
  type: "file" | "directory";
  name: string;
  size?: number;
};

export type ApiResponse = {
  status: "success" | "error";
  list?: DirectoryItem[];
  message?: string;
};
