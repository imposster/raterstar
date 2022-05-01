const router = require('express').Router()

// import modules

const Comment = require('../models/postComment_model')
const Post = require('../models/post_model')
const User = require('../models/user_model')

// import validation authorization

const authorization = require('../validation/authorizations')
const {commentValidation, modifieValidation} = require('../validation/commentvalidation')

// let's go .........




router.post('/:postid/create',authorization,commentvalid,async(req,res)=>{
      const user = req.user._id
      const userfind= await User.findById(user)
      if(!userfind) return res.status(401).send('you shoold login')
      const post = req.params.postid
      const postfind = await Post.findById(post)
      if(!postfind) return res.status(404).send('404 the post is not any more EXISTE') 
      const comment = new Comment({
          userid: user,
          postid: post,
          content: req.body.content
      })
      try{
          const commentsave = await comment.save()
          res.send(commentsave).status(200)

      }catch(err){
          res.status(500).send(err)
      }


})

router.get('/:postid',async(req,res)=>{
    const post = req.params.postid
    try{
        const findComment = await Comment.find({postid:post})
        res.send(findComment)
    }catch(err){
        res.status(500).send(err)
    }
})

router.patch('/:id/modifie', modifvalid,authorization, async(req,res)=>{
    const userid = req.user._id
    const comment = req.params.id
    try{
        const data = req.body
        const modifecomment = await Comment.findOneAndUpdate({_id:comment,userid:userid},data,{new:true,runValidators:true})
        res.status(200).send(modifecomment)
    }catch(err){
        res.status(500).send(err)
        done()
    }
})

router.delete('/:id/delete',authorization, async(req,res)=>{
      const userid = req.user._id
      const comment = req.params.id

      try{
         await Comment.remove({_id:comment,userid:userid})
          res.send('succes').status(204)
      }catch(err){
          res.status(500).send(err)
      }

})













function commentvalid(req,res,next){
    const {error} = commentValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message);
    next()
}

function modifvalid(req,res,next){
    const {error} = modifieValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message);
    next()
}



module.exports=router