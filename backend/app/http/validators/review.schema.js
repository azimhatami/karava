const createError = require("http-errors");
const Joi = require("joi");
const { MongoIDPattern } = require("../../../utils/constants");
const { joiLocalizedNumber } = require("../../../utils/joiLocalizedNumber");

const MAX_COMMENT_LENGTH = 500;

const createReviewSchema = Joi.object({
  projectId: Joi.string()
    .required()
    .regex(MongoIDPattern)
    .error(createError.BadRequest("شناسه پروژه وارد شده صحیح نمیباشد")),
  rating: joiLocalizedNumber({ positive: true, integer: true }).error(
    createError.BadRequest("امتیاز باید عددی بین ۱ تا ۵ باشد")
  ),
  comment: Joi.string()
    .allow("", null)
    .max(MAX_COMMENT_LENGTH)
    .trim()
    .optional()
    .error(
      createError.BadRequest(
        `متن نظر حداکثر ${MAX_COMMENT_LENGTH} کاراکتر می‌تواند باشد`
      )
    ),
});

module.exports = {
  createReviewSchema,
  MAX_COMMENT_LENGTH,
};
