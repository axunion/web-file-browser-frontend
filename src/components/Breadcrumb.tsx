import { useCallback } from "react";

export type PagePathProps = {
  paths: string[];
};

const PagePath = ({ paths }: PagePathProps) => {
  const clickPath = useCallback(
    (index: number) => {
      const clickedPath = paths.slice(0, index + 1).join("/");
      console.log(clickedPath);
    },
    [paths]
  );

  return (
    <nav aria-label="Breadcrumb" className="flex px-4 text-sm">
      <ol className="flex items-center opacity-80 gap-2">
        <li className="inline-flex items-center gap-1">
          <span className="i-flat-color-icons:opened-folder w-4 h-4"></span>
          <span>Home</span>
        </li>

        {paths.map((path, index) => (
          <li key={path} className="inline-flex items-center gap-1">
            <span className="i-mdi:keyboard-arrow-right w-3 h-3"></span>
            <span className="i-flat-color-icons:opened-folder w-4 h-4"></span>

            <button
              className="text-sm font-medium"
              onClick={() => clickPath(index)}
              aria-current={index === paths.length - 1 ? "page" : undefined}
            >
              {path}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default PagePath;
