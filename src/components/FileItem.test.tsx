import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FileItem from "@/components/FileItem";
import { getImageAlt, getOpenFileAriaLabel } from "@/constants/messages";

const dirPath = "http://localhost/data/docs/";

describe("FileItem", () => {
  it("renders a directory as a plain name without a link", () => {
    render(
      <FileItem
        file={{ name: "photos", type: "directory" }}
        dirPath={dirPath}
      />,
    );

    expect(screen.getByText("photos")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders an image file as an img with an encoded src", () => {
    render(
      <FileItem
        file={{ name: "my photo.jpg", type: "file" }}
        dirPath={dirPath}
      />,
    );

    const img = screen.getByAltText(getImageAlt("my photo.jpg"));
    expect(img).toHaveAttribute("src", `${dirPath}my%20photo.jpg`);
    expect(screen.getByText("my photo.jpg")).toBeInTheDocument();
  });

  it("renders a non-image file as a new-tab link with an encoded href", () => {
    render(
      <FileItem
        file={{ name: "notes 1.txt", type: "file" }}
        dirPath={dirPath}
      />,
    );

    const link = screen.getByRole("link", {
      name: getOpenFileAriaLabel("notes 1.txt"),
    });
    expect(link).toHaveAttribute("href", `${dirPath}notes%201.txt`);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });

  it("renders unknown extensions as a generic file link", () => {
    render(
      <FileItem file={{ name: "data.xyz", type: "file" }} dirPath={dirPath} />,
    );

    expect(
      screen.getByRole("link", { name: getOpenFileAriaLabel("data.xyz") }),
    ).toBeInTheDocument();
  });
});
