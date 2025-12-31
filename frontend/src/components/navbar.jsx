import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBars, 
  FaTimes, 
  FaHome, 
  FaUser, 
  FaArrowRight, 
  FaSignOutAlt, 
  FaTachometerAlt, 
  FaClipboardList, 
  FaChartBar,
  FaRocket,
  FaShieldAlt
} from 'react-icons/fa';
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
          { name: 'Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt /> },
          { name: 'Complaints', path: '/admin/complaints', icon: <FaClipboardList /> },
          { name: 'Analytics', path: '/admin/analytics', icon: <FaChartBar /> }
        ]
      : [
          { name: 'Home', path: '/', icon: <FaHome /> },
          { name: 'Dashboard', path: '/dashboard', icon: <FaTachometerAlt /> }
        ]
    : [
        { name: 'Home', path: '/', icon: <FaHome /> },
        { name: 'Login', path: '/login', icon: <FaUser /> },
        { name: 'Register', path: '/register', icon: <FaUser /> }
      ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 backdrop-blur-xl"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            <Link 
              to="/" 
              className="flex items-center group relative z-10"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 p-3 rounded-2xl shadow-2xl transform group-hover:shadow-pink-500/50 transition-all duration-300">
                  <FaRocket className="text-white text-2xl" />
                </div>
              </motion.div>
              <div className="ml-4">
                <motion.h1 
                  className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent group-hover:from-pink-200 group-hover:via-purple-200 group-hover:to-indigo-200 transition-all duration-300 tracking-tight"
                  whileHover={{ scale: 1.05 }}
                >
                  CodeCelix
                </motion.h1>
                <motion.p 
                  className="text-xs md:text-sm text-purple-200/80 font-medium tracking-wide"
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Smart Complaint Management
                </motion.p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden ${
                        isActive
                          ? 'text-white'
                          : 'text-purple-100 hover:text-white'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.div
                            layoutId="activeNavLink"
                            className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-xl shadow-lg shadow-pink-500/50"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                        <motion.span 
                          className={`relative z-10 flex items-center gap-2 ${
                            isActive ? 'text-white' : 'group-hover:text-white'
                          }`}
                          whileHover={{ scale: 1.05 }}
                        >
                          <span className="text-base">{link.icon}</span>
                          <span>{link.name}</span>
                        </motion.span>
                      </>
                    )}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20"
                  >
                    {isAdmin && <FaShieldAlt className="text-pink-400" />}
                    <span className="text-white/90 font-medium text-sm">
                      {isAdmin ? admin?.username : user?.name}
                    </span>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="group relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl font-semibold text-sm text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <FaSignOutAlt className="relative z-10" />
                    <span className="relative z-10">Logout</span>
                  </motion.button>
                </>
              ) : (
                <>
                  {!navLinks.some(link => link.path === '/login') && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/login"
                        className="group flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-xl font-semibold text-sm text-white border border-white/20 hover:bg-white/20 transition-all duration-300"
                      >
                        <FaUser />
                        <span>Login</span>
                      </Link>
                    </motion.div>
                  )}
                  {!navLinks.some(link => link.path === '/register') && (
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(236, 72, 153, 0.4)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/register')}
                      className="group relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-xl font-semibold text-sm text-white shadow-lg shadow-pink-500/30 overflow-hidden"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      <span className="relative z-10">Get Started</span>
                      <FaArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  )}
                </>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="lg:hidden relative p-3 text-white bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-xl border border-white/20 transition-all duration-300 z-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaTimes className="text-xl" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaBars className="text-xl" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900 via-indigo-900 to-purple-800 backdrop-blur-xl"></div>
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="relative px-6 py-6 space-y-3">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NavLink
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 py-4 px-5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-lg'
                          : 'bg-white/10 text-purple-100 hover:bg-white/20 hover:text-white border border-white/10'
                      }`
                    }
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span>{link.name}</span>
                  </NavLink>
                </motion.div>
              ))}
              {isAuthenticated ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                  className="pt-4 space-y-3 border-t border-white/20 mt-4"
                >
                  <div className="flex items-center gap-3 px-5 py-3 bg-white/10 rounded-xl border border-white/20">
                    {isAdmin && <FaShieldAlt className="text-pink-400" />}
                    <span className="text-white/90 font-medium text-sm">
                      {isAdmin ? admin?.username : user?.name}
                    </span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-4 px-5 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl font-semibold text-sm text-white shadow-lg"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                  className="pt-4 space-y-3 border-t border-white/20 mt-4"
                >
                  {!navLinks.some(link => link.path === '/login') && (
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-center gap-2 py-4 px-5 bg-white/10 rounded-xl font-semibold text-sm text-white border border-white/20 hover:bg-white/20 transition-all"
                      >
                        <FaUser />
                        <span>Login</span>
                      </Link>
                    </motion.div>
                  )}
                  {!navLinks.some(link => link.path === '/register') && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        navigate('/register');
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-4 px-5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-xl font-semibold text-sm text-white shadow-lg"
                    >
                      <span>Get Started</span>
                      <FaArrowRight />
                    </motion.button>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
