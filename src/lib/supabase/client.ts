import { createBrowserClient } from '@supabase/ssr'

/**
 * Unauthenticated Supabase client for public reads (e.g., landing page).
 * RLS policies that require auth.uid() will NOT work with this client.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * Authenticated Supabase client that injects the Firebase ID token as a
 * custom Authorization header. This allows Supabase RLS policies using
 * auth.uid() to resolve the current user via Firebase Third-party Auth.
 *
 * Use this for all authenticated mutations and reads.
 */
export function createAuthenticatedClient(firebaseToken: string) {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${firebaseToken}`,
        },
      },
    }
  )
}
