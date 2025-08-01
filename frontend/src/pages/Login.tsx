import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserIcon, LockIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
const Login = ({
  onLogin
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = e => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Demo login logic - in a real app this would be an API call
      if (username === 'user' && password === 'password') {
        const userData = {
          id: '1',
          name: 'John Doe',
          role: 'user',
          credits: 100
        };
        onLogin(userData);
        navigate('/user/dashboard');
      } else if (username === 'admin' && password === 'password') {
        const userData = {
          id: '2',
          name: 'Admin User',
          role: 'admin'
        };
        onLogin(userData);
        navigate('/admin/dashboard');
      } else {
        setError('Invalid username or password');
      }
    }, 1000);
  };
  return <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">
          Facility Booking System
        </h1>
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input id="username" name="username" type="text" required value={username} onChange={e => setUsername(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Enter your username" />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Enter your password" />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                    {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
            <div>
              <button type="submit" disabled={isLoading} className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Demo Accounts
                </span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-2 rounded text-xs text-center">
                <p className="font-semibold">Normal User</p>
                <p>Username: user</p>
                <p>Password: password</p>
              </div>
              <div className="bg-gray-50 p-2 rounded text-xs text-center">
                <p className="font-semibold">Admin</p>
                <p>Username: admin</p>
                <p>Password: password</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Login;