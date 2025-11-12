const requiredEnvVars = {
	VITE_ENDPOINT_API: import.meta.env.VITE_ENDPOINT_API,
	VITE_ENDPOINT_DATA: import.meta.env.VITE_ENDPOINT_DATA,
};

for (const [key, value] of Object.entries(requiredEnvVars)) {
	if (!value) {
		console.warn(`Environment variable ${key} is not set`);
	}
}

export const ENDPOINT_API = requiredEnvVars.VITE_ENDPOINT_API ?? "";
export const ENDPOINT_DATA = requiredEnvVars.VITE_ENDPOINT_DATA ?? "";
export const ENDPOINT_LIST = `${ENDPOINT_API}list/`;
export const ENDPOINT_UPLOAD = `${ENDPOINT_API}upload/`;
export const ENDPOINT_RENAME = `${ENDPOINT_API}rename/`;
export const ENDPOINT_DELETE = `${ENDPOINT_API}delete/`;
