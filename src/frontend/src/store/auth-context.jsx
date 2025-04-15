import { jwtDecode } from "jwt-decode";
import { useState, useEffect, useCallback, createContext } from "react";
const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    id: null,
    username: null,
  });

  // Get user data from the access token
  useEffect(() => {
    if (accessToken) {
      const payload = jwtDecode(accessToken);
      setUserData({ id: payload.user_id, username: payload.username });
    } else {
      setUserData({ id: null, username: null });
    }
  }, [accessToken]);

  // Refresh the access token
  const refresh = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8000/api/token/refresh", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }
      const data = await response.json();

      setAccessToken(data.access);

      console.log("Success at refreshing the access token: ", data);
    } catch (error) {
      console.error("Error refreshing token:", error);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Set a timer to refresh the access token at 4'50"
  useEffect(() => {
    const timer = setTimeout(
      () => {
        refresh();
        console.log("access token refreshed!");
      },
      (4 * 60 + 50) * 1000,
    );
    return () => {
      clearTimeout(timer);
    };
  }, [accessToken, refresh]);

  // Login the user
  const login = async (credentials) => {
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          "Login failed: ",
          errorData.detail || response.statusText,
        );
      }
      const data = await response.json();

      setAccessToken(data.access);

      console.log("Success: ", data);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  // Register the user
  const register = async (credentials) => {
    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          "Register failed: ",
          errorData.detail || response.statusText,
        );
      }
      const data = await response.json();

      setAccessToken(data.access);

      console.log("Success: ", data);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  // Logout the user
  const logout = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          "Logout failed: ",
          errorData.detail || response.statusText,
        );
      }
      const data = await response.json();

      setAccessToken(null);
      // setUserData({ id: null, username: null });

      console.log("Success: ", data);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  // Fetch any endpoint including the access token, try to refresh the token if error 401
  const authFetch = async (url, options = {}) => {
    // Ensure cookies are sent
    options.credentials = "include";
    // Attach the access token if available
    options.headers = {
      ...options.headers,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };

    let response = await fetch(url, options);

    // If we get a 401, try to refresh the token and retry the request
    if (response.status === 401) {
      try {
        const newAccessToken = await refresh();
        options.headers.Authorization = `Bearer ${newAccessToken}`;
        response = await fetch(url, options);
      } catch (err) {
        // If refresh fails, log out the user
        logout();
        throw err;
      }
    }

    return response;
  };

  const ctxValue = {
    accessToken,
    userData,
    login,
    register,
    logout,
    refresh,
    authFetch,
    loading,
  };

  return (
    <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
