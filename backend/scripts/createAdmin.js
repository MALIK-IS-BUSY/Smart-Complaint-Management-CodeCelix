import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');

    const username = process.argv[2] || 'admin';
    const email = process.argv[3] || 'admin@example.com';
    const password = process.argv[4] || 'admin123';

    const adminExists = await Admin.findOne({ $or: [{ username }, { email }] });

    if (adminExists) {
      console.log('Admin already exists!');
      console.log('To reset the password, delete the admin from database first.');
      console.log('Or use different username/email.');
      process.exit(1);
    }

    const admin = await Admin.create({
      username,
      email,
      password: password,
      role: 'admin'
    });

    console.log('Admin created successfully!');
    console.log('Username:', admin.username);
    console.log('Email:', admin.email);
    console.log('Password:', password);
    console.log('Role:', admin.role);
    console.log('\nYou can now login with these credentials.');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();

