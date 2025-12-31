import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';

dotenv.config();

const resetAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');

    const username = process.argv[2] || 'admin';
    const newPassword = process.argv[3] || 'admin123';

    const admin = await Admin.findOne({ username });

    if (!admin) {
      console.log(`Admin with username "${username}" not found!`);
      console.log('Create admin first using: npm run create-admin');
      process.exit(1);
    }

    admin.password = newPassword;
    await admin.save();

    console.log('Admin password reset successfully!');
    console.log('Username:', admin.username);
    console.log('New Password:', newPassword);
    console.log('\nYou can now login with these credentials.');

    process.exit(0);
  } catch (error) {
    console.error('Error resetting admin password:', error.message);
    process.exit(1);
  }
};

resetAdminPassword();

