import User from "../models/User.js";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";


// REGISTER USER
export const registerUser = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
    } = req.body;

    // CHECK USER EXISTS
    const userExists =
      await User.findOne({ email });

    if (userExists) {

      return res.status(400).json({
        message: "User already exists",
      });

    }

    // HASH PASSWORD
    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(password, salt);

    // CREATE USER
    const user = await User.create({

      name,

      email,

      password: hashedPassword,

      avatar:
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,

      bio: "Study enthusiast 🚀",

    });

    // TOKEN
    const token = jwt.sign(

      { id: user._id },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }

    );

    // RESPONSE
    res.status(201).json({

      _id: user._id,

      name: user.name,

      email: user.email,

      avatar: user.avatar,

      bio: user.bio,

      token,

    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


// LOGIN USER
export const loginUser = async (req, res) => {

  try {

    const {
      email,
      password,
    } = req.body;

    // FIND USER
    const user =
      await User.findOne({ email });

    if (!user) {

      return res.status(400).json({
        message:
          "Invalid email or password",
      });

    }

    // CHECK PASSWORD
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      return res.status(400).json({
        message:
          "Invalid email or password",
      });

    }

    // TOKEN
    const token = jwt.sign(

      { id: user._id },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }

    );

    // RESPONSE
    res.status(200).json({

      _id: user._id,

      name: user.name,

      email: user.email,

      avatar: user.avatar,

      bio: user.bio,

      token,

    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};