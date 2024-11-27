
const User = require('../model/usermodel')

const createProfile = async (req, res) => {
  try {
    const { name, email, referralNo, store, dialCode, contactNo } = req.body; 
    const newUser = new User({ name, email, referralNo, store, dialCode, contactNo });
    const savedUser = await newUser.save();
    return res.status(201).json({ success: true, message: 'User added successfully.', data: savedUser });
    } catch (error) {
    return res.status(500).json({ success: false, message: 'Error adding user.', error: error.message });
   }
}


const getProfile = async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }
        const userProfile = {
            name: user.name,
            email: user.email,
            store: user.store ? user.store._id : null,
            referralNo: user.referralNo,
            lastActive: user.lastActive,
            lastLogin: user.lastLogin,
            createdBy: user.createdBy,
        };

        return res.status(200).json({ success: true, data: userProfile });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({ success: false, message: 'Error fetching user profile.', error: error.message});
    }
};


const updateProfile = async (req, res) => {
    try {
        const storeUserId = req.body.storeUserId;
        const { name, email } = req.body
        const updatedData = {};

        if (name) updatedData.name = name; 
        if (email) updatedData.email = email;

        const user = await User.findByIdAndUpdate(
            storeUserId, 
            { $set: updatedData }, 
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found.', isSuccess: false });
        }

        return res.status(200).json({ message: 'Profile updated successfully.', isSuccess: true });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating user profile.', isSuccess: false , error: error.message});
    }
};


module.exports = { updateProfile, getProfile, createProfile };
