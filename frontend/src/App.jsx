import React, { useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AuthPage from "./pages/Auth";
import BookingsPage from "./pages/Bookings";
import GamesPage from "./pages/Games";
import MainNavigation from "./components/Navigation/MainNavigation";
import AuthContext from "./context/auth-context";
import "./App.css";

const App = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = (token, userId, tokenExpiration) => {
    setToken(token);
    setUserId(userId);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
  };

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ token, userId, login, logout }}>
        <MainNavigation />
        <main className="main-content">
          <Routes>
            <Route path="/games" element={<GamesPage />} />
            {!token ? (
              <>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="*" element={<Navigate to="/auth" />} />
              </>
            ) : (
              <>
                <Route path="/games" element={<GamesPage />} />
                <Route path="/bookings" element={<BookingsPage />} />
                <Route path="*" element={<Navigate to="/games" />} />
              </>
            )}
          </Routes>
        </main>
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

export default App;
