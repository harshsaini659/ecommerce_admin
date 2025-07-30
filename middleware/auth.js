const {verifyToken} = require('../utils/jwt')
const AdminUser = require('../models/AdminUser')

exports.isLoggedIn = async (req, res, next) => {
    console.log('Auth Check - Cookies:', req.cookies);
    
    // Get token from cookies OR Authorization header
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : null)
    if(!token) return res.status(401).send("Unauthorized: No token provided")
    
    const decoded = verifyToken(token);
    if(!decoded) return res.status(401).send("Unauthorized: Invalid token");
    
    try {
        // Check if user still exists in the database
        const userExists = await AdminUser.findById(decoded.id);
        
        if (!userExists) {
            res.clearCookie('token'); // Clear the invalid cookie
            return res.status(401).send("Unauthorized: User not found");
        }
        
        // custom property admin is added to the request object
        // so that it can be accessed in the next middleware or route handler
        req.admin = decoded;
        next();
    } catch (error) {
        console.error('Database check error:', error);
        return res.status(500).send("Server error during authentication");
    }
}