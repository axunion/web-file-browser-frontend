import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FileUploadButton from "@/components/FileUploadButton";
import { MESSAGES } from "@/constants/messages";

describe("FileUploadButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls onFilesSelected with the chosen files", async () => {
    const user = userEvent.setup();
    const onFilesSelected = vi.fn();
    render(<FileUploadButton onFilesSelected={onFilesSelected} />);

    const files = [new File(["a"], "a.txt"), new File(["b"], "b.txt")];
    await user.upload(
      screen.getByLabelText(MESSAGES.FILE_UPLOAD_BUTTON_ARIA_LABEL),
      files,
    );

    expect(onFilesSelected).toHaveBeenCalledWith(files);
  });

  it("resets the input so the same file can be selected again", async () => {
    const user = userEvent.setup();
    render(<FileUploadButton onFilesSelected={vi.fn()} />);

    const input = screen.getByLabelText<HTMLInputElement>(
      MESSAGES.FILE_UPLOAD_BUTTON_ARIA_LABEL,
    );
    await user.upload(input, new File(["a"], "a.txt"));

    expect(input.value).toBe("");
  });
});
