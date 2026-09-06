const createError = require("http-errors");
const Joi = require("joi");
const { MongoIDPattern } = require("../../../utils/constants");
const { joiLocalizedNumber } = require("../../../utils/joiLocalizedNumber");

const addProposalSchema = Joi.object({
  description: Joi.string()
    .required()
    .error(createError.BadRequest("توضیحات ارسال شده صحیح نمیباشد")),
  price: joiLocalizedNumber({ positive: true }).error(
    createError.BadRequest("قیمت وارد شده صحیح نمیباشد")
  ),
  duration: joiLocalizedNumber({ positive: true }).error(
    createError.BadRequest(" زمان انجام پروژه را وارد کنید")
  ),
  durationUnit: Joi.string()
    .valid("day", "week", "month")
    .default("day")
    .error(createError.BadRequest("واحد مدت زمان صحیح نمیباشد")),
  projectId: Joi.string()
    .required()
    .regex(MongoIDPattern)
    .error(createError.BadRequest("شناسه پروژه وارد شده صحیح نمیباشد")),
});

module.exports = {
  addProposalSchema,
};
