import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String },
    address: { type: String },
    phone_number: { type: String },
    country: { type: String },
    dob: { type: String },
    profile_picture: { type: String },
    role: {
      type: String,
      default: 'contractor',
      lowercase: true,
      required: true,
    },
    status: { type: String, default: 'active' },
    passresetToken: { type: String },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;