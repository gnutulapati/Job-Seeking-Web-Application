import React, { createContext, useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.jsx";

export const Context = createContext({
  isAuthorized: false,
});

const AppWrapper = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState({});
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to 'light'
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    // Save theme to localStorage whenever it changes
    localStorage.setItem("theme", theme);
    // Apply theme to document root
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <Context.Provider
      value={{
        isAuthorized,
        setIsAuthorized,
        user,
        setUser,
        theme,
        setTheme,
      }}
    >
      <App />
    </Context.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
