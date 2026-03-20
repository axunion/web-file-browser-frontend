export type PathResult = {
	path: string;
	paths: string[];
};

const decodePathSegment = (segment: string) => {
	try {
		return decodeURIComponent(segment);
	} catch {
		return segment;
	}
};

const sanitizePaths = (paths: string[]) =>
	paths
		.filter(Boolean)
		.filter((segment) => segment !== ".." && segment !== ".");

export const toEncodedPath = (paths: string[]) =>
	sanitizePaths(paths)
		.map((segment) => encodeURIComponent(segment))
		.join("/");

export const getParentPaths = (paths: string[]) => paths.slice(0, -1);

export const getPath = (): PathResult => {
	const hash = window?.location.hash || "";
	const path = hash.slice(1);
	const paths = path
		? sanitizePaths(
				path
					.split("/")
					.filter(Boolean)
					.map((segment) => decodePathSegment(segment)),
			)
		: [];

	return { path: toEncodedPath(paths), paths };
};

export const setPath = (path: string) => {
	window.location.hash = path;
};

export const setPaths = (paths: string[]) => {
	const encodedPath = toEncodedPath(paths);

	if (!encodedPath) {
		resetPath();
	} else {
		setPath(`/${encodedPath}`);
	}
};

export const appendPath = (path: string) => {
	const { paths } = getPath();
	setPaths([...paths, path]);
};

export const resetPath = () => {
	window.location.hash = "";
};
