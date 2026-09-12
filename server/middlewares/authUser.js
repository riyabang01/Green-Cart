import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
    if (req.path === '/logout' || req.url.includes('/logout')) {
        return next();
    }

    const token = req.cookies ? req.cookies.token : null;
    
    if (!token) {
        return res.json({ success: false, message: 'Not Authorized' });
    }
    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
        if (tokenDecode.id) {
            req.body = req.body || {}; 
            req.body.userId = tokenDecode.id;
        } else {
            return res.json({ success: false, message: 'Not Authorized' });
        }
        next();
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export default authUser
