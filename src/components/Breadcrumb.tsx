import { Icon } from "@iconify/react";
import { useCallback } from "react";
import { setPaths } from "@/utils/path";

export type BreadcrumbProps = {
	paths: string[];
};

const Button = ({
	children,
	onClick,
}: {
	children: React.ReactNode;
	onClick: () => void;
}) => (
	<button
		type="button"
		className="text-sm font-medium cursor-pointer"
		onClick={onClick}
	>
		{children}
	</button>
);

const Breadcrumb = ({ paths }: BreadcrumbProps) => {
	const itemStyle = "my-1 flex items-center cursor-pointer";
	const getKey = useCallback(
		(index: number) => paths.slice(0, index + 1).join(),
		[paths],
	);
	const handleClick = (index: number) => {
		setPaths(paths.slice(0, index + 1));
	};

	return (
		<nav aria-label="Breadcrumb" className="px-4 opacity-80">
			<ol className="flex flex-wrap items-center">
				<li className={itemStyle}>
					<Button onClick={() => handleClick(-1)}>
						<span className="flex items-center gap-1">
							<Icon icon="mdi:folder-open" className="w-5 h-5" />
							TOP
						</span>
					</Button>
				</li>

				{paths.map((path, index) => (
					<li key={getKey(index)} className={itemStyle}>
						<Icon icon="mdi:chevron-right" className="w-4 h-4" />
						<Button onClick={() => handleClick(index)}>{path}</Button>
					</li>
				))}
			</ol>
		</nav>
	);
};

export default Breadcrumb;
