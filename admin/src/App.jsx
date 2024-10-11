import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import NonAuthLayout from "./layouts/NonAuthLayout/index.jsx";
import AuthLayout from "./layouts/AuthLayout/index.jsx";
import Users from "./components/Users.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Layout from "./components/shared/Layout";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<NonAuthLayout />}>
        <Route path="" element={<Login />} />
      </Route>
      <Route path="/" element={<AuthLayout />}>
        <Route path="" element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
