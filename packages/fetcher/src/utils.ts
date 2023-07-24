export function getErrorMessage(error: unknown): string {
    if (typeof error === "string") {
        return error;
    }

    if (error instanceof Error) {
        if ("cause" in error) {
            return getErrorMessage(error.cause);
        }

        return error.message;
    }

    return "Unknown error";
}
