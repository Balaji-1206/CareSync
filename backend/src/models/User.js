const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password by default
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  role: {
    type: String,
    enum: ['doctor', 'nurse', 'admin'],
    required: [true, 'Role is required']
  },
  avatar: {
    type: String,
    default: null
  },
  phoneNumber: {
    type: String,
    default: null
  },
  dateOfBirth: {
    type: Date,
    default: null
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  // OAuth fields
  googleId: {
    type: String,
    default: null,
    sparse: true,
    unique: true
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  // Security fields
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: null
  },
  passwordResetToken: {
    type: String,
    default: null
  },
  passwordResetExpires: {
    type: Date,
    default: null
  },
  emailVerificationToken: {
    type: String,
    default: null
  },
  emailVerificationExpires: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Hash password before saving (only for local auth)
userSchema.pre('save', async function() {
  // Only hash password if it's modified and exists
  if (!this.isModified('password') || !this.password) {
    return;
  }
  
  const salt = await bcrypt.genSalt(12); // Using 12 rounds for security
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without sensitive data)
userSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    email: this.email,
    name: this.name,
    role: this.role,
    avatar: this.avatar,
    phoneNumber: this.phoneNumber,
    dateOfBirth: this.dateOfBirth,
    address: this.address,
    isEmailVerified: this.isEmailVerified,
    authProvider: this.authProvider,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('User', userSchema);
