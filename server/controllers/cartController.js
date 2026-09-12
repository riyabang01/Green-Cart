import User from "../models/User.js";

export const updateCart = async(req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        const { cartItems } = req.body;
        
        await User.findByIdAndUpdate(userId, { cartItems });
        return res.status(200).json({ success: true, message: 'Cart Updated' });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};
