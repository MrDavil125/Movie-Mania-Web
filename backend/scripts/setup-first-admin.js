const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
require('dotenv').config();

async function setupFirstAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const firstAdminEmail = process.env.FIRST_ADMIN_EMAIL;
    
    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email: firstAdminEmail });
    
    if (!existingAdmin) {
      const admin = new Admin({
        email: firstAdminEmail,
        password: 'Admin@123', // Change this on first login
        isFirstAdmin: true
      });
      
      await admin.save();
      console.log('First admin created successfully');
      console.log('Email:', firstAdminEmail);
      console.log('Password: Admin@123');
      console.log('Please change password on first login');
    } else {
      console.log('Admin already exists');
    }
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

setupFirstAdmin();
