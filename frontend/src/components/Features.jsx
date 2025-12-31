import React from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaChartLine, FaShieldAlt, FaCheckCircle, FaHeadset, FaClock } from 'react-icons/fa';

const Features = () => {
  const features = [
    {
      icon: <FaPaperPlane className="text-4xl" />,
      title: 'Submit Complaints',
      description: 'Easily submit your complaints with detailed descriptions and priority levels',
      gradient: 'from-pink-500 to-purple-600'
    },
    {
      icon: <FaChartLine className="text-4xl" />,
      title: 'Track Status',
      description: 'Monitor the progress of your complaints in real-time with status updates',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      icon: <FaShieldAlt className="text-4xl" />,
      title: 'Secure & Private',
      description: 'Your data is protected with advanced security measures and encryption',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      icon: <FaCheckCircle className="text-4xl" />,
      title: 'Quick Response',
      description: 'Get timely responses from our dedicated support team',
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      icon: <FaHeadset className="text-4xl" />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support to address your concerns',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      icon: <FaClock className="text-4xl" />,
      title: 'Fast Resolution',
      description: 'Efficient complaint resolution process to get you sorted quickly',
      gradient: 'from-cyan-500 to-blue-600'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 opacity-50"></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage and track your complaints effectively
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -10 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 text-white transform group-hover:rotate-6 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;

