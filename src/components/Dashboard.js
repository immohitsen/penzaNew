// Dashboard.js
import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import CustomerTable from "./CustomerTable";

const Dashboard = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <div className="p-6 bg-gray-100 flex-1">
          <CustomerTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
