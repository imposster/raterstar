const joi = require('joi')


function commentValidation(data){
    CommentSchema = joi.object({
        isagree:joi.boolean(),
        content: joi.string().min(1).max(255).required()
    })
    return CommentSchema.validate(data)
}
function modifieValidation(data){
    CommentSchema = joi.object({
        isagree:joi.boolean(),
        content: joi.string().min(1).max(255)
    })
    return CommentSchema.validate(data)
}

module.exports.commentValidation = commentValidation
module.exports.modifieValidation = modifieValidation