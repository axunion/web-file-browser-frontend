export type PathResult = {
	path: string;
	paths: string[];
};

export const getPath = (): PathResult => {
	const hash = window?.location.hash || "";
	const path = hash.slice(1);
	const paths = path ? path.split("/").filter(Boolean) : [];
	return { path, paths };
};

export const setPath = (path: string) => {
	window.location.hash = path;
};

export const setPaths = (paths: string[]) => {
	if (!paths.length) {
		resetPath();
	} else {
		setPath(`/${paths.join("/")}`);
	}
};

export const appendPath = (path: string) => {
	const { paths } = getPath();
	setPaths([...paths, path]);
};

export const resetPath = () => {
	window.location.href = "";
};
