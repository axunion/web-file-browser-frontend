import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "@/App";
import { MESSAGES } from "@/constants/messages";
import useFileList from "@/hooks/useFileList";

vi.mock("@/hooks/useFileList", () => ({ default: vi.fn() }));

const mockedUseFileList = vi.mocked(useFileList);

describe("App navigation", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		window.location.hash = "#/first/second";

		mockedUseFileList.mockReturnValue({
			items: [],
			isLoading: false,
			errorMessage: null,
			setPath: vi.fn(),
			refresh: vi.fn().mockResolvedValue(undefined),
		});
	});

	it("should navigate to the parent directory from the header back button", async () => {
		render(<App />);

		fireEvent.click(screen.getByRole("button", { name: MESSAGES.BACK }));

		await waitFor(() => {
			expect(window.location.hash).toBe("#/first");
		});
	});
});
