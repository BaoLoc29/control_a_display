import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import NonAuthLayout from "./layouts/NonAuthLayout/index.jsx";
import AuthLayout from "./layouts/AuthLayout/index.jsx";
import Users from "./components/Users.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Layout from "./components/shared/Layout";
import Profile from "./components/Profile.jsx";
import { useSelector } from "react-redux";
import isObjctEmpty from "./utils/isObjectEmpty";

const App = () => {
  const user = useSelector((state) => state.users.user);
  return (
    <Routes>
      {isObjctEmpty(user) ? (
        <Route path="/" element={<NonAuthLayout />}>
          <Route path="" element={<Login />} />
        </Route>
      ) : (
        <Route path="/" element={<AuthLayout />}>
          <Route path="/" element={<Layout />}>
            <Route path="" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="my-profile" element={<Profile />} />
          </Route>
        </Route>
      )}
    </Routes>
  );
};

export default App;
