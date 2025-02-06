import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { jwtDecode } from 'jwt-decode';

const LoginPage = () => {
  const [number, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://penza-api.onrender.com/api/v1/user/login', {
        number,
        password,
      });
      console.log(response);

      if (response.data.success) {
        const accessToken = response.data.data.accessToken;
        const refreshToken = response.data.data.refreshToken;

        const deCoded = jwtDecode(accessToken);
        console.log('DECODED TOKEN:', deCoded);
        
        // Store tokens
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        // Check user role
        const decoded = jwtDecode(accessToken);
        
        // Redirect based on role
        if (decoded.role === 'Admin') {
          navigate('/');
        } else {
          navigate('/');
        }

      } else {
        setErrorMessage('Invalid details. Please try again.');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  // Keep the return statement exactly the same
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Login</h2>
        {errorMessage && <div className="text-red-500 text-sm mb-4">{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="number" className="block text-sm text-gray-600 mb-2">Mobile Number</label>
            <input
              type="tel"
              id="number"
              placeholder="Enter your mobile number"
              className="w-full p-2 text-sm border rounded-md"
              value={number}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm text-gray-600 mb-2">Password</label>
            <div className="flex items-center border rounded-md p-2">
              <LockClosedIcon className="h-5 w-5 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter your password"
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
            Login
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          <span>Don't have an account? </span>
          <a href="/signup" className="text-blue-500">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;