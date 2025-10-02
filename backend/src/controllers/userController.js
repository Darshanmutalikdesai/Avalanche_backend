// src/controllers/userController.js
import axios from "axios";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import { registerUserService, verifyOTPService } from "../services/userService.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, recaptchaToken } = req.body;

    if (!name || !email || !password || !recaptchaToken) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // ✅ Verify reCAPTCHA
    // const recaptchaResponse = await axios.post(
    //   `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
    // );

    // if (!recaptchaResponse.data.success) {
    //   return res.status(400).json({ message: "Captcha verification failed." });
    // }

    // ✅ Generate OTP
    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // ✅ Call service layer
    await registerUserService({ name, email, password, otp });

    // ✅ Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL || "aavalanche2025@gmail.com",
        pass: process.env.EMAIL_PASS || "ikjkunquknkqrxnm",
      },
    });

    const mailOptions = {
      from: `"Avalanche" <${process.env.EMAIL||"aavalanche2025@gmail.com"}>`,
      to: email,
      subject: "Your OTP Verification Code",
      text: `Hi ${name},\n\nYour OTP code is: ${otp}\nIt will expire in 5 minutes.\n\nBest,\nAvalanche Team`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: "OTP sent to email. Please verify to complete registration.",
    });
  } catch (error) {
    console.error("Error in registerUser:", error.message);
    return res.status(500).json({ message: error.message || "Server error." });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const user = await verifyOTPService(email, otp);

    return res.status(200).json({
      message: "User verified successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Error in verifyOTP:", error.message);
    return res.status(400).json({ message: error.message });
  }
};
