import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";

interface AuthContextValue {
  token: string | null;
  userId: string | null;
  isLoggedIn: boolean;
  login: (newToken: string, newUserId: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const INACTIVITY_LIMIT_MS = 4 * 60 * 60 * 1000;
const ACTIVITY_KEY = "lastActivityTs";
const ACTIVITY_WRITE_THROTTLE_MS = 30 * 1000;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const lastActivityWriteRef = useRef(0);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("userId"),
  );

  const login = useCallback((newToken: string, newUserId: string) => {
    const now = Date.now();
    setToken(newToken);
    setUserId(newUserId);
    localStorage.setItem("token", newToken);
    localStorage.setItem("userId", newUserId);
    localStorage.setItem(ACTIVITY_KEY, String(now));
    lastActivityWriteRef.current = now;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem(ACTIVITY_KEY);
  }, []);

  const touchActivity = useCallback(() => {
    if (!token) return;

    const now = Date.now();
    if (now - lastActivityWriteRef.current < ACTIVITY_WRITE_THROTTLE_MS) return;

    lastActivityWriteRef.current = now;
    localStorage.setItem(ACTIVITY_KEY, String(now));
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const existingTs = Number(localStorage.getItem(ACTIVITY_KEY) || 0);
    if (!existingTs) {
      const now = Date.now();
      localStorage.setItem(ACTIVITY_KEY, String(now));
      lastActivityWriteRef.current = now;
    } else {
      lastActivityWriteRef.current = existingTs;
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") touchActivity();
    };

    const activityEvents: Array<keyof WindowEventMap> = [
      "click",
      "keydown",
      "mousemove",
      "scroll",
      "touchstart",
    ];

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, touchActivity, { passive: true });
    });

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const intervalId = window.setInterval(() => {
      const lastActivityTs = Number(localStorage.getItem(ACTIVITY_KEY) || 0);
      const isExpired =
        !lastActivityTs || Date.now() - lastActivityTs > INACTIVITY_LIMIT_MS;
      if (isExpired) logout();
    }, 60 * 1000);

    return () => {
      window.clearInterval(intervalId);
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, touchActivity);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [logout, token, touchActivity]);

  const value = useMemo(
    () => ({
      token,
      userId,
      isLoggedIn: Boolean(token),
      login,
      logout,
    }),
    [login, logout, token, userId],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Auth Error");
  }
  return context;
};
