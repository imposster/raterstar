const mongoose= require('mongoose');
const {Schema} = mongoose ;

const userSchema = new Schema({
    name:{
      type:String,
      required:true,
      min:5,
      max:255
    },
    email:{
      type:String,
      required:true,
      min:5,
      max:255,
      lowercase: true
    },
    password:{
      type:String,
      required:true,
      min:5,
      max:255 
    },
    date_create:{
      type:Date,
      default:Date.now       
    }
        
})

module.exports = mongoose.model('User' , userSchema)




