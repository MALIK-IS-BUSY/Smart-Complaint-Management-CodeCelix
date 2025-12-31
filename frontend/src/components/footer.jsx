import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 text-purple-100 backdrop-blur-md shadow-inner relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-pink-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
      </div>
      <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-10 relative z-10">
        
        {/* Brand Section */}
        <div className="flex flex-col">
          <div className="flex items-center mb-3">
            <div className="h-10 w-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">CodeCelix</h1>
              <span className="text-sm text-purple-200">Smart Feedback System</span>
            </div>
          </div>
          <p className="text-sm text-purple-200 max-w-xs">
            Providing a seamless complaint and feedback system for better communication and support.
          </p>
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col"
        >
          <h2 className="font-semibold text-white mb-3">Quick Links</h2>
          <div className="flex flex-col space-y-2">
            {[
              { to: '/', label: 'Home' },
              { to: '/login', label: 'Login' },
              { to: '/register', label: 'Register' },
              { to: '/admin/login', label: 'Admin Login' }
            ].map((link, index) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={link.to} className="hover:text-pink-400 transition-colors inline-block">
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Social Media */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col"
        >
          <h2 className="font-semibold text-white mb-3">Follow Us</h2>
          <div className="flex space-x-4">
            {[
              { icon: <FaFacebookF />, href: '#' },
              { icon: <FaTwitter />, href: '#' },
              { icon: <FaInstagram />, href: '#' },
              { icon: <FaLinkedinIn />, href: '#' }
            ].map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-white/10 rounded-xl hover:bg-pink-500 transition-colors"
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom */}
      <div className="border-t border-purple-700/50 mt-10 pt-5 text-center text-sm text-purple-300">
        &copy; {new Date().getFullYear()} CodeCelix. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
