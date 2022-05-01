const joi = require('joi')

const registerValidation = (data) =>{
       const RegistrationSchema = joi.object({
           name: joi.string().min(5).required(),
           email:joi.string().min(5).required().email(),
           password:joi.string().min(5).required()
       })   
       return RegistrationSchema.validate(data)
}
const modifieValidation = (data) =>{
       const RegistrationSchema = joi.object({
           name: joi.string().min(5),
           email:joi.string().min(5).email(),
           password:joi.string().min(5)
       })   
       return RegistrationSchema.validate(data)
}
const signinValidation = (data) =>{
       const SigninSchema = joi.object({
           email:joi.string().min(5).required().email(),
           password:joi.string().min(5).required()
       })   
       return SigninSchema.validate(data)
}


module.exports.registerValidation = registerValidation
module.exports.signinValidation = signinValidation
module.exports.modifieValidation = modifieValidation