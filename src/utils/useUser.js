import * as React from "react";

function useSafeSession() {
  const [session, setSession] = React.useState(null);
  const [status, setStatus] = React.useState("loading");
  const attemptedRef = React.useRef(false);
  const timeoutRef = React.useRef(null);

  React.useEffect(() => {
    let mounted = true;

    if (attemptedRef.current) {
      return;
    }
    attemptedRef.current = true;

    timeoutRef.current = setTimeout(() => {
      if (mounted && status === "loading") {
        setSession(null);
        setStatus("unauthenticated");
      }
    }, 5000);

    async function checkSession() {
      try {
        let response;
        try {
          response = await fetch("/api/auth/session", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            signal: AbortSignal.timeout(4000),
          });
        } catch (fetchError) {
          if (mounted) {
            clearTimeout(timeoutRef.current);
            setSession(null);
            setStatus("unauthenticated");
          }
          return;
        }

        if (response.status === 204) {
          if (mounted) {
            clearTimeout(timeoutRef.current);
            setSession(null);
            setStatus("unauthenticated");
          }
          return;
        }

        if (!response.ok) {
          if (mounted) {
            clearTimeout(timeoutRef.current);
            setSession(null);
            setStatus("unauthenticated");
          }
          return;
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          if (mounted) {
            clearTimeout(timeoutRef.current);
            setSession(null);
            setStatus("unauthenticated");
          }
          return;
        }

        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          if (mounted) {
            clearTimeout(timeoutRef.current);
            setSession(null);
            setStatus("unauthenticated");
          }
          return;
        }

        if (mounted) {
          clearTimeout(timeoutRef.current);
          setSession(data);
          setStatus(data?.user ? "authenticated" : "unauthenticated");
        }
      } catch (error) {
        if (mounted) {
          clearTimeout(timeoutRef.current);
          setSession(null);
          setStatus("unauthenticated");
        }
      }
    }

    checkSession();

    return () => {
      mounted = false;
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return { data: session, status };
}

const useUser = () => {
  const { data: session, status } = useSafeSession();
  const user = session?.user || null;

  const refetchUser = React.useCallback(async () => {
    try {
      let response;
      try {
        response = await fetch("/api/auth/session", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          signal: AbortSignal.timeout(5000),
        });
      } catch (fetchError) {
        return null;
      }

      if (response.status === 204) {
        return null;
      }

      if (!response.ok) {
        return null;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        return null;
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        return null;
      }

      return data?.user || null;
    } catch (error) {
      return null;
    }
  }, []);

  return {
    user,
    data: user,
    loading: status === "loading",
    refetch: refetchUser,
  };
};

export { useUser };
export default useUser;
