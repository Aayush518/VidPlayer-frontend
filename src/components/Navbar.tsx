import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Video, LogOut, User, Upload, Layout, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Video className="h-6 w-6 text-blue-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text">
              VidPlayer
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                {user.role === 'ADMIN' && (
                  <div className="flex items-center space-x-4 border-r pr-4 mr-4">
                    <Link
                      to="/admin"
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                        isActive('/admin')
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Layout className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/upload"
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                        isActive('/upload')
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Upload className="h-5 w-5" />
                      <span>Upload</span>
                    </Link>
                  </div>
                )}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <User className="h-5 w-5" />
                    <span className="font-medium">{user.email}</span>
                    {user.role === 'ADMIN' && (
                      <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        <Shield className="h-3 w-3" />
                        <span>Admin</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-500 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}