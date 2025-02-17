import { Icon } from "@iconify/react";
import { useState } from "react";

type TabName = "File" | "Trash";
type ButtonProps = {
	children: React.ReactNode;
	isActive: boolean;
	onClick?: () => void;
};

const Button = ({ children, isActive, onClick }: ButtonProps) => {
	return (
		<button
			type="button"
			className={`px-6 py-3 cursor-pointer duration-200 ${
				isActive ? "text-(--primary-color)" : "opacity-25"
			}`}
			onClick={onClick}
		>
			{children}
		</button>
	);
};

const TabBar = () => {
	const [activeTab, setActiveTab] = useState<TabName>("File");

	return (
		<div className="fixed bottom-0 w-full bg-[--background-color">
			<div className="flex justify-around px-8">
				<Button
					isActive={activeTab === "File"}
					onClick={() => setActiveTab("File")}
					aria-label="File"
				>
					<Icon icon="bi:folder-fill" className="w-8 h-8" />
				</Button>

				<Button
					isActive={activeTab === "Trash"}
					onClick={() => setActiveTab("Trash")}
					aria-label="Trash"
				>
					<Icon icon="bi:trash3-fill" className="w-7 h-7" />
				</Button>
			</div>
		</div>
	);
};

export default TabBar;
