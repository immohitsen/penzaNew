import React, { useState, useRef, useEffect } from "react";
import {
  Cog6ToothIcon,
  PowerIcon,
  UserIcon,
  PencilSquareIcon,
  EyeIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import userAvatar from "./assets/user.png";

const Topbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Profile");
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from JWT token
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          name: decoded.fullName || 'Guest User',
          role: decoded.role || 'User',
          email: decoded.email || '',
          number: decoded.number || '',
          avatar: userAvatar // You can replace with decoded.avatar if available
        });
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

    // Click outside handler
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

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  if (!user) return null; // Or loading spinner

  return (
    <div className="w-full flex items-center justify-between bg-white shadow-sm px-6 py-4">
      <div className="text-xl font-semibold text-gray-800">Dashboard</div>

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
            <img 
              src={user.avatar} 
              alt="profile" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=random`;
              }}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                  <img 
                    src={user.avatar} 
                    alt="User" 
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=random`;
                    }}
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">{user.name}</h4>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    <p className="text-xs text-gray-500">{user.number}</p>
                  </div>
                </div>
                <PowerIcon 
                  className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-800" 
                  onClick={handleLogout}
                />
              </div>

              {/* Rest of the dropdown content remains the same */}
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
                <button 
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-100 rounded-lg"
                  onClick={handleLogout}
                >
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