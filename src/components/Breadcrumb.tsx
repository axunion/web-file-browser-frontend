import { useCallback } from "react";
import { Icon } from "@iconify/react";

export type PagePathProps = {
  paths: string[];
};

const PagePath = ({ paths }: PagePathProps) => {
  const icon = (
    <Icon icon="flat-color-icons:opened-folder" className="w-6 h-6" />
  );
  const separator = (
    <Icon icon="mdi:keyboard-arrow-right" className="w-3 h-3" />
  );
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
          {icon}
          <span>Home</span>
        </li>

        {paths.map((path, index) => (
          <li key={path} className="inline-flex items-center gap-1">
            {separator}
            {icon}

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
