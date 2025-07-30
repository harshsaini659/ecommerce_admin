const {verifyToken} = require('../utils/jwt')

exports.isLoggedIn = (req,res,next)=>{
    const token = req.cookies.token 
    // || req.headers.authorization?.split(' ')[1]

    if(!token) return res.status(401).send("Unauthorized: No token provided")

    const decoded = verifyToken(token)
    if(!decoded) return res.status(401).send("Unauthorized: Invalid token")
    
    // custom property admin is added to the request object
    // so that it can be accessed in the next middleware or route handler
    req.admin = decoded
    next()
}