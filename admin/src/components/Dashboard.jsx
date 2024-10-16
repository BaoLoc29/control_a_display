import React from "react";
import { Breadcrumb } from 'antd';

const Dashboard = () => {
  return (
    <div>
      <Breadcrumb
        className="mb-5"
        items={[
          {
            title: "Home",
          },
          {
            title: "User",
          },
          {
            title: "Profile",
          },
        ]}
      />
    </div>
  );
};

export default Dashboard;
