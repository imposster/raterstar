const joi = require('joi')


function postValidation(data){
       PostSchema = joi.object({
       stars:joi.number().min(1).max(5).required(),
       category:joi.any().allow('Film','Song','Club','Serie','other'),
       content:joi.string().min(5).max(255).required(),
       })
       return PostSchema.validate(data)
}
function modifieValidation(data){
       PostSchema = joi.object({
       stars:joi.number().min(1).max(5),
       category:joi.string().min(1).max(55).allow('Film','Song','Club','Serie','Other'),
       content:joi.string().min(5).max(255)
       })
       return PostSchema.validate(data)
}
function queryValidation(data){
       PostSchema = joi.object({
       recherche: joi.string().min(1).max(55).required()
       })
       return PostSchema.validate(data)
}



module.exports.postValidation = postValidation
module.exports.modifieValidation = modifieValidation
module.exports.queryValidation = queryValidation 


