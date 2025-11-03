import {type NextRequest, NextResponse} from 'next/server';

export type RouteHandler<Context = unknown> = (
  request: NextRequest,
  context: Context
) => Promise<Response> | Response;

export interface ErrorHandlingOptions {
  authErrorMessage?: string | Record<string, unknown>;
  defaultErrorMessage?: string | Record<string, unknown>;
}

function isNextSpecialError(error: unknown): boolean {
  const digest = (error as any)?.digest;
  return typeof digest === 'string' && (digest.startsWith('NEXT_REDIRECT') || digest.startsWith('NEXT_NOT_FOUND'));
}

export function withErrorHandling<Context = unknown>(
  handler: RouteHandler<Context>,
  options?: ErrorHandlingOptions
): RouteHandler<Context> {
  return async (request: NextRequest, context: Context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (isNextSpecialError(error)) {
        throw error as Error;
      }

      const method = request.method;
      const path = request.nextUrl?.pathname ?? 'unknown-path';
      console.error(`[API] Unhandled error ${method} ${path}:`, error);
      const body =
        typeof options?.defaultErrorMessage === 'string'
          ? { error: options!.defaultErrorMessage }
          : options?.defaultErrorMessage ?? { error: 'Internal Server Error' };
      return NextResponse.json(body, { status: 500 });
    }
  };
}


