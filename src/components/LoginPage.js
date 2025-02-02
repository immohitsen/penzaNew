import React, { useState } from 'react';
import { UserIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm"
        style={{ backgroundImage: 'url(https://via.placeholder.com/1500)' }}
      ></div>

      <div className="relative z-10 flex justify-center items-center min-h-screen bg-white bg-opacity-70">
        {/* Company Name (Penza) */}
        <div className="absolute top-8 left-8 text-3xl font-bold text-gray-800">
          Penza
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Login</h2>
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-2">
                Email Address
              </label>
              <div className="flex items-center border-2 rounded-md border-gray-300">
                <UserIcon className="h-5 w-5 text-gray-500 ml-3" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full p-2 pl-10 text-sm border-none focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-2">
                Password
              </label>
              <div className="flex items-center border-2 rounded-md border-gray-300">
                <LockClosedIcon className="h-5 w-5 text-gray-500 ml-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full p-2 pl-10 text-sm border-none focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="mr-3"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md text-sm font-semibold hover:bg-blue-600 transition duration-200"
            >
              Login
            </button>
          </form>

          {/* Don't Have an Account Link */}
          <div className="mt-4 text-center text-sm text-gray-600">
            <span>Don't have an account? </span>
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
