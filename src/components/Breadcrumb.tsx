import { setPaths } from "@/utils/path";
import { Icon } from "@iconify/react";
import { useCallback } from "react";

export type PagePathProps = {
	paths: string[];
};

const PagePath = ({ paths }: PagePathProps) => {
	const icon = <Icon icon="mdi:folder-open" className="w-4 h-4" />;
	const separator = <Icon icon="mdi-light:chevron-right" className="w-4 h-4" />;

	const getKey = useCallback(
		(index: number) => paths.slice(0, index + 1).join(),
		[paths],
	);

	const Button = ({
		children,
		index,
	}: { children: React.ReactNode; index: number }) => (
		<button
			type="button"
			className="text-sm font-medium cursor-pointer"
			onClick={() => setPaths(paths.slice(0, index + 1))}
		>
			{children}
		</button>
	);

	return (
		<nav aria-label="Breadcrumb" className="flex px-4 text-sm">
			<ol className="flex items-center opacity-80">
				<li className="flex items-center gap-1">
					{icon}
					<Button index={-1}>TOP</Button>
				</li>

				{paths.map((path, index) => (
					<li key={getKey(index)} className="flex items-center">
						{separator}
						<Button index={index}>{path}</Button>
					</li>
				))}
			</ol>
		</nav>
	);
};

export default PagePath;
