import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useToast from "./useToast";

describe("useToast", () => {
  beforeEach(() => {
    vi.spyOn(crypto, "randomUUID").mockReturnValue(
      "fixed-id" as ReturnType<typeof crypto.randomUUID>,
    );
  });

  it("initializes with an empty toasts array", () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toasts).toEqual([]);
  });

  describe("showToast", () => {
    it("adds a toast with the given type and message", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showToast("success", "Upload complete");
      });

      expect(result.current.toasts).toEqual([
        { id: "fixed-id", type: "success", message: "Upload complete" },
      ]);
    });

    it("appends multiple toasts in order", () => {
      vi.spyOn(crypto, "randomUUID")
        .mockReturnValueOnce("id-1" as ReturnType<typeof crypto.randomUUID>)
        .mockReturnValueOnce("id-2" as ReturnType<typeof crypto.randomUUID>);

      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showToast("success", "First");
        result.current.showToast("error", "Second");
      });

      expect(result.current.toasts).toHaveLength(2);
      expect(result.current.toasts[0]).toMatchObject({
        id: "id-1",
        type: "success",
        message: "First",
      });
      expect(result.current.toasts[1]).toMatchObject({
        id: "id-2",
        type: "error",
        message: "Second",
      });
    });

    it("supports all toast types: success, error, warning", () => {
      vi.spyOn(crypto, "randomUUID")
        .mockReturnValueOnce("a" as ReturnType<typeof crypto.randomUUID>)
        .mockReturnValueOnce("b" as ReturnType<typeof crypto.randomUUID>)
        .mockReturnValueOnce("c" as ReturnType<typeof crypto.randomUUID>);

      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showToast("success", "ok");
        result.current.showToast("error", "fail");
        result.current.showToast("warning", "warn");
      });

      const types = result.current.toasts.map((t) => t.type);
      expect(types).toEqual(["success", "error", "warning"]);
    });
  });

  describe("dismissToast", () => {
    it("removes the toast with the matching id", () => {
      vi.spyOn(crypto, "randomUUID").mockReturnValue(
        "to-remove" as ReturnType<typeof crypto.randomUUID>,
      );

      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showToast("warning", "Watch out");
      });
      expect(result.current.toasts).toHaveLength(1);

      act(() => {
        result.current.dismissToast("to-remove");
      });
      expect(result.current.toasts).toHaveLength(0);
    });

    it("only removes the toast with the matching id, leaving others", () => {
      vi.spyOn(crypto, "randomUUID")
        .mockReturnValueOnce("keep" as ReturnType<typeof crypto.randomUUID>)
        .mockReturnValueOnce("remove" as ReturnType<typeof crypto.randomUUID>);

      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showToast("success", "Keep me");
        result.current.showToast("error", "Remove me");
      });

      act(() => {
        result.current.dismissToast("remove");
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0]).toMatchObject({
        id: "keep",
        message: "Keep me",
      });
    });

    it("is a no-op when the id does not match any toast", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showToast("success", "Existing");
      });

      act(() => {
        result.current.dismissToast("nonexistent-id");
      });

      expect(result.current.toasts).toHaveLength(1);
    });
  });
});
