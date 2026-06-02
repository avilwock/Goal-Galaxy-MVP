import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
const { Schema, model } = mongoose


const userSchema = new Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength:20,
        validate: {
            validator: function(value) {
                return /^[a-zA-Z0-9]+$/.test(value);
            },
            message: 'Invalid username format'
        }
    },
    name: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(value) {
                return /^[a-zA-Z\s-]+$/.test(value);
            },
            message: 'Name must contain only letters, spaces, and hyphens'
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: 'Invalid Email Format'
        }
    },
    password: {
        type:String,
        required: true,
        minlength: 8,
        select: false
    },
    photo: {
        type: String,
        default: ""
    },
    goals: [{
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Goal'
    }]
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('password')) {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
});

// Compare the incoming password with the hashed password
userSchema.methods.isCorrectPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

export const User = model('User', userSchema);
