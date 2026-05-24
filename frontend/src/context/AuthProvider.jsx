import { useState, useRef, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem("token")
  );

  const [user, setUser] = useState(() => {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
  });

  const logoutTimer = useRef(null);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  const resetTimer = () => {
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
    }

    logoutTimer.current = setTimeout(() => {
      logout();
    }, 30 * 60 * 1000); // 30 min inactivity
  };

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);
  };

  useEffect(() => {
    if (!token) return;

    const events = ["mousemove", "keydown", "click"];

    const activityHandler = () => resetTimer();

    events.forEach((event) =>
      window.addEventListener(event, activityHandler)
    );

    resetTimer(); // start timer on login

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, activityHandler)
      );

      if (logoutTimer.current) {
        clearTimeout(logoutTimer.current);
      }
    };
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}