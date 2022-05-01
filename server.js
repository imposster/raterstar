const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const app = express() 
const cookieParser = require('cookie-parser')


app.use(cors({origin: 'https://raterstar.netlify.app/',credentials: true}))
app.use(bodyParser.json())
app.use(cookieParser())
// import routes
const Post = require('./routes/post')
const Comment = require('./routes/comment')
const User = require('./routes/user')

app.use('/user' , User);
app.use('/post' , Post);
app.use('/comment',Comment)




app.get('/', (req,res)=>{
   res.status(201).json({mess :'error'})
   
})







mongoose.connect('mongodb://localhost:27017/raters')
.then(()=>console.log('connect to db'))
.catch(err =>console.log(err))


const port = process.env.PORT || 9999;


app.listen(port, () =>{console.log(`listening on port ${port}`)})

