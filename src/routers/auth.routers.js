import express from "express";

const router = express.Router();

router.get("/login", (req, res) => {
  res.json({ message: "Login route" });
});

export default router;
