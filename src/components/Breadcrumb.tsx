import { Icon } from "@iconify/react";
import { useCallback } from "react";
import { setPaths } from "@/utils/path";

export type PagePathProps = {
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

const PagePath = ({ paths }: PagePathProps) => {
	const getKey = useCallback(
		(index: number) => paths.slice(0, index + 1).join(),
		[paths],
	);

	const handleClick = (index: number) => {
		setPaths(paths.slice(0, index + 1));
	};

	return (
		<nav aria-label="Breadcrumb" className="flex px-4 text-sm">
			<ol className="flex items-center opacity-80">
				<li className="flex items-center">
					<Button onClick={() => handleClick(-1)}>
						<Icon icon="flat-color-icons:opened-folder" className="w-5 h-5" />
					</Button>
				</li>

				{paths.map((path, index) => (
					<li key={getKey(index)} className="flex items-center">
						<Icon icon="mdi:chevron-right" className="w-4 h-4" />
						<Button onClick={() => handleClick(index)}>{path}</Button>
					</li>
				))}
			</ol>
		</nav>
	);
};

export default PagePath;
