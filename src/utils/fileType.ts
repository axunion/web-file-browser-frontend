export type FileType = "video" | "audio" | "image" | "text" | "pdf" | "file";

const VIDEO_EXTENSIONS = new Set([
  "mp4",
  "mov",
  "avi",
  "wmv",
  "flv",
  "mkv",
  "webm",
]);
const AUDIO_EXTENSIONS = new Set(["mp3", "wav", "aac", "ogg", "m4a", "wma"]);
const IMAGE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "webp",
  "svg",
]);
const TEXT_EXTENSIONS = new Set(["txt", "doc", "docx", "csv", "rtf", "md"]);

export const getFileType = (filename: string): FileType => {
  const extension = filename.split(".").pop()?.toLowerCase() || "";

  if (VIDEO_EXTENSIONS.has(extension)) {
    return "video";
  }

  if (AUDIO_EXTENSIONS.has(extension)) {
    return "audio";
  }

  if (IMAGE_EXTENSIONS.has(extension)) {
    return "image";
  }

  if (TEXT_EXTENSIONS.has(extension)) {
    return "text";
  }

  if (extension === "pdf") {
    return "pdf";
  }

  return "file";
};
