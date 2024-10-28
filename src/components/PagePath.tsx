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
    <nav className="px-5 py-3 flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center">
        {paths.map((path, index) => (
          <li key={path} className="inline-flex items-center">
            <span className="i-mdi:slash-forward inline-block"></span>
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
