const User = require('../model/usermodel');
const { sendOtp }= require('../helper/commonresponse')
const OTP = require('../model/otpmodel');
const Store  = require ('../model/storemodel')
const { generateTokens } = require('../helper/commonresponse')

const generateOTP = async (req, res) => {
    try {
        const { dialCode, contactNo } = req.body;
        if (!dialCode || !contactNo) {
            return res.status(400).json({ message: 'dialCode and contactNo are required.' });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
        const newOTP = await OTP.create({ dialCode, contactNo, otp, otpExpiresAt });
        await sendOtp(contactNo, otp);
        res.status(200).json({ message: `OTP sent successfully to ${dialCode}-${contactNo}.` });

    } catch (error) {
        console.error('Error generating OTP:', error);
        res.status(500).json({ message: 'Failed to generate OTP.', error: error.message});
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { dialCode, contactNo, otp, type } = req.body;
        const { device } = req.headers; 

        if (!dialCode || !contactNo || !otp) {
            return res.status(400).json({ message: 'DialCode, contactNo, and otp are required.' });
        }
        const otpRecord = await OTP.findOne({ dialCode, contactNo, otp });
        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid OTP or OTP expired.' });
        }

    
        if (new Date() > otpRecord.otpExpiresAt) {
            return res.status(400).json({ message: 'OTP has expired.' });
        }
        const user = await User.findOne({ contactNo });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const { accessToken, refreshToken } = generateTokens(user);

        return res.status(200).json({
            dialCode,
            contactNo,
            token: accessToken,
            refreshToken,
            isOrganizationUser: user.isOrganizationUser,
            stores: user.store || []
        });

    } catch (error) {
        console.error('Error during OTP verification and login:', error);
        return res.status(500).json({ message: 'Failed to verify OTP or log in.', error: error.message });
    }
};


const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.header('refresh-token');

        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required.' });
        }
        jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired refresh token.' });
            }
            const user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

            return res.status(200).json({ authToken: accessToken, refreshToken: newRefreshToken });
        });
    } catch (error) {
        console.error('Error refreshing token:', error);
        return res.status(500).json({ message: 'Failed to refresh token.', error: error.message });
    }
};






module.exports = { generateOTP, refreshToken, verifyOtp };



