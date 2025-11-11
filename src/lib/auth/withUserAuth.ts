'use server';

import type { UserAuth } from '@/lib/auth/getUserAuth';
import { getUserAuthOrThrow } from '@/lib/auth/getUserAuth';

/**
 * Executes the provided async function within an authenticated server context.
 *
 * Default behavior:
 * - If authentication is missing/invalid, returns null (does NOT throw).
 * - Any non-auth errors are rethrown to the caller.
 *
 * This keeps call sites concise while still allowing explicit error handling
 * for real failures in business logic.
 */
export async function withUserAuth<T>(
  fn: (ctx: { userAuth: UserAuth }) => Promise<T>
): Promise<T | null> {
  try {
    const userAuth = await getUserAuthOrThrow();
    return await fn({ userAuth });
  } catch (error) {
    throw error;
  }
}


