import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserModel from "../models/user.js";

const secret = 'test';

export const signin = async (req, res) => {
  const { address  } = req.body;

  try {
    const oldUser = await UserModal.findOne({ address });

    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

    // const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    // if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ walletAddress: oldUser.address }, secret, { expiresIn: "1h" });

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { email, userName, address, bio, interests } = req.body;

  try {
    console.log("Here");
    const oldUser = await UserModel.findOne({ address });
    console.log("Here");

    if (oldUser) return res.status(400).json({ message: "User already exists" });

    // const hashedPassword = await bcrypt.hash(password, 12);

    const result = await UserModel.create({ email, userName, walletAddress: address, bio, interests });

    const token = jwt.sign( { walletAddress: address }, secret, { expiresIn: "1h" } );

    console.log("Here");

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    
    console.log(error);
  }
};
