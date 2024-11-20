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
import Users from "./components/Users";
import Roles from "./components/Roles.jsx";
import ArticleCategory from "./components/ArticleCategory.jsx";
import SessionExpiredPopup from "./components/Auth/SessionExpiredPopup/index.jsx";
import EditArticleCategory from "./components/Blog/EditArticleCategory/index.jsx";
import CreateArticleCategory from "./components/Blog/CreateArticleCategory/index.jsx";
import Menus from "./components/Menus.jsx";
import Permissions from "./components/Permissions.jsx";

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
            <Route index element={<Login />} />
          </Route>
        ) : (
          <Route path="/" element={<AuthLayout />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="my-profile" element={<Profile />} />
              <Route path="roles" element={<Roles />} />
              <Route path="permissions" element={<Permissions />} />
              <Route path="menus" element={<Menus />} />
              <Route path="article-category" element={<ArticleCategory />} />
              <Route
                path="article-category/edit/:articleCategoryId"
                element={<EditArticleCategory />}
              />
              <Route
                path="article-category/create"
                element={<CreateArticleCategory />}
              />
            </Route>
          </Route>
        )}
      </Routes>
    </>
  );
};

export default App;
