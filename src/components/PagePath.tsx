import SlashSvg from "@/assets/SlashSvg";

export type PagePathProps = {
  paths: string[];
};

const PagePath = ({ paths }: PagePathProps) => {
  return (
    <nav className="px-5 py-3 flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center">
        {paths.map((path, index) => (
          <li key={index} className="inline-flex items-center">
            <SlashSvg className="w-4" />
            <span className="text-sm font-medium">{path}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default PagePath;
