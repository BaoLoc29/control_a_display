import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import NonAuthLayout from "./layouts/NonAuthLayout/index.jsx";
import AuthLayout from "./layouts/AuthLayout/index.jsx";
import Employee from "./components/Employee.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Layout from "./components/shared/Layout";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<NonAuthLayout />}>
          <Route index element={<Login />} />
        </Route>
        <Route path="/" element={<AuthLayout />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="employees" element={<Employee />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
