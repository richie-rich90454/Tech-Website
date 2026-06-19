// Typed error utilities. Replaces ad-hoc `error: unknown` checks across the codebase.

export class AppError extends Error {
    public readonly status: number;
    public readonly cause?: unknown;

    constructor(message: string, status = 500, cause?: unknown) {
        super(message);
        this.name = 'AppError';
        this.status = status;
        this.cause = cause;
    }
}

export class ValidationError extends AppError {
    public readonly fieldErrors: Record<string, string>;

    constructor(message: string, fieldErrors: Record<string, string> = {}) {
        super(message, 400);
        this.name = 'ValidationError';
        this.fieldErrors = fieldErrors;
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Not found') {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
        this.name = 'UnauthorizedError';
    }
}

export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, 403);
        this.name = 'ForbiddenError';
    }
}

/**
 * Convert an unknown value (catch block, Promise rejection) into a safe string
 * suitable for user-facing error responses.
 */
export function toErrorMessage(err: unknown, fallback = 'Something went wrong'): string {
    if (err instanceof Error) return err.message;
    if (typeof err === 'string') return err;
    if (err && typeof err === 'object' && 'message' in err) {
        const m = (err as { message: unknown }).message;
        if (typeof m === 'string') return m;
    }
    return fallback;
}
