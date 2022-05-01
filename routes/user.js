const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


// import models
const User = require('../models/user_model')
const Post = require('../models/post_model')
// import validation
const { registerValidation , signinValidation,modifieValidation} = require('../validation/uservalidations')
// import authorization
const authorization = require('../validation/authorizations')
const { post } = require('./post')


router.post('/signup',registervalid,emailisNotExist,async (req,res) =>{
    //hashing
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(req.body.password,salt)


    const user= new User({
        name:req.body.name,
        email: req.body.email,
        password: hashedPassword
    })
    try{
        const usersave = await user.save()
        const token = jwt.sign({_id: usersave._id },process.env.TOKEN_SECRET)
        res.cookie('token', token, {maxAge:1000*60*60*24*100,httpOnly:true}).status(201).send(token)
        
    }catch (err){
        res.json({message: err})
    }
})
router.post('/login',signinvalid, async (req,res)=>{
      const finduser = await User.findOne({email : req.body.email})
      if(!finduser) return res.status(400).send('Email or password is incorrect')
      // validpass
      const validPass= await bcrypt.compare( req.body.password,finduser.password )      
      
      if(!validPass) return res.status(400).send('Email or password is incorrect')
      
       
        const accessToken = jwt.sign({_id: finduser._id },process.env.TOKEN_SECRET)
        res.cookie('token', accessToken,{maxAge:1000*60*60*24*100,httpOnly:true})
        res.cookie('id', finduser._id,{maxAge:1000*60*60*24*100})
       res.send(accessToken)

        
    
       

} )

router.patch("/modifie",authorization,modifievalid,async(req,res)=>{
    const id = req.user._id
    if(req.body.password){
        const salt = await bcrypt.genSalt(8);
        const hashedPassword = await bcrypt.hash(req.body.password,salt)
        req.body.password = hashedPassword
    }
    const userfind = await User.findOne({_id:id})
    if(!userfind) return res.status(404).send('NOT FOUND')
    
    
    try{
     const userModf = await User.findOneAndUpdate({_id:id},req.body,{new:true,runValidators:true})
     res.send(userModf)
    }catch(err){
     res.status(400).send(err)
    }
})

router.get("/logout",(req,res)=>{

     res.cookie('token', '',{maxAge:1,httpOnly:true})
     res.cookie('id', '',{maxAge:1})
     res.send('you\'are logout now')
    })


router.get("/islogedin",authorization,async(req,res)=>{
    const finduser = await User.findOne({_id : req.user})
    if(!finduser) return res.status(200).send(false)

    return res.send(true)     
})


router.get('/getid', authorization,(req,res)=>{
    res.send(req.user._id)
})

router.get("/:id",async (req,res)=>{
    const finduser = await User.findOne({_id : req.params.id})
    if (finduser){
     res.send(finduser.name)
    }
     else{
     res.status(404).send('Not found')
     }
    })






function signinvalid(req, res ,next){
    const {error} = signinValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    next()
}
function modifievalid(req, res ,next){
    const {error} = modifieValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    next()
}
function registervalid(req, res ,next){
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    next()
}
async function  emailisNotExist(req,res,next){
    const email = req.body.email
    const findemail =  await User.findOne({email:email})
    if(findemail) return res.send('email alredy exist').status(400)
    next()
}



module.exports = router