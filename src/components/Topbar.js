import React, { useState, useRef, useEffect } from "react";
import {
  Cog6ToothIcon,
  PowerIcon,
  UserIcon,
  PencilSquareIcon,
  EyeIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import user from "./assets/user.png";

const Topbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Profile");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full flex items-center justify-between bg-white shadow-sm px-6 py-4">
      <div className="text-xl font-semibold text-gray-800">Customer Dashboard</div>

      <div className="flex items-center gap-4 relative">
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 hover:ring-2 hover:ring-blue-400"
          >
            <img src={user} alt="profile" className="w-full h-full object-cover" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                  <img src={user} alt="User" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">Raveesh Kumar</h4>
                    <p className="text-xs text-gray-500">UI/UX Designer</p>
                  </div>
                </div>
                <PowerIcon className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-800" />
              </div>

              <div className="flex justify-around border-b">
                <button
                  className={`flex-1 py-2 text-sm font-medium ${
                    activeTab === "Profile" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("Profile")}
                >
                  <UserIcon className="h-4 w-4 inline-block mr-1" /> Profile
                </button>
                <button
                  className={`flex-1 py-2 text-sm font-medium ${
                    activeTab === "Settings" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("Settings")}
                >
                  <Cog6ToothIcon className="h-4 w-4 inline-block mr-1" /> Settings
                </button>
              </div>

              <div className="p-2">
                {activeTab === "Profile" ? (
                  <>
                    <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                      <PencilSquareIcon className="h-5 w-5 mr-3 text-gray-500" /> Edit Profile
                    </button>
                    <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                      <EyeIcon className="h-5 w-5 mr-3 text-gray-500" /> View Profile
                    </button>
                    <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                      <UserIcon className="h-5 w-5 mr-3 text-gray-500" /> Social Profile
                    </button>
                  </>
                ) : (
                  <>
                    <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                      <CreditCardIcon className="h-5 w-5 mr-3 text-gray-500" /> Billing
                    </button>
                    <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                      <Cog6ToothIcon className="h-5 w-5 mr-3 text-gray-500" /> Account Settings
                    </button>
                  </>
                )}
                <button className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-100 rounded-lg">
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
