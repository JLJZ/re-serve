import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserIcon, LockIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { useLogin } from '../hooks/useLogin';
import { useAuth, LoginType } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedType, setSelectedType] = useState<LoginType>('user'); // default to 'user'
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loginType } = useAuth();
  const { login, loading, error } = useLogin();

  const fromState = (location.state as any)?.from || '';

  // if already logged in, redirect immediately
  React.useEffect(() => {
    if(loginType === 'admin') {
        navigate('/admin/dashboard');
    } else {
        navigate('/user/dashboard');

    }


      // if(user && loginType) {
      //     if(loginType === 'admin') navigate('/admin/dashboard');

      //     else navigate('/user/dashboard');
          
      // }
    }, [user, loginType, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const loggedInUser = await login(username, password, selectedType); //has isAdmin

      //redirect based on button
      if (fromState) {
        navigate(fromState);

      } else if (selectedType === 'admin') {
        navigate('/admin/dashboard');

      } else {
        navigate('/user/dashboard');

      }
    } catch {
      // error is surfaced via hook
    }
  };
return (
    <div className="min-h-screen flex flex-col justify-center px-4">
      <div className="max-w-md mx-auto bg-white p-8 shadow rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">Sign in</h1>
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setSelectedType('admin')}
            className={`flex-1 py-2 rounded ${
              selectedType === 'admin'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Admin Login
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('user')}
            className={`flex-1 py-2 rounded ${
              selectedType === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            User Login
          </button>
        </div>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="w-full pl-8 pr-3 py-2 border rounded"
                placeholder="Username"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full pl-8 pr-3 py-2 border rounded"
                placeholder="Password"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white ${
              loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading
              ? 'Signing in...'
              : selectedType === 'admin'
              ? 'Sign in as Admin'
              : 'Sign in as User'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;