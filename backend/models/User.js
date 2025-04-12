const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    unique: true,
    match: [
      /^\d{10}$/,
      'Please add a valid 10-digit phone number',
    ],
  },
  role: {
    type: String,
    enum: ['user', 'landlord', 'admin'],
    default: 'user',
  },
  verified: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: String,
    default: '',
  },
  otp: {
    type: String,
    required: false,
    match: [/^\d{6}$/, 'OTP must be a 6-digit number'],
  },
  currentRooms: [{
    listingId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Listing',
      required: true
    },
    listingName: {
      type: String,
      required: true
    },
    floorId: {
      type: String,
      required: true
    },
    floorNumber: {
      type: Number,
      required: true
    },
    roomId: {
      type: String,
      required: true
    },
    roomNumber: {
      type: Number,
      required: true
    },
    assignedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    assignedAt: {
      type: Date,
      default: Date.now
    },
    sharingType: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: true
    }
  }],
  verificationToken: String,
  verificationTokenExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Middleware to sync tenant changes with listings
UserSchema.pre('save', async function(next) {
  if (this.isModified('currentRooms')) {
    const Listing = require('./Listing'); // Require here to avoid circular dependency
    
    // Get all listings that need updating
    const listingIds = this.currentRooms
      .filter(room => room.active)
      .map(room => room.listingId);
    
    // Update each listing
    for (const listingId of listingIds) {
      const listing = await Listing.findById(listingId);
      if (listing) {
        // Find the room in the listing
        const currentRoom = this.currentRooms.find(
          room => room.listingId.toString() === listingId.toString() && room.active
        );
        
        if (currentRoom) {
          // Update or add tenant to the room
          listing.floors = listing.floors.map(floor => {
            if (floor.floorId === currentRoom.floorId) {
              floor.rooms = floor.rooms.map(room => {
                if (room.roomId === currentRoom.roomId) {
                  // Update tenant information
                  const existingTenantIndex = room.tenants?.findIndex(
                    t => t.userId.toString() === this._id.toString()
                  );
                  
                  if (existingTenantIndex === -1) {
                    // Add new tenant
                    if (!room.tenants) room.tenants = [];
                    room.tenants.push({
                      userId: this._id,
                      name: this.name,
                      phone: this.phone,
                      assignedAt: currentRoom.assignedAt
                    });
                  } else {
                    // Update existing tenant
                    room.tenants[existingTenantIndex] = {
                      userId: this._id,
                      name: this.name,
                      phone: this.phone,
                      assignedAt: currentRoom.assignedAt
                    };
                  }
                }
                return room;
              });
            }
            return floor;
          });
          
          await listing.save();
        }
      }
    }
    
    // Remove tenant from listings they're no longer in
    const inactiveListingIds = this.currentRooms
      .filter(room => !room.active)
      .map(room => room.listingId);
    
    for (const listingId of inactiveListingIds) {
      const listing = await Listing.findById(listingId);
      if (listing) {
        listing.floors = listing.floors.map(floor => {
          floor.rooms = floor.rooms.map(room => {
            if (room.tenants) {
              room.tenants = room.tenants.filter(
                tenant => tenant.userId.toString() !== this._id.toString()
              );
            }
            return room;
          });
          return floor;
        });
        
        await listing.save();
      }
    }
  }
  
  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash verification token
UserSchema.methods.generateVerificationToken = function () {
  // Generate token
  const verificationToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to verificationToken field
  this.verificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  // Set expire
  this.verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  return verificationToken;
};

// Generate and hash password token
UserSchema.methods.generateResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};


module.exports = mongoose.model('User', UserSchema); 