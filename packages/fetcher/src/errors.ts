export class HttpError extends Error {
    public readonly status: number;
    public readonly statusText: string;

    public constructor(status: number, statusText: string) {
        super(`${status} ${statusText}`);

        this.status = status;
        this.statusText = statusText;
    }
}
