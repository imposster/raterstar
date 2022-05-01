require('dotenv').config()
const jwt = require('jsonwebtoken')


async function authorization(req,res,next){
    let token = `${req.cookies.token}`
    if(!token) return res.status(401).send('Access Denied')

    try{
     const verified = await jwt.verify(token,process.env.TOKEN_SECRET)
     req.user = verified
    }catch(err){
      return res.status(403).send('Not authorizated')
    }
     return next()
}

module.exports = authorization