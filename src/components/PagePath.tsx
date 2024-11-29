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

  const separator = () => (
    <span className="i-mdi:slash-forward inline-block"></span>
  );

  return (
    <nav aria-label="Breadcrumb" className="flex px-4">
      <ol className="inline-flex items-center opacity-80">
        <li className="inline-flex items-center">{separator()}</li>

        {paths.map((path, index) => (
          <li key={path} className="inline-flex items-center">
            {index === 0 ? null : separator()}

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
