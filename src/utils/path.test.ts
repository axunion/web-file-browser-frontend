import { beforeEach, describe, expect, it } from "vitest";
import {
	appendPath,
	getParentPaths,
	getPath,
	resetPath,
	setPath,
	setPaths,
	toEncodedPath,
} from "./path";

describe("path utilities", () => {
	beforeEach(() => {
		window.location.hash = "";
	});

	describe("getPath", () => {
		it("should return empty path for no hash", () => {
			window.location.hash = "";
			const result = getPath();
			expect(result.path).toBe("");
			expect(result.paths).toEqual([]);
		});

		it("should parse single segment hash path", () => {
			window.location.hash = "#/folder1";
			const result = getPath();
			expect(result.paths).toEqual(["folder1"]);
		});

		it("should parse multiple segment hash path", () => {
			window.location.hash = "#/folder1/folder2/folder3";
			const result = getPath();
			expect(result.paths).toEqual(["folder1", "folder2", "folder3"]);
		});

		it("should filter out path traversal attempts with ..", () => {
			window.location.hash = "#/../folder/../sensitive";
			const result = getPath();
			expect(result.paths).not.toContain("..");
			expect(result.paths).toEqual(["folder", "sensitive"]);
		});

		it("should filter out single dot segments", () => {
			window.location.hash = "#/./folder/./file";
			const result = getPath();
			expect(result.paths).not.toContain(".");
			expect(result.paths).toEqual(["folder", "file"]);
		});

		it("should decode URI components", () => {
			window.location.hash = "#/my%20folder/file%20name";
			const result = getPath();
			expect(result.paths).toEqual(["my folder", "file name"]);
		});

		it("should handle special characters in paths", () => {
			window.location.hash = "#/folder%40test/file%23name";
			const result = getPath();
			expect(result.paths).toEqual(["folder@test", "file#name"]);
		});

		it("should decode japanese path segments", () => {
			window.location.hash =
				"#/%E6%97%A5%E6%9C%AC%E8%AA%9E/%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB";
			const result = getPath();
			expect(result.paths).toEqual(["日本語", "ファイル"]);
		});

		it("should filter empty segments", () => {
			window.location.hash = "#//folder//file/";
			const result = getPath();
			expect(result.paths).toEqual(["folder", "file"]);
		});

		it("should return encoded path string", () => {
			window.location.hash = "#/my%20folder/file%20name";
			const result = getPath();
			expect(result.path).toBe("my%20folder/file%20name");
		});
	});

	describe("setPath", () => {
		it("should set hash correctly", () => {
			setPath("/test/path");
			expect(window.location.hash).toBe("#/test/path");
		});

		it("should set empty path", () => {
			setPath("");
			expect(window.location.hash).toBe("");
		});
	});

	describe("setPaths", () => {
		it("should set paths with proper encoding", () => {
			setPaths(["folder1", "folder2"]);
			expect(window.location.hash).toBe("#/folder1/folder2");
		});

		it("should encode special characters", () => {
			setPaths(["my folder", "file name"]);
			expect(window.location.hash).toBe("#/my%20folder/file%20name");
		});

		it("should reset path for empty array", () => {
			window.location.hash = "#/some/path";
			setPaths([]);
			expect(window.location.hash).toBe("");
		});
	});

	describe("appendPath", () => {
		it("should append to empty path", () => {
			window.location.hash = "";
			appendPath("folder1");
			expect(window.location.hash).toBe("#/folder1");
		});

		it("should append to existing path", () => {
			window.location.hash = "#/folder1";
			appendPath("folder2");
			expect(window.location.hash).toBe("#/folder1/folder2");
		});

		it("should encode special characters when appending", () => {
			window.location.hash = "#/folder1";
			appendPath("my folder");
			expect(window.location.hash).toBe("#/folder1/my%20folder");
		});
	});

	describe("toEncodedPath", () => {
		it("should encode spaces, hashes, and japanese characters", () => {
			expect(toEncodedPath(["日本語", "folder #1", "my file.txt"])).toBe(
				"%E6%97%A5%E6%9C%AC%E8%AA%9E/folder%20%231/my%20file.txt",
			);
		});

		it("should drop traversal segments", () => {
			expect(toEncodedPath(["safe", "..", ".", "nested"])).toBe("safe/nested");
		});
	});

	describe("getParentPaths", () => {
		it("should return the parent segments", () => {
			expect(getParentPaths(["a", "b", "c"])).toEqual(["a", "b"]);
		});

		it("should return an empty array for the root level", () => {
			expect(getParentPaths(["only"])).toEqual([]);
		});
	});

	describe("resetPath", () => {
		it("should clear hash", () => {
			window.location.hash = "#/some/path";
			resetPath();
			expect(window.location.hash).toBe("");
		});

		it("should be idempotent", () => {
			resetPath();
			resetPath();
			expect(window.location.hash).toBe("");
		});
	});
});
