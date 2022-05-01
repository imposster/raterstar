const mongoose= require('mongoose');
const {Schema}= mongoose;


const commentShema = new Schema({
      userid:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    postid:{
      type: Schema.Types.ObjectId,
        ref: 'Post'
    },
      isagree:{
          type:Boolean
      },
      content:{
          type:String,
          required:false,
          min:6,
          max:255
          
      },    
      date_create:{
        type:Date,
        default:Date.now       
      }

})

module.exports = mongoose.model('Comment', commentShema)