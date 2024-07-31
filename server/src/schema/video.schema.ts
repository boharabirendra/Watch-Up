import Joi from "joi";

export const videoReqBodySchema = Joi.object({
    title: Joi.string().required().messages({
        "any.required": "Title is required"
    }),
    description: Joi.string().required().messages({
        "any.required": "Description is required"
    }),
})