import { Icon } from "@iconify/react";
import { useCallback } from "react";
import { MESSAGES } from "@/constants/messages";
import { setPaths } from "@/utils/path";
import styles from "./Breadcrumb.module.css";

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
	<button type="button" className={styles.button} onClick={onClick}>
		{children}
	</button>
);

const Breadcrumb = ({ paths }: BreadcrumbProps) => {
	const getKey = useCallback(
		(index: number) => paths.slice(0, index + 1).join(),
		[paths],
	);
	const handleClick = (index: number) => {
		setPaths(paths.slice(0, index + 1));
	};

	return (
		<nav aria-label={MESSAGES.BREADCRUMB} className={styles.nav}>
			<ol className={styles.list}>
				<li className={styles.item}>
					<Button onClick={() => handleClick(-1)}>
						<span className={styles.root}>
							<Icon icon="mdi:folder-open" className={styles.folderIcon} />
							{MESSAGES.BREADCRUMB_ROOT}
						</span>
					</Button>
				</li>

				{paths.map((path, index) => (
					<li key={getKey(index)} className={styles.item}>
						<Icon icon="mdi:chevron-right" className={styles.chevronIcon} />
						<Button onClick={() => handleClick(index)}>{path}</Button>
					</li>
				))}
			</ol>
		</nav>
	);
};

export default Breadcrumb;
