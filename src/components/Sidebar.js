import React from "react";
import {
  HomeIcon,
  UsersIcon,
  Cog6ToothIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", icon: <HomeIcon className="h-6 w-6" />, active: true },
    {
      name: "Customers",
      icon: <UsersIcon className="h-6 w-6" />,
      active: false,
    },
    {
      name: "Settings",
      icon: <Cog6ToothIcon className="h-6 w-6" />,
      active: false,
    },
    {
      name: "Notifications",
      icon: <BellIcon className="h-6 w-6" />,
      active: false,
    },
  ];

  return (
    <div className="h-full flex flex-col bg-white text-gray-900 shadow-md border-r border-gray-300 w-64">
      {/* Header */}
      <div className="p-6 border-b border-gray-300">
        <span className="text-xl font-bold">Penza</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-6">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition ${
              item.active
                ? "bg-blue-100 text-blue-600 font-semibold"
                : "hover:bg-gray-200"
            }`}
          >
            {item.icon}
            <span className="text-sm">{item.name}</span>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-300 text-center text-sm text-gray-600">
        © 2025 Penza
      </div>
    </div>
  );
};

export default Sidebar;