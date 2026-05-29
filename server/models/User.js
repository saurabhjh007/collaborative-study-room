import mongoose from "mongoose";

const userSchema = new mongoose.Schema(

  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,

      default:
        "https://i.pravatar.cc/150?img=3",
    },

    bio: {
      type: String,

      default:
        "Study enthusiast 🚀",
    },
  },

  {
    timestamps: true,
  }

);

const User = mongoose.model(
  "User",
  userSchema
);

export default User;