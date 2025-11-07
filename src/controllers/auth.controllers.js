import ModelUser from "../models/user.models.js";
import { generateToken, hashPassword } from "../services/auth.services.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await hashPassword(password);
  const user = ModelUser(username, email, hashedPassword);
  try {
    await user.save();
    const token = generateToken(user);
    res.status(201).json({ user, token });
  } catch (error) {
    console.log("An error occurred during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await ModelUser.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);
    req.user = user; // Attach user to request object
    res.status(200).json({ user, token });
  } catch (error) {
    console.log("An error occurred during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await ModelUser.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some error occured" });
  }
};

export const logout = (req, res) => {
  // Since JWTs are stateless, logout can be handled on the client side by deleting the token.
};
