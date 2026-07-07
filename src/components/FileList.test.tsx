import { describe, expect, it } from "vitest";
import type { DirectoryItem } from "@/types/api";
import { fileListInitialState, fileListReducer } from "./FileList";

const mockFile: DirectoryItem = { name: "photo.jpg", type: "file" };
const mockDir: DirectoryItem = { name: "photos", type: "directory" };
const mockPosition = { x: 100, y: 200 };

describe("fileListReducer", () => {
  describe("OPEN_CONTEXT_MENU", () => {
    it("sets the context menu with the provided item and position", () => {
      const state = fileListReducer(fileListInitialState, {
        type: "OPEN_CONTEXT_MENU",
        item: mockFile,
        position: mockPosition,
      });

      expect(state.contextMenu).toEqual({
        item: mockFile,
        position: mockPosition,
      });
      expect(state.activeModal).toBeNull();
    });

    it("replaces a previously open context menu", () => {
      const first = fileListReducer(fileListInitialState, {
        type: "OPEN_CONTEXT_MENU",
        item: mockFile,
        position: { x: 10, y: 20 },
      });
      const second = fileListReducer(first, {
        type: "OPEN_CONTEXT_MENU",
        item: mockDir,
        position: mockPosition,
      });

      expect(second.contextMenu?.item).toBe(mockDir);
      expect(second.contextMenu?.position).toEqual(mockPosition);
    });
  });

  describe("CLOSE_CONTEXT_MENU", () => {
    it("clears the context menu", () => {
      const withMenu = fileListReducer(fileListInitialState, {
        type: "OPEN_CONTEXT_MENU",
        item: mockFile,
        position: mockPosition,
      });
      const state = fileListReducer(withMenu, { type: "CLOSE_CONTEXT_MENU" });

      expect(state.contextMenu).toBeNull();
    });
  });

  describe("OPEN_RENAME_MODAL", () => {
    it("closes the context menu and opens the rename modal", () => {
      const withMenu = fileListReducer(fileListInitialState, {
        type: "OPEN_CONTEXT_MENU",
        item: mockFile,
        position: mockPosition,
      });
      const state = fileListReducer(withMenu, { type: "OPEN_RENAME_MODAL" });

      expect(state.contextMenu).toBeNull();
      expect(state.activeModal).toEqual({ type: "rename", item: mockFile });
    });

    it("is a no-op when no context menu is open", () => {
      const state = fileListReducer(fileListInitialState, {
        type: "OPEN_RENAME_MODAL",
      });

      expect(state).toEqual(fileListInitialState);
    });
  });

  describe("OPEN_MOVE_MODAL", () => {
    it("closes the context menu and opens the move modal", () => {
      const withMenu = fileListReducer(fileListInitialState, {
        type: "OPEN_CONTEXT_MENU",
        item: mockFile,
        position: mockPosition,
      });
      const state = fileListReducer(withMenu, { type: "OPEN_MOVE_MODAL" });

      expect(state.contextMenu).toBeNull();
      expect(state.activeModal).toEqual({ type: "move", item: mockFile });
    });

    it("is a no-op when no context menu is open", () => {
      const state = fileListReducer(fileListInitialState, {
        type: "OPEN_MOVE_MODAL",
      });

      expect(state).toEqual(fileListInitialState);
    });
  });

  describe("OPEN_TRASH_MODAL", () => {
    it("closes the context menu and opens the trash modal", () => {
      const withMenu = fileListReducer(fileListInitialState, {
        type: "OPEN_CONTEXT_MENU",
        item: mockDir,
        position: mockPosition,
      });
      const state = fileListReducer(withMenu, { type: "OPEN_TRASH_MODAL" });

      expect(state.contextMenu).toBeNull();
      expect(state.activeModal).toEqual({ type: "trash", item: mockDir });
    });

    it("is a no-op when no context menu is open", () => {
      const state = fileListReducer(fileListInitialState, {
        type: "OPEN_TRASH_MODAL",
      });

      expect(state).toEqual(fileListInitialState);
    });
  });

  describe("CLOSE_MODAL", () => {
    it("clears the active modal while preserving other state", () => {
      const withMenu = fileListReducer(fileListInitialState, {
        type: "OPEN_CONTEXT_MENU",
        item: mockFile,
        position: mockPosition,
      });
      const withModal = fileListReducer(withMenu, {
        type: "OPEN_RENAME_MODAL",
      });
      expect(withModal.activeModal).not.toBeNull();

      const state = fileListReducer(withModal, { type: "CLOSE_MODAL" });

      expect(state.activeModal).toBeNull();
    });

    it("is idempotent when no modal is open", () => {
      const state = fileListReducer(fileListInitialState, {
        type: "CLOSE_MODAL",
      });

      expect(state.activeModal).toBeNull();
    });
  });
});
