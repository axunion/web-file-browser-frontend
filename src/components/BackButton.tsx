import { Icon } from "@iconify/react";

const BackButton = () => {
	return (
		<button
			type="button"
			className="text-(--primary-color)"
			onClick={() => window.history.back()}
		>
			<Icon icon="line-md:chevron-left" className="w-8 h-8" />
		</button>
	);
};

export default BackButton;
