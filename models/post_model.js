const mongoose= require('mongoose');
const {Schema}= mongoose ;

const postSchema = new Schema({
     userid: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
     stars: {
         type:Number,
         min:0,
         max:5,
         required:true
     },

     category:{
        type:String,
        enum : ['Film','Song','Club','Serie','Other'],
        required:true
    },
     content:{
        type:String,
        min:1,
        max:255,
        required:true
    },
    agree:{
       type:Array,
       
    },
     notagree:{
        type:Array,
        
    },    
    date_create:{
        type:Date,
        default:Date.now       
      }

})



module.exports = mongoose.model('Post', postSchema)