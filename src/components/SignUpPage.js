import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, PhoneIcon } from '@heroicons/react/24/outline';

const SignupPage = () => {
  const [fullName, setFullName] = useState('');
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://penza-api.onrender.com/api/v1/user/register', {
        fullName,
        number,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json", // Specify that the request body is in JSON format
        },
        withCredentials: true, // This ensures that cookies are included in the request
      }
    );
      console.log(response);

      if (response.data.success) {
        navigate('/login');
      } else {
        setErrorMessage(response.data.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Sign Up</h2>
        {errorMessage && <div className="text-red-500 text-sm mb-4">{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">Full Name</label>
            <div className="flex items-center border rounded-md p-2">
              <UserIcon className="h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full outline-none pl-2"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">Phone Number</label>
            <div className="flex items-center border rounded-md p-2">
              <PhoneIcon className="h-5 w-5 text-gray-500" />
              <input
                type="tel"
                placeholder="Enter your phone number"
                className="w-full outline-none pl-2"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2">Password</label>
            <div className="flex items-center border rounded-md p-2">
              <LockClosedIcon className="h-5 w-5 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                className="w-full outline-none pl-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
              </button>
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          <span>Already have an account? </span>
          <a href="/login" className="text-blue-500">Login</a>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
