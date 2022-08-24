export const getError = (e: unknown) => {
	let message = "Unknown Error";
	if (e instanceof Error) message = e.message;
	return message;
};
