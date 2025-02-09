import React, { useState, useRef, useEffect } from "react";
import { UserIcon, PowerIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import userAvatar from "./assets/user.png";


//env variable
const host = process.env.REACT_APP_host;
console.log("Host:", host);

const Topbar = ({children}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(`${host}/api/v1/user/current-user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setUser({
            name: response.data.data.fullName,
            role: response.data.data.role,
            number: response.data.data.number,
            avatar: userAvatar,
          });
        }
      } catch (error) {
        if (error.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();

    // Click outside handler
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [navigate]);

  const handleLogout = async () => {
    try {
      // Call your logout API endpoint.
      await axios.post(
        `${host}/api/v1/user/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error logging out:", error);
      // Optionally handle error (for example, show a notification)
    } finally {
      // Remove tokens and clear user data regardless of the API call result.
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      navigate("/login");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white shadow-sm px-6 py-4 text-gray-600">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="w-full flex items-center justify-between bg-white shadow-sm px-4 lg:px-6 py-4">
      {children}
      {/* Dashboard Title */}
      <div className="text-xl font-semibold text-gray-800">Dashboard</div>

      <div className="flex items-center gap-4">
        {/* Profile Section */}
        <div className="flex items-center gap-2">
          <div className="relative" ref={dropdownRef}>
            {/* Profile Button */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 hover:ring-2 hover:ring-blue-400 transition duration-150 ease-in-out"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <img
                src={user.avatar}
                alt="User Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=random`;
                }}
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 z-10 mt-2 w-60 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {/* Profile Header */}
                <div className="p-4 flex items-center gap-3 border-b bg-gray-50">
                  <img
                    src={user.avatar}
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full border border-gray-300 object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      {user.name} <CheckBadgeIcon className="w-4 h-4 text-blue-500" />
                    </p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                    {/* <p className="text-xs text-gray-500">{user.number}</p> */}
                  </div>
                </div>

                {/* Menu Items */}
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full text-left flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <UserIcon className="w-5 h-5 mr-2" />
                  Profile
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center px-4 py-3 text-sm text-red-600 hover:bg-gray-100 rounded-b-xl"
                >
                  <PowerIcon className="w-5 h-5 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;