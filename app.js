require('dotenv').config();
const express = require('express')
const connectDB = require('./config/db')
const port = process.env.PORT || 3000
// const db = process.env.MONGO_URI;
const path = require('path')
const app = express()
const authRoute = require('./routes/auth')
const adminRoute = require('./routes/admin')
const cookieParser = require('cookie-parser')
app.use(cookieParser())
connectDB()

// Body parser middleware for form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")))
// Set view engine
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

//Routes
app.get('/',(req,res)=>{
    res.send('Welcome to the E-commerce Admin Panel')
})

app.use('/auth', authRoute)
app.use('/admin', adminRoute)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})