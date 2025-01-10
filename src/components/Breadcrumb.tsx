import { Icon } from "@iconify/react";
import { setPaths } from "@/utils/path";
import { useCallback } from "react";

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

	const Button = ({
		children,
		index,
	}: { children: React.ReactNode; index: number }) => (
		<button
			type="button"
			className="text-sm font-medium"
			onClick={() => clickPath(index)}
		>
			{children}
		</button>
	);

	const getKey = useCallback(
		(index: number) => paths.slice(0, index + 1).join(),
		[paths],
	);

	const clickPath = useCallback(
		(index: number) => {
			setPaths(paths.slice(0, index + 1));
		},
		[paths],
	);

	return (
		<nav aria-label="Breadcrumb" className="flex px-4 text-sm">
			<ol className="flex items-center opacity-80 gap-2">
				<li className="inline-flex items-center gap-1">
					{icon}
					<Button index={-1}>Home</Button>
				</li>

				{paths.map((path, index) => (
					<li key={getKey(index)} className="inline-flex items-center gap-1">
						{separator}
						{icon}
						<Button index={index}>{path}</Button>
					</li>
				))}
			</ol>
		</nav>
	);
};

export default PagePath;
