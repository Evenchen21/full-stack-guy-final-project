// src/context/AuthContext.tsx
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

// Shape of the values exposed to any component that uses this context //
interface AuthContextValue {
  token: string | null;
  userId: string | null;
  isLoggedIn: boolean;
  login: (newToken: string, newUserId: string) => void;
  logout: () => void;
}

// Accepts any child components that need access to auth state //
interface AuthProviderProps {
  children: ReactNode;
}

// Create the context with no default value; will be populated by AuthProvider //
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Log the user out after 4 hours of inactivity //
const INACTIVITY_LIMIT_MS = 4 * 60 * 60 * 1000;
// Key used to store the last activity timestamp in localStorage //
const ACTIVITY_KEY = "lastActivityTs";
// Only update the timestamp in localStorage at most once every 30 seconds to avoid excessive writes //
const ACTIVITY_WRITE_THROTTLE_MS = 30 * 1000;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Tracks the last time we wrote to localStorage, without triggering re-renders //
  const lastActivityWriteRef = useRef(0);
  // Initialize token and userId from localStorage so the session survives a page refresh //
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("userId"),
  );

  // Save token and userId to state and localStorage, and record login time as first activity //
  const login = useCallback((newToken: string, newUserId: string) => {
    const now = Date.now();
    setToken(newToken);
    setUserId(newUserId);
    localStorage.setItem("token", newToken);
    localStorage.setItem("userId", newUserId);
    localStorage.setItem(ACTIVITY_KEY, String(now));
    lastActivityWriteRef.current = now;
  }, []);

  // Clear all auth data from state and localStorage //
  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem(ACTIVITY_KEY);
  }, []);

  // Called on user interaction — updates the last activity timestamp (throttled) //
  const touchActivity = useCallback(() => {
    if (!token) return;

    const now = Date.now();
    if (now - lastActivityWriteRef.current < ACTIVITY_WRITE_THROTTLE_MS) return;

    lastActivityWriteRef.current = now;
    localStorage.setItem(ACTIVITY_KEY, String(now));
  }, [token]);

  // Set up inactivity tracking while the user is logged in //
  useEffect(() => {
    if (!token) return;

    // Restore existing timestamp or start fresh //
    const existingTs = Number(localStorage.getItem(ACTIVITY_KEY) || 0);
    if (!existingTs) {
      const now = Date.now();
      localStorage.setItem(ACTIVITY_KEY, String(now));
      lastActivityWriteRef.current = now;
    } else {
      lastActivityWriteRef.current = existingTs;
    }

    // Also count returning to the tab as activity //
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") touchActivity();
    };

    // List of events that count as user activity //
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

    // Check every minute whether the session has expired and log out if so //
    const intervalId = window.setInterval(() => {
      const lastActivityTs = Number(localStorage.getItem(ACTIVITY_KEY) || 0);
      const isExpired =
        !lastActivityTs || Date.now() - lastActivityTs > INACTIVITY_LIMIT_MS;
      if (isExpired) logout();
    }, 60 * 1000);

    // Clean up listeners and the interval when the user logs out or the component unmounts //
    return () => {
      window.clearInterval(intervalId);
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, touchActivity);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [logout, token, touchActivity]);

  // Build the context value; memoized so consumers only re-render when something actually changes //
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

// Custom hook — call this in any component to access auth state and actions //
export const useAuth = () => {
  const context = useContext(AuthContext);
  // Throws if used outside of AuthProvider //
  if (!context) {
    throw new Error("Auth Error");
  }
  return context;
};
