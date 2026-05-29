import { describe, expect, it } from "vitest";
import { getFileType } from "./fileType";

describe("getFileType", () => {
	describe("video files", () => {
		it.each([
			"mp4",
			"mov",
			"avi",
			"wmv",
			"flv",
			"mkv",
			"webm",
		])("returns 'video' for .%s", (ext) => {
			expect(getFileType(`video.${ext}`)).toBe("video");
		});
	});

	describe("audio files", () => {
		it.each([
			"mp3",
			"wav",
			"aac",
			"ogg",
			"m4a",
			"wma",
		])("returns 'audio' for .%s", (ext) => {
			expect(getFileType(`audio.${ext}`)).toBe("audio");
		});
	});

	describe("image files", () => {
		it.each([
			"jpg",
			"jpeg",
			"png",
			"gif",
			"bmp",
			"webp",
			"svg",
		])("returns 'image' for .%s", (ext) => {
			expect(getFileType(`image.${ext}`)).toBe("image");
		});
	});

	describe("text files", () => {
		it.each([
			"txt",
			"doc",
			"docx",
			"csv",
			"rtf",
			"md",
		])("returns 'text' for .%s", (ext) => {
			expect(getFileType(`document.${ext}`)).toBe("text");
		});
	});

	describe("pdf files", () => {
		it("returns 'pdf' for .pdf", () => {
			expect(getFileType("document.pdf")).toBe("pdf");
		});
	});

	describe("unknown / default files", () => {
		it("returns 'file' for an unknown extension", () => {
			expect(getFileType("archive.zip")).toBe("file");
		});

		it("returns 'file' for a filename with no extension", () => {
			expect(getFileType("noextension")).toBe("file");
		});

		it("returns 'file' for an empty string", () => {
			expect(getFileType("")).toBe("file");
		});
	});

	describe("edge cases", () => {
		it("is case-insensitive for uppercase extensions", () => {
			expect(getFileType("video.MP4")).toBe("video");
			expect(getFileType("image.JPG")).toBe("image");
			expect(getFileType("document.PDF")).toBe("pdf");
		});

		it("uses the last segment after a dot for compound filenames", () => {
			// archive.tar.gz → extension is "gz" → unknown → "file"
			expect(getFileType("archive.tar.gz")).toBe("file");
		});

		it("treats dotfiles as having no meaningful extension", () => {
			// ".gitignore" → split(".") → ["", "gitignore"] → pop() → "gitignore" → unknown
			expect(getFileType(".gitignore")).toBe("file");
		});
	});
});
