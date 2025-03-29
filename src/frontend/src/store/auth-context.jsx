import { useState, createContext, useEffect, useCallback } from "react";
const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [userData, setUserData] = useState({
    id: null,
    username: null,
    email: null,
  });

  // Get the current logged in user data (id, username, email)
  const getUserData = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8000/api/me", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          "Get-User-Data failed: ",
          errorData.detail || response.statusText,
        );
      }
      const data = await response.json();

      setUserData({
        id: data.id,
        username: data.username,
        email: data.email,
      });

      console.log("Success: ", data);
    } catch (error) {
      console.log("Error: ", error);
    }
  }, [accessToken]);

  // Every time we get an access token we fetch user data
  useEffect(() => {
    if (accessToken) {
      getUserData();
    }
  }, [accessToken, setAccessToken, getUserData]);

  // Login the user
  const login = async (credentials) => {
    try {
      const response = await fetch("http://localhost:8000/login", {
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
      const response = await fetch("http://localhost:8000/register", {
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
      const response = await fetch("http://localhost:8000/logout", {
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
      setUserData(null);

      console.log("Success: ", data);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  // Refresh the access token
  const refresh = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/token/refresh", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          "Refresh token failed: ",
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
  return (
    <AuthContext.Provider
      value={{
        accessToken,
        userData,
        login,
        register,
        logout,
        refresh,
        authFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
