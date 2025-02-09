import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PencilSquareIcon, XCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import userAvatar from "./assets/user.png";

const host = process.env.REACT_APP_host;


const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [editingField, setEditingField] = useState(null);
  const [tempValues, setTempValues] = useState({});
  const [updateStatus, setUpdateStatus] = useState({});

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
            avatar: response.data.data.avatar || "",
          });
        }
      } catch (error) {
        setError("Failed to load profile.");
        if (error.response?.status === 401) handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  const startEditing = (field, currentValue) => {
    setEditingField(field);
    setTempValues({ ...tempValues, [field]: currentValue });
    setUpdateStatus({});
  };

  const cancelEditing = () => {
    setEditingField(null);
    setTempValues({});
  };

  const handleUpdateAccount = async (field) => {
    if (!tempValues[field] || tempValues[field] === user[field]) {
      cancelEditing();
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const updateData = field === 'name' ? { fullName: tempValues[field] } : { number: tempValues[field] };
      
      const response = await axios.patch(
        `${host}/api/v1/user/update-account`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(prev => ({
        ...prev,
        [field === 'name' ? 'name' : 'number']: tempValues[field]
      }));
      
      setUpdateStatus({ [field]: { success: true, message: "Updated successfully" } });
      setTimeout(() => setUpdateStatus({}), 2000);
      cancelEditing();
    } catch (error) {
      setUpdateStatus({
        [field]: { 
          error: true, 
          message: error.response?.data?.message || "Update failed" 
        }
      });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        `${host}/api/v1/user/change-password`,
        {
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPasswordSuccess("Password changed successfully");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setPasswordError(
        error.response?.data?.message || "Failed to change password"
      );
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-6 max-w-sm bg-red-50 rounded-lg">
          <XCircleIcon className="h-12 w-12 text-red-500 mx-auto" />
          <p className="mt-4 text-red-600 font-medium">{error}</p>
          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 transition"
          >
            Return to Login
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Profile Section */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Profile</h2>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Logout
            </button>
          </div>

          <div className="flex items-center mb-8">
            <div className="relative group mr-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={userAvatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{user?.name}</h3>
              <p className="text-sm text-gray-500">{user?.role}</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Name Field */}
            <div className="pb-4 border-b border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Full Name</div>
              <div className="flex items-center justify-between">
                {editingField === 'name' ? (
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="text"
                      value={tempValues.name || ''}
                      onChange={(e) => setTempValues({...tempValues, name: e.target.value})}
                      className="flex-1 p-1 border-b border-blue-500 focus:outline-none"
                      autoFocus
                      onKeyPress={(e) => e.key === 'Enter' && handleUpdateAccount('name')}
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleUpdateAccount('name')}
                        className="text-green-600 hover:text-green-700"
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={cancelEditing}
                        className="text-red-600 hover:text-red-700"
                      >
                        <XCircleIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="text-gray-900">{user?.name}</span>
                    <button 
                      onClick={() => startEditing('name', user.name)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
              {updateStatus.name && (
                <div className={`mt-1 text-sm ${
                  updateStatus.name.error ? 'text-red-600' : 'text-green-600'
                }`}>
                  {updateStatus.name.message}
                </div>
              )}
            </div>

            {/* Phone Number Field */}
            <div className="pb-4 border-b border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Phone Number</div>
              <div className="flex items-center justify-between">
                {editingField === 'number' ? (
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="text"
                      value={tempValues.number || ''}
                      onChange={(e) => setTempValues({...tempValues, number: e.target.value})}
                      className="flex-1 p-1 border-b border-blue-500 focus:outline-none"
                      autoFocus
                      onKeyPress={(e) => e.key === 'Enter' && handleUpdateAccount('number')}
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleUpdateAccount('number')}
                        className="text-green-600 hover:text-green-700"
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={cancelEditing}
                        className="text-red-600 hover:text-red-700"
                      >
                        <XCircleIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="text-gray-900">{user?.number}</span>
                    <button 
                      onClick={() => startEditing('number', user.number)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
              {updateStatus.number && (
                <div className={`mt-1 text-sm ${
                  updateStatus.number.error ? 'text-red-600' : 'text-green-600'
                }`}>
                  {updateStatus.number.message}
                </div>
              )}
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-1">Account Type</div>
              <div className="text-gray-900">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Password Change Section */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Change Password
          </h2>

          {passwordError && (
            <div className="mb-4 text-sm text-red-600 p-3 bg-red-50 rounded border border-red-200">
              {passwordError}
            </div>
          )}

          {passwordSuccess && (
            <div className="mb-4 text-sm text-green-600 p-3 bg-green-50 rounded border border-green-200">
              {passwordSuccess}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={passwords.oldPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, oldPassword: e.target.value })
                }
                className="w-full p-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
                className="w-full p-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full p-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;