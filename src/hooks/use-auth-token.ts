import { useSession } from "next-auth/react";

/**
 * Custom hook to access authentication token from NextAuth session
 * @returns Object containing token and loading state
 */
export function useAuthToken() {
  const { data: session, status } = useSession();

  return {
    token: session?.user?.accessToken ?? null,
    loading: status === "loading",
    session,
  };
}
