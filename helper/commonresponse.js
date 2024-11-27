const axios = require('axios');
const jwt = require('jsonwebtoken');

const sendOtp = async (mobileNumber, otp) => {
    const url = `https://2factor.in/API/V1/2372fa0e-5edd-11eb-8153-0200cd936042/SMS/+91${mobileNumber}/${otp}`;
    try {
        const response = await axios.get(url);
        if (response.data.Status !== 'Success') {
            throw new Error('Failed to send OTP');
        }
        return response.data;
    } catch (exception) {
        console.error(`ERROR received from ${url}:`, exception.message);
        throw new Error('Error sending OTP');
    }
};


const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { userId: user._id, contactNo: user.contactNo },  
        process.env.JWT_SECRET || '95bdb241e46cb7e7d3b123185a2834808e9aced340982c0c96e410d646ee2140013d8adee0f9bbb550ad46f284e5bad8bdc8e939a028b7e38823d54808a3bcc1',  // Secret key for access token
        { expiresIn: '1h' }  // Access token expires in 1 hour
    );

    const refreshToken = jwt.sign(
        { userId: user._id, contactNo: user.contactNo },  // Payload for refresh token
        process.env.JWT_SECRET || '95bdb241e46cb7e7d3b123185a2834808e9aced340982c0c96e410d646ee2140013d8adee0f9bbb550ad46f284e5bad8bdc8e939a028b7e38823d54808a3bcc1',  // Same secret key for refresh token
        { expiresIn: '7d' }  // Refresh token expires in 7 days
    );

    return { accessToken, refreshToken };
};

const verifyToken = (req, res, next) => {
    try {

        const { authorization } = req.headers;
        if (!authorization || !authorization.startsWith('Bearer ')) {
            return res.status(403).json({ message: 'Authorization token is required.' });
        }

        const token = authorization.split(' ')[1]; 
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.user = decoded; 
        next(); 

    } catch (error) {
        console.error('Authentication failed:', error);
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};



module.exports = { generateTokens, sendOtp, verifyToken };