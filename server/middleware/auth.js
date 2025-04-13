// routes/auth.js
const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");


// đăng kí 
router.post("/register", async (req, res) => {
    try {
      console.log("Received data:", req.body); // 👉 để debug xem dữ liệu nhận được
  
      const { fullName, phone, password } = req.body;
  
      const newUser = new User({
        fullName,
        phone,
        password,
      });
  
      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
  
    } catch (err) {
      console.error("Đăng ký thất bại:", err);
      res.status(500).json({ message: "Registration failed", error: err.message });
    }
  });
  

// Đăng nhập
router.post("/login", loginUser);



module.exports = router;
