const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    dialCode: { type: Number, required: true },
    contactNo: { type: String, required: true },
    otp: { type: String, required: true },
    otpExpiresAt: { type: Date, required: true },
}, { timestamps: true });

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;
