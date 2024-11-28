export type DirectoryItem = {
  type: "file" | "directory" | "video" | "audio" | "image" | "text";
  name: string;
  size?: number;
};

export type ApiResponse = {
  status: "success" | "error";
  list?: DirectoryItem[];
  message?: string;
};
