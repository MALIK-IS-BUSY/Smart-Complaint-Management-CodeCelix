import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaArrowRight, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const { confirmPassword, ...registerData } = formData;
    
    const cleanRegisterData = {
      name: registerData.name.trim(),
      email: registerData.email.trim(),
      password: registerData.password,
      ...(registerData.phone && registerData.phone.trim() !== '' && { phone: registerData.phone.trim() })
    };
    
    const result = await register(cleanRegisterData);
    
    if (result.success) {
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 100);
    } else {
      setError(result.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md text-white relative z-10 border border-white/20"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-center mb-8"
        >
          <div className="inline-block p-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl mb-4">
            <FaUserPlus className="text-4xl" />
          </div>
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="text-purple-200">Join us and start managing your complaints</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
            <FaUser className="mr-3 text-white/80 text-lg" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="bg-transparent w-full outline-none text-white placeholder-white/70"
              required
              disabled={loading}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
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
            <FaPhone className="mr-3 text-white/80 text-lg" />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number (Optional)"
              value={formData.phone}
              onChange={handleChange}
              className="bg-transparent w-full outline-none text-white placeholder-white/70"
              disabled={loading}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
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

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center border border-white/30 rounded-xl px-4 py-3 focus-within:border-pink-400 focus-within:bg-white/5 transition-all"
          >
            <FaLock className="mr-3 text-white/80 text-lg" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
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
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center text-sm"
        >
          <p className="text-white/70">
            Already have an account?{' '}
            <Link to="/login" className="text-pink-400 hover:text-pink-300 font-semibold transition-colors inline-flex items-center gap-1">
              Sign In
              <FaArrowRight className="text-xs" />
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
