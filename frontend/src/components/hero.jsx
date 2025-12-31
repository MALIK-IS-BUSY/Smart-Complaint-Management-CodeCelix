import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView, useAnimation } from 'framer-motion';
import { FaPaperPlane, FaChartLine, FaShieldAlt, FaCheckCircle, FaArrowRight, FaRocket } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin/dashboard' : '/dashboard');
    } else {
      navigate('/register');
    }
  };

  const handleTrackStatus = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <section className="relative text-white py-20 md:py-32 flex items-center min-h-screen overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1920&q=80)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-purple-800/90 backdrop-blur-sm"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <motion.div variants={itemVariants}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="inline-block mb-6"
              >
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-4 rounded-2xl inline-block">
                  <FaRocket className="text-4xl" />
                </div>
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-300">CodeCelix</span>
              </h1>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-purple-200 max-w-2xl mx-auto leading-relaxed"
            >
              Smart Complaint Management System - Submit, Track, and Manage Your Complaints Seamlessly
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl shadow-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-2 group"
              >
                Get Started
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTrackStatus}
                className="px-8 py-4 border-2 border-white/30 rounded-xl hover:bg-white/10 transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-2"
              >
                Track Status
                <FaChartLine />
              </motion.button>
              {!isAuthenticated && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/admin/login"
                    className="px-8 py-4 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 font-semibold text-lg inline-flex items-center justify-center gap-2"
                  >
                    Admin Login
                  </Link>
                </motion.div>
              )}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            >
              {[
                { icon: <FaPaperPlane />, text: 'Quick Submit' },
                { icon: <FaChartLine />, text: 'Real-time Tracking' },
                { icon: <FaShieldAlt />, text: 'Secure Platform' },
                { icon: <FaCheckCircle />, text: 'Fast Response' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="text-3xl text-pink-400">{item.icon}</div>
                  <p className="text-sm text-purple-200">{item.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
