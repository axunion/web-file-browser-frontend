type EnvConfig = {
	VITE_ENDPOINT_API: string;
	VITE_ENDPOINT_DATA: string;
};

class ConfigurationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ConfigurationError";
	}
}

const validateEnv = (): EnvConfig => {
	const requiredEnvVars = {
		VITE_ENDPOINT_API: import.meta.env.VITE_ENDPOINT_API,
		VITE_ENDPOINT_DATA: import.meta.env.VITE_ENDPOINT_DATA,
	};

	const missingVars: string[] = [];

	for (const [key, value] of Object.entries(requiredEnvVars)) {
		if (!value || value.trim() === "") {
			missingVars.push(key);
		}
	}

	if (missingVars.length > 0) {
		const message = `Missing required environment variables: ${missingVars.join(", ")}. Please check your .env file.`;

		if (import.meta.env.DEV) {
			throw new ConfigurationError(message);
		}

		console.error(message);
	}

	return {
		VITE_ENDPOINT_API: requiredEnvVars.VITE_ENDPOINT_API ?? "",
		VITE_ENDPOINT_DATA: requiredEnvVars.VITE_ENDPOINT_DATA ?? "",
	};
};

const config = validateEnv();

export const ENDPOINT_API = config.VITE_ENDPOINT_API;
export const ENDPOINT_DATA = config.VITE_ENDPOINT_DATA;
export const ENDPOINT_LIST = `${ENDPOINT_API}list/`;
export const ENDPOINT_UPLOAD = `${ENDPOINT_API}upload/`;
export const ENDPOINT_RENAME = `${ENDPOINT_API}rename/`;
export const ENDPOINT_MOVE = `${ENDPOINT_API}move/`;
export const ENDPOINT_DELETE = `${ENDPOINT_API}delete/`;
