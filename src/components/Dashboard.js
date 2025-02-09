import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import CustomerTable from "./CustomerTable";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed lg:relative inset-y-0 left-0 z-30 w-64 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } transition-transform duration-300 ease-in-out bg-white`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar with Hamburger */}
        <div className="bg-white shadow-sm">
          <Topbar>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-800"
            >
              {isSidebarOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </Topbar>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-6 mt-16 lg:mt-0">
          <div className="max-w-full overflow-x-auto">
            <CustomerTable />
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="lg:hidden fixed inset-0 z-20 bg-black/50 transition-opacity"
        ></div>
      )}
    </div>
  );
};

export default Dashboard;