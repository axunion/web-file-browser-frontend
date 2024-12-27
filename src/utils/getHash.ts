export type HashResult = {
	hash: string;
	path: string;
	paths: string[];
};

export const getHash = (): HashResult => {
	const hash = window?.location.hash || "";
	const path = hash.slice(1);
	const paths = path ? path.split("/").filter(Boolean) : [];

	return {
		hash,
		path,
		paths,
	};
};
