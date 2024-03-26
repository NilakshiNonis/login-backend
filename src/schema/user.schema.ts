import Joi from "joi";

const loginSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().email().required(),
})
const refreshTokenSchema = Joi.object({
    refresh_token: Joi.string().required(),
})

export default {
    loginSchema,
    refreshTokenSchema
}