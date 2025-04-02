import { getPath, setPath, resetPath } from "@/utils/path";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

type TabName = "File" | "Trash";
type ButtonProps = {
	children: React.ReactNode;
	isActive: boolean;
	onClick?: () => void;
	[key: string]: unknown;
};

const Button = ({ children, isActive, onClick, ...props }: ButtonProps) => {
	return (
		<button
			type="button"
			className={`px-6 py-3 cursor-pointer duration-200 ${
				isActive ? "text-(--primary-color)" : "opacity-25"
			}`}
			onClick={onClick}
			{...props}
		>
			{children}
		</button>
	);
};

const TabBar = () => {
	const [activeTab, setActiveTab] = useState<TabName>("File");
	const [currentPath, setCurrentPath] = useState<string>("");

	const clickFile = () => {
		setActiveTab("File");

		if (currentPath === "") {
			resetPath();
		} else {
			setPath(currentPath);
		}
	};

	const clickTrash = () => {
		setActiveTab("Trash");
		setCurrentPath(getPath().path);
		setPath("trash");
	};

	useEffect(() => {
		const path = getPath().path;
		setActiveTab(path === "trash" ? "Trash" : "File");
	}, []);

	return (
		<div className="fixed bottom-0 w-full bg-(--background-color)/50 backdrop-blur-xs">
			<div className="flex justify-around px-8">
				<Button
					isActive={activeTab === "File"}
					onClick={clickFile}
					aria-label="File"
				>
					<Icon icon="bi:folder-fill" className="w-8 h-8" />
				</Button>

				<Button
					isActive={activeTab === "Trash"}
					onClick={clickTrash}
					aria-label="Trash"
				>
					<Icon icon="bi:trash3-fill" className="w-7 h-7" />
				</Button>
			</div>
		</div>
	);
};

export default TabBar;
