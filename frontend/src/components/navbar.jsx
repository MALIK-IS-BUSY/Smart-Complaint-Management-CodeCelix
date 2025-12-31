import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaHome, FaUser, FaArrowRight, FaSignOutAlt, FaTachometerAlt, FaClipboardList, FaChartBar } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navLinks = isAuthenticated
    ? isAdmin
      ? [
          { name: 'Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt className="mr-2" /> },
          { name: 'Complaints', path: '/admin/complaints', icon: <FaClipboardList className="mr-2" /> },
          { name: 'Analytics', path: '/admin/analytics', icon: <FaChartBar className="mr-2" /> }
        ]
      : [
          { name: 'Home', path: '/', icon: <FaHome className="mr-2" /> },
          { name: 'Dashboard', path: '/dashboard', icon: <FaTachometerAlt className="mr-2" /> }
        ]
    : [
        { name: 'Home', path: '/', icon: <FaHome className="mr-2" /> },
        { name: 'Login', path: '/login', icon: <FaUser className="mr-2" /> },
        { name: 'Register', path: '/register', icon: <FaUser className="mr-2" /> }
      ];

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 shadow-lg backdrop-blur-md">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex flex-col group">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white group-hover:text-pink-300 transition duration-300">CodeCelix</h1>
              <span className="text-xs text-purple-200">Smart Feedback System</span>
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center space-x-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center px-5 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-md ${
                  isActive 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-105' 
                    : 'bg-white/10 text-purple-100 hover:bg-white/20 hover:text-pink-200 backdrop-blur-sm'
                }`
              }
            >
              {link.icon}
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-white/80 text-sm">
                {isAdmin ? admin?.username : user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="group flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-white/20"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </>
          ) : (
            <>
              {!navLinks.some(link => link.path === '/login') && (
                <Link
                  to="/login"
                  className="group flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-white/20"
                >
                  <FaUser className="mr-2" />
                  Login
                </Link>
              )}
              {!navLinks.some(link => link.path === '/register') && (
                <Link
                  to="/register"
                  className="group flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-white/20"
                >
                  Register
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </>
          )}
        </div>

        <button
          className="lg:hidden p-3 text-white bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md transition-all duration-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-gradient-to-b from-purple-900 via-indigo-900 to-purple-800 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col space-y-3 px-6 py-5">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center py-4 px-5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg' 
                      : 'bg-white/10 text-purple-100 hover:bg-white/20 hover:text-pink-200'
                  }`
                }
              >
                {link.icon}
                {link.name}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <div className="pt-4 space-y-3 border-t border-purple-700/50 mt-2">
                <div className="text-white/80 text-sm px-4 py-2">
                  {isAdmin ? admin?.username : user?.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-full py-3 px-4 text-center text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 space-y-3 border-t border-purple-700/50 mt-2">
                {!navLinks.some(link => link.path === '/login') && (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center py-3 px-4 text-center text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
                  >
                    <FaUser className="mr-2" />
                    Login
                  </Link>
                )}
                {!navLinks.some(link => link.path === '/register') && (
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center py-3 px-4 text-center text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-300 shadow-lg"
                  >
                    Register
                    <FaArrowRight className="ml-2" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
