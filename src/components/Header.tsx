import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Heart, BarChart3 } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl group-hover:scale-110 transition-transform duration-200">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                EchoGuard
              </h1>
              <p className="text-xs text-gray-500">Mental Health Monitoring</p>
            </div>
          </Link>

          <nav className="flex space-x-6">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive('/') 
                  ? 'bg-blue-100 text-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Heart className="h-4 w-4" />
              <span className="font-medium">Check-in</span>
            </Link>
            <Link
              to="/dashboard"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive('/dashboard') 
                  ? 'bg-emerald-100 text-emerald-700 shadow-sm' 
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="font-medium">Dashboard</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;