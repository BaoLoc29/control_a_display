import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import Layout from "./components/shared/Layout";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import NonAuthLayout from "./layouts/NonAuthLayout/index.jsx";
import AuthLayout from "./layouts/AuthLayout/index.jsx";
import isObjctEmpty from "./utils/isObjectEmpty";
import Profile from "./components/Profile.jsx";
import SessionExpiredPopup from "../src/components/SessionExpiredPopup/index.jsx";
import Users from "./components/Users";

const App = () => {
  const user = useSelector((state) => state.users.user);
  const [isPopupVisible, setPopupVisible] = useState(false);

  const handlePopupClose = () => {
    setPopupVisible(false);
    window.location.href = "/";
  };

  useEffect(() => {
    const handleSessionExpired = () => {
      setPopupVisible(true);
    };
    window.addEventListener("sessionExpired", handleSessionExpired);
    return () => {
      window.removeEventListener("sessionExpired", handleSessionExpired);
    };
  }, []);
  return (
    <>
      <Toaster />
      <SessionExpiredPopup
        visible={isPopupVisible}
        onClose={handlePopupClose}
      />
      <Routes>
        {isObjctEmpty(user) ? (
          <Route path="/" element={<NonAuthLayout />}>
            <Route path="" element={<Login />} />
          </Route>
        ) : (
          <Route path="/" element={<AuthLayout />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="my-profile" element={<Profile />} />
            </Route>
          </Route>
        )}
      </Routes>
    </>
  );
};

export default App;
