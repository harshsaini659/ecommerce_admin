const AdminUser = require('../models/AdminUser')
const bcrypt = require('bcryptjs')
const {generateToken, verifyToken} = require('../utils/jwt')

// Render signup page
exports.renderSignup = (req, res) => {
  res.render('auth/signup')
}

// Handle signup form submission
exports.signup = async (req,res)=>{
    try{
        const {name,email,password} = req.body
        if(!name || !email || !password) return res.status(400).send("All fields are required")

        const Email = await AdminUser.findOne({email})
        if(Email) return res.status(400).send("User already exists")

        const hashedPwd = await bcrypt.hash(password, 12) // .hash(pwd, saltRounds <- 12 rounds)
        const newUser = new AdminUser({
            name,
            email,
            password: hashedPwd
        })
        await newUser.save()

        const token = generateToken({ id: newUser._id, email: newUser.email })
        if(!token) return res.status(500).send("Token generation failed")

        res.cookie('token', token, {httpOnly: true, maxAge: 86400000})
        res.status(200).redirect('/admin/dashboard')
    }catch(err){
        console.error("Signup Error:", err.message)
        res.status(500).send("Internal Server Error")
    }
}

// Render login page
exports.renderLogin = (req, res) => {
  res.render('auth/login')
}

// Handle login form submission
exports.login = async (req, res) => {
    try{
        const {email, password} = req.body
        if(!email || !password) return res.status(400).send("All fields are required")

        // returns whole mongoDB document and pwd in hashed format...
        const user = await AdminUser.findOne({email})
        if(!user) return res.status(400).send("Invalid Email")

        //.compare method compares plain text password with hashed password...
        const pwdMatch = await bcrypt.compare(password, user.password)
        if(!pwdMatch) return res.status(400).send("Invalid Password")
        
        const token = generateToken({ id: user._id, email: user.email })
        if(!token) return res.status(500).send("Token generation failed")

        res.cookie('token', token, {httpOnly: true, maxAge: 86400000})

        res.status(200).redirect('/admin/dashboard')
    }catch(err){
        console.error("Login Render Error:", err.message)
        res.status(500).send("Internal Server Error")
    }
}

// Logout user
exports.logout = (req,res) =>{
    try{
        res.clearCookie('token')
        res.status(200).redirect('/auth/login')
    }catch(err){
        console.log("Logout Error:", err.message)
        res.status(500).send("Internal Server error")
    }
}