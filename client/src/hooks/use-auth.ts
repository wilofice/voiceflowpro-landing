import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export type AuthUser = {
  id: string;
  username: string;
  email: string | null;
};

const AUTH_QUERY_KEY = ["auth", "session"] as const;

async function fetchSession(): Promise<AuthUser | null> {
  const response = await fetch("/api/auth/session", {
    credentials: "include",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to load session");
  }

  return (await response.json()) as AuthUser;
}

export function useAuth() {
  const queryClient = useQueryClient();

  const query = useQuery<AuthUser | null>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: fetchSession,
    staleTime: 0,
    retry: false,
  });

  const setUser = useCallback(
    (user: AuthUser | null) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, user);
    },
    [queryClient],
  );

  const refresh = useCallback(() => {
    return queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
  }, [queryClient]);

  return {
    user: query.data ?? null,
    isLoading: query.isLoading,
    error: (query.error as Error) ?? null,
    refresh,
    setUser,
  };
}
