const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { fullName, phone, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Mật khẩu không khớp." });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(409).json({ message: "Số điện thoại đã tồn tại!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "Đăng ký thành công!", user: newUser });
  } catch (err) {
    console.error("Đăng ký thất bại:", err);
    res.status(500).json({ message: "Đăng ký thất bại.", error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: "Số điện thoại không tồn tại." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Sai mật khẩu." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.status(200).json({
      message: "Đăng nhập thành công!",
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        phone: user.phone
      }
    });
  } catch (err) {
    console.error("Đăng nhập thất bại:", err);
    res.status(500).json({ message: "Đăng nhập thất bại.", error: err.message });
  }
};

module.exports = { registerUser, loginUser };
