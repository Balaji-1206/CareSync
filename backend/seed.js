require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const connectDB = require('./src/config/db');

// Test credentials
const testUsers = [
  {
    email: 'doctor@caresync.com',
    password: 'Doctor123',
    name: 'Dr. John Smith',
    role: 'doctor',
    phoneNumber: '+1234567890'
  },
  {
    email: 'nurse@caresync.com',
    password: 'Nurse123',
    name: 'Sarah Johnson',
    role: 'nurse',
    phoneNumber: '+0987654321'
  },
  {
    email: 'admin@caresync.com',
    password: 'Admin123',
    name: 'Admin User',
    role: 'admin',
    phoneNumber: '+1122334455'
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Drop the entire users collection to clean up any bad data
    try {
      await mongoose.connection.collection('users').drop();
      console.log('Dropped users collection');
    } catch (err) {
      console.log('No existing users collection to drop');
    }

    // Create new test users using create() instead of insertMany() 
    // to ensure pre-save hooks (password hashing) run
    const createdUsers = [];
    for (const userData of testUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    console.log('\n✅ Test users created successfully!\n');

    // Display credentials
    console.log('=== TEST ACCOUNT CREDENTIALS ===\n');
    createdUsers.forEach((user) => {
      const testUser = testUsers.find(u => u.email === user.email);
      console.log(`Role: ${user.role.toUpperCase()}`);
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${testUser.password}`);
      console.log('---');
    });

    console.log('\n✅ All test accounts are ready to use!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed Error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
