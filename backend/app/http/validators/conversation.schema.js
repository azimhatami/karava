const createError = require("http-errors");
const Joi = require("joi");
const { MongoIDPattern } = require("../../../utils/constants");

const sendMessageSchema = Joi.object({
  text: Joi.string()
    .trim()
    .min(1)
    .max(2000)
    .required()
    .error(createError.BadRequest("متن پیام باید بین ۱ تا ۲۰۰۰ کاراکتر باشد")),
});

const conversationIdParamSchema = Joi.object({
  conversationId: Joi.string()
    .regex(MongoIDPattern)
    .required()
    .error(createError.BadRequest("شناسه مکالمه نامعتبر است")),
});

module.exports = {
  sendMessageSchema,
  conversationIdParamSchema,
};
