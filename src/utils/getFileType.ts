export type FileType = "file" | "video" | "audio" | "image" | "text";

export const getFileType = (filename: string): FileType => {
  const extension = filename.split(".").pop()?.toLowerCase() || "";
  const videoExtensions = ["mp4", "mov", "avi", "wmv", "flv", "mkv", "webm"];
  const audioExtensions = ["mp3", "wav", "aac", "ogg", "m4a", "wma"];
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
  const textExtensions = ["txt", "doc", "docx", "pdf", "csv", "rtf", "md"];

  if (videoExtensions.includes(extension)) {
    return "video";
  } else if (audioExtensions.includes(extension)) {
    return "audio";
  } else if (imageExtensions.includes(extension)) {
    return "image";
  } else if (textExtensions.includes(extension)) {
    return "text";
  }

  return "file";
};
