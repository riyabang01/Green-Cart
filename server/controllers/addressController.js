import Address from "../models/Address.js";

export const addAddress = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        const { address } = req.body;
        
        await Address.create({ ...address, userId });
        return res.status(201).json({ success: true, message: 'Address Added Successfully' });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getAddress = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        const addresses = await Address.find({ userId });
        
        return res.status(200).json({ success: true, addresses });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};
