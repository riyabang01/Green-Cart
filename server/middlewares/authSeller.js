import jwt from 'jsonwebtoken'

const authSeller = async (req, res, next) => {
     try {
        const token = req.cookies?.sellerToken || req.headers.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.json({ success: false, message: "Not Authorized" });
        }

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!tokenDecode || (process.env.SELLER_EMAIL && tokenDecode.email !== process.env.SELLER_EMAIL)) {
            return res.json({ success: false, message: "Not Authorized" });
        }

        req.seller = tokenDecode; 
        next();
        
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export default authSeller;
