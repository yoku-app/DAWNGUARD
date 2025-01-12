export abstract class ErrorResponse extends Error {
    private statusCode: number;
    private logError: boolean;
    private metadata?: Record<string, any>;

    /**
     * Base error class for all custom errors in the application.
     * @param message - The error message.
     * @param statusCode - HTTP status code associated with the error.
     * @param logError - Flag to indicate whether the error should be logged (default: true).
     * @param metadata - Additional context or data to include with the error.
     */
    constructor(
        message: string,
        statusCode: number,
        logError: boolean = true,
        metadata?: Record<string, any>
    ) {
        super(message);
        this.statusCode = statusCode;
        this.logError = logError;
        this.metadata = metadata;

        // Capture the correct stack trace
        Error.captureStackTrace(this, this.constructor);
    }

    /**
     * Abstract method to get specific error details.
     */
    protected abstract getErrors(): { message: string; field?: string }[];

    /**
     * Serializes the error into a standard response format.
     */
    public serializeErrors(): {
        errors: { message: string; field?: string }[];
    } {
        return {
            errors: this.getErrors(),
        };
    }

    /**
     * Retrieves the HTTP status code associated with the error.
     */
    public getStatus(): number {
        return this.statusCode;
    }

    /**
     * Indicates whether the error should be logged.
     */
    public shouldLogError(): boolean {
        return this.logError;
    }

    /**
     * Retrieves metadata associated with the error.
     */
    public getMetadata(): Record<string, unknown> | undefined {
        return this.metadata;
    }

    /**
     * Logs detailed information about the error.
     */
    public logDetails(): Record<string, unknown> {
        return {
            message: this.message,
            stack: this.shouldLogError() ? this.stack : undefined,
            metadata: this.metadata,
        };
    }
}

export class BadRequestError extends ErrorResponse {
    /**
     * Error for handling bad requests (400).
     * @param message - The error message.
     */
    constructor(message: string) {
        super(message, 400);
    }

    protected getErrors() {
        return [{ message: this.message }];
    }
}

export class AuthenticationError extends ErrorResponse {
    /**
     * Error for handling authentication issues (401).
     * @param message - The error message.
     */
    constructor(message: string) {
        super(message, 401);
    }

    protected getErrors() {
        return [{ message: this.message }];
    }
}

export class OperationError extends ErrorResponse {
    /**
     * Error for handling internal server issues (500).
     * @param message - The error message.
     */
    constructor(message: string) {
        super(message, 500);
    }

    protected getErrors() {
        return [{ message: this.message }];
    }
}

export class NotFoundError extends ErrorResponse {
    /**
     * Error for handling resource not found (404).
     * @param message - The error message.
     */
    constructor(message: string) {
        super(message, 404);
    }

    protected getErrors() {
        return [{ message: this.message }];
    }
}
