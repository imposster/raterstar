const express = require('express')
const router = express.Router()



// import models
const User = require('../models/user_model')
const Post = require('../models/post_model')
const Comment = require('../models/postComment_model')
// import validation
const {postValidation,modifieValidation,queryValidation}= require('../validation/postvalidations')
// import authorization
const authorization = require('../validation/authorizations')




router.post('/create',postvalid,authorization, async (req,res) =>{
    const idExist = await User.findOne({_id: req.user._id})
    if(!idExist) return res.status(403).send('you shoold login')
    const post= new Post({
        userid: req.user._id,
        stars: req.body.stars,
        category: req.body.category,
        content: req.body.content
    })
    try{
        const postsave = await post.save()
        res.status(201).send(postsave)


    }catch (err){
        res.json({message: err})
    }
})

router.get('/getpost',queryvalid ,async (req,res) =>{
     const recherche = req.query.recherche
     try{
         const titlerecherch = await Post.find({title:recherche}) 
         const domainrecherch = await Post.find({domain:recherche})
         res.status(200).send({titlerecherch,domainrecherch})
     }catch(err){
       res.send(err).status(400)
     }
       
})
router.get('/post/:id' ,async (req,res) =>{
     const recherche = req.params.id
     try{
         const post = await Post.find({_id:recherche}) 
         res.status(200).send(post[0])
     }catch(err){
       res.send(err).status(400)
     }
       
})
router.get('/getallposts',async (req,res) =>{
     try{
         const titlerecherch = await Post.find({}) 
         res.status(200).send(titlerecherch)
     }catch(err){
       res.send(err).status(400)
     }
       
})

router.patch("/modifie/:postid",modifvalid,authorization,async(req,res)=>{
    const idExist = await User.findOne({_id: req.user._id})
    if(!idExist) return res.status(403).send('you shoold login')
    const user_id = req.user._id
    const post_id = req.params.postid
    let poster = await Post.findOne({_id:post_id,userid:user_id})
    if(!poster) return res.status(401).send('NOT AUTHORIZAT')
    
    try{
    const data = req.body
     const postModf = await Post.findOneAndUpdate({_id:post_id},data,{new:true,runValidators:true})
     res.status(200).send(postModf)
    }catch(err){
     res.status(400).send(err)
    }

})

router.delete("/:postid/delete",authorization,async(req,res)=>{
    const idExist = await User.findOne({_id: req.user._id})
    if(!idExist) return res.status(403).send('you shoold login')
    const user_id = req.user._id
    const post_id = req.params.postid
    
    try{
        await Post.deleteOne({_id:post_id,userid:user_id})
        await Comment.deleteMany({postid:post_id})
     res.status(201).send('succes seleted')
    }catch(err){
     res.status(400).send(err)
    }
})

 router.get("/:postid/agree",authorization,async(req,res)=>{
       const post = await Post.findOne({_id: req.params.postid})
       if(!post) return res.send('Not found 404')
       const useragree = post.agree.find(id => id === req.user._id)
       if(useragree === req.user._id) return res.send('You already agree with this post')
       const usernotagree = post.notagree.find(id => id = req.user._id)
      
      try{
        if(usernotagree) {
            const list = {notagree: post.notagree.filter(id => id !== req.user._id )}
            await Post.findOneAndUpdate({_id:req.params.postid},list,{new:true,runValidators:true})
        }
        const data = {agree: [...post.agree, req.user._id]}
        const postModf = await Post.findOneAndUpdate({_id:req.params.postid},data,{new:true,runValidators:true})
        res.status(200).send(postModf)
      }catch(err){
        res.send(err)
      }
 })
 router.get("/:postid/notagree",authorization,async(req,res)=>{
       const post = await Post.findOne({_id: req.params.postid})
       if(!post) return res.send('Not found 404')
       const usernotagree = post.notagree.find(id => id === req.user._id)
       if(usernotagree === req.user._id) return res.send('You already notagree with this post')
       const useragree = post.agree.find(id => id === req.user._id)
      
      try{
        if(useragree) {
            const list = {agree: post.notagree.filter(id => id !== req.user._id )}
            await Post.findOneAndUpdate({_id:req.params.postid},list,{new:true,runValidators:true})
        }
        const data = {notagree: [...post.notagree, req.user._id]}
        const postModf = await Post.findOneAndUpdate({_id:req.params.postid},data,{new:true,runValidators:true})
        res.status(200).send(postModf)
      }catch(err){
        res.send(err)
      }
 })

 



 



 
function postvalid(req, res ,next){
    const {error} = postValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    next()
}
function modifvalid(req, res ,next){
    const {error} = modifieValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    next()
}
function queryvalid(req, res ,next){
    const {error} = queryValidation(req.query);
    if (error) return res.status(400).send(error.details[0].message);
    next()
}







module.exports = router;