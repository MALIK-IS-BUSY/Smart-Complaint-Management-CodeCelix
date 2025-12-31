import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaArrowRight, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md text-white relative z-10 border border-white/20"
      >

        {/* 🔥 NO ANIMATION HERE */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl mb-4">
            <FaShieldAlt className="text-4xl" />
          </div>
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-purple-200">
            Sign in to continue to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
            >
              <span className="text-red-400">⚠</span>
              {error}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center border border-white/30 rounded-xl px-4 py-3 focus-within:border-pink-400 focus-within:bg-white/5 transition-all"
          >
            <FaEnvelope className="mr-3 text-white/80 text-lg" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="bg-transparent w-full outline-none text-white placeholder-white/70"
              required
              disabled={loading}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center border border-white/30 rounded-xl px-4 py-3 focus-within:border-pink-400 focus-within:bg-white/5 transition-all"
          >
            <FaLock className="mr-3 text-white/80 text-lg" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="bg-transparent w-full outline-none text-white placeholder-white/70"
              required
              disabled={loading}
            />
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl font-semibold shadow-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300 mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Logging in...
              </>
            ) : (
              <>
                Sign In
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 space-y-3 text-center text-sm"
        >
          <p className="text-white/70">
            Don't have an account?{' '}
            <Link to="/register" className="text-pink-400 hover:text-pink-300 font-semibold">
              Register Now
            </Link>
          </p>
          <p className="text-white/70">
            Admin?{' '}
            <Link to="/admin/login" className="text-purple-400 hover:text-purple-300 font-semibold">
              Admin Login
            </Link>
          </p>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default Login;
