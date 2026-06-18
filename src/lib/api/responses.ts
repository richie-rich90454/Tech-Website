import { NextResponse } from 'next/server';
import { toErrorMessage, AppError } from '@/lib/errors';

export type ApiOk<T> = { ok: true; data: T };
export type ApiErr = { ok: false; error: string; details?: unknown };
export type ApiResponse<T> = ApiOk<T> | ApiErr;

export function ok<T>(data: T, init?: ResponseInit): NextResponse<ApiOk<T>> {
  return NextResponse.json<ApiOk<T>>({ ok: true, data }, init);
}

export function badRequest(message: string, details?: unknown): NextResponse<ApiErr> {
  return NextResponse.json<ApiErr>({ ok: false, error: message, details }, { status: 400 });
}

export function unauthorized(message = 'Unauthorized'): NextResponse<ApiErr> {
  return NextResponse.json<ApiErr>({ ok: false, error: message }, { status: 401 });
}

export function forbidden(message = 'Forbidden'): NextResponse<ApiErr> {
  return NextResponse.json<ApiErr>({ ok: false, error: message }, { status: 403 });
}

export function notFound(message = 'Not found'): NextResponse<ApiErr> {
  return NextResponse.json<ApiErr>({ ok: false, error: message }, { status: 404 });
}

export function serverError(err: unknown): NextResponse<ApiErr> {
  if (err instanceof AppError) {
    return NextResponse.json<ApiErr>(
      { ok: false, error: err.message },
      { status: err.status },
    );
  }
  return NextResponse.json<ApiErr>(
    { ok: false, error: toErrorMessage(err) },
    { status: 500 },
  );
}
