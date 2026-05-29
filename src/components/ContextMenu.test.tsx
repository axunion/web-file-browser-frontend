import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MESSAGES } from "@/constants/messages";
import ContextMenu from "./ContextMenu";

const defaultProps = {
	position: { x: 100, y: 100 },
	onClose: vi.fn(),
	onRename: vi.fn(),
	onTrash: vi.fn(),
};

describe("ContextMenu", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("rendering", () => {
		it("renders rename and delete menu items", () => {
			render(<ContextMenu {...defaultProps} />);

			expect(
				screen.getByRole("menuitem", { name: MESSAGES.RENAME }),
			).toBeInTheDocument();
			expect(
				screen.getByRole("menuitem", { name: MESSAGES.DELETE }),
			).toBeInTheDocument();
		});

		it("does not render the move button when onMove is not provided", () => {
			render(<ContextMenu {...defaultProps} />);

			expect(
				screen.queryByRole("menuitem", { name: MESSAGES.MOVE }),
			).not.toBeInTheDocument();
		});

		it("renders the move button when onMove is provided", () => {
			render(<ContextMenu {...defaultProps} onMove={vi.fn()} />);

			expect(
				screen.getByRole("menuitem", { name: MESSAGES.MOVE }),
			).toBeInTheDocument();
		});

		it("has a menu container with the correct aria-label", () => {
			render(<ContextMenu {...defaultProps} />);

			expect(
				screen.getByRole("menu", { name: MESSAGES.FILE_ACTIONS }),
			).toBeInTheDocument();
		});
	});

	describe("callback behavior", () => {
		it("calls onRename when the rename item is clicked", () => {
			const onRename = vi.fn();
			render(<ContextMenu {...defaultProps} onRename={onRename} />);

			fireEvent.click(screen.getByRole("menuitem", { name: MESSAGES.RENAME }));

			expect(onRename).toHaveBeenCalledOnce();
		});

		it("calls onTrash when the delete item is clicked", () => {
			const onTrash = vi.fn();
			render(<ContextMenu {...defaultProps} onTrash={onTrash} />);

			fireEvent.click(screen.getByRole("menuitem", { name: MESSAGES.DELETE }));

			expect(onTrash).toHaveBeenCalledOnce();
		});

		it("calls onMove when the move item is clicked", () => {
			const onMove = vi.fn();
			render(<ContextMenu {...defaultProps} onMove={onMove} />);

			fireEvent.click(screen.getByRole("menuitem", { name: MESSAGES.MOVE }));

			expect(onMove).toHaveBeenCalledOnce();
		});

		it("calls onClose when the overlay is pointer-downed", () => {
			const onClose = vi.fn();
			render(<ContextMenu {...defaultProps} onClose={onClose} />);

			fireEvent.pointerDown(screen.getByRole("presentation"));

			expect(onClose).toHaveBeenCalledOnce();
		});

		it("does not call onClose when clicking inside the menu panel", () => {
			const onClose = vi.fn();
			render(<ContextMenu {...defaultProps} onClose={onClose} />);

			fireEvent.pointerDown(screen.getByRole("menu"));

			expect(onClose).not.toHaveBeenCalled();
		});
	});
});
