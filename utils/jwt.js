const jwt = require('jsonwebtoken')

exports.generateToken = (payload)=>{
    return jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret-key-for-testing', { expiresIn: '1h' })
}

exports.verifyToken = (token)=>{
    try{
        return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key-for-testing')
    }catch(err){
        console.error("Token verification failed:", err.name, '-', err.message)
        return null
    }
}