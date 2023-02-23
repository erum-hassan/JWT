const express = require('express')
const JWT = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
/*****Configration******/

const User = require('./User')
const app = express()
app.use(express.json())
app.use(cookieParser())
const mongoDb = 'mongodb://127.0.0.1:27017/users'
mongoose.connect(mongoDb, () => { console.log('database connected') })

 const SECRET_KEY ='secretkey'

/******Routes*******/



app.get('/', (req, res) => { res.send('Home Page') })

app.use(['/admin','/student','/teacher'],(req,res,next)=>{
    const Token = req.cookies.Token
    if(Token ==null){
        res.status(400).send('Routes are restricted')
    }
    else{
        JWT.verify(Token,SECRET_KEY,(err,user)=>{
            if(err){
                res.status(400).send('token not valid')
            }
            else {
                req.MyUser = user
                console.log("this is myuser" + user.id)
                next()
            }
        })
    }
})

app.use(['/admin'],(req,res,next) =>{
    if(req.MyUser.role=="Admin"){
        next()
    }
    else {
        res.send('You are not admin')
    }
})

app.use(['/teacher'],(req,res,next)=>{
    if(req.MyUser.role =="Teacher"){
        next()
    }
    else{
        res.send("you are not teacher")
    }
})

app.use(['/student'],(req,res,next)=>{
    if(req.MyUser.role =="Student"){
        next()
    }
    else{
        res.send("you are not student")
    }
})



app.get('/admin',(req,res)=>{
    res.send('admin dashboard')
})

app.get('/teacher',(req,res)=>{
    res.send('teacher dashboard')
})

app.get('/student',(req,res)=>{
    res.send('student dashboard')
})

/*********Register */

app.post('/register',async (req, res) => {
   const {Email,Password,Role} = req.body
   console.log(req.body)
   try{
    const result =  await User.create({Email:Email,Password:Password,Role:Role})
    const obj ={
        id:result['_id'],
        role:result['Role']
    }
    const Token = JWT.sign(obj,SECRET_KEY)
    res.cookie('Token',Token)
    res.send('User Added')

   }
   catch{
    console.log('bad request')
   }
}
)


app.post("/login",async(req,res)=>{
    const {Email,Password}= req.body
    const result = await User.findOne({Email:Email,Password:Password})
    if(result == null){
        res.send('Invalid Email and Password')
    }
    else {
        const obj ={
            id:result["_id"],
            role:result["Role"]
        }

        const Token = JWT.sign(obj,SECRET_KEY)
        res.cookie("Token",Token)
        res.send('cookie go saved')
    }
})


const port = process.env.port || 3000
app.listen(port, console.log(`listen,${port}`))