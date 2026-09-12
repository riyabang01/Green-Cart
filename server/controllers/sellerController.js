import jwt from 'jsonwebtoken';

export const sellerLogin = async (req, res) => {
   try {
        const { email, password } = req.body;

        if (password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.cookie('sellerToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            return res.status(200).json({ success: true, message: 'Logged In', token });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid Credentials' });
        }
   } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
   }
};

export const isSellerAuth = async (req, res) => {
    try {
        const token = req.cookies?.sellerToken || req.headers.token;

        if (!token) {
            return res.status(401).json({ success: false, message: "Not Authorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded) {
            return res.status(200).json({ success: true });
        }

        return res.status(401).json({ success: false, message: "Invalid Session" });
    } catch (error) {
        return res.status(401).json({ success: false, message: error.message });
    }
};

export const sellerLogout = async (req, res) => {
    try {
        res.clearCookie('sellerToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.status(200).json({ success: true, message: "Logged Out" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
