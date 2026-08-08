const Joi = require("joi");
const createHttpError = require("http-errors");
const { toEnglishDigits } = require("../../../utils/functions");

const getOtpSchema = Joi.object({
  phoneNumber: Joi.string()
    .length(11)
    .pattern(/^09[0-9]{9}$/)
    .error(createHttpError.BadRequest("شماره موبایل وارد شده صحیح نمیباشد")),
});

const checkOtpSchema = Joi.object({
  // Accept string or number (UI / JSON may send either), then normalize digits.
  otp: Joi.any()
    .required()
    .custom((value, helpers) => {
      const normalized = toEnglishDigits(value);
      if (!/^\d{5,6}$/.test(normalized)) {
        return helpers.error("any.invalid");
      }
      return normalized;
    })
    .error(createHttpError.BadRequest("کد ارسال شده صحیح نمیباشد")),
  phoneNumber: Joi.any()
    .required()
    .custom((value, helpers) => {
      const normalized = toEnglishDigits(value);
      if (!/^09[0-9]{9}$/.test(normalized)) {
        return helpers.error("any.invalid");
      }
      return normalized;
    })
    .error(createHttpError.BadRequest("شماره موبایل وارد شده صحیح نمیباشد")),
});

const completeProfileSchema = Joi.object({
  name: Joi.string()
    .min(5)
    .max(100)
    .error(createHttpError.BadRequest("نام کاربری وارد شده صحیح نمی باشد")),
  email: Joi.string()
    .email()
    .error(createHttpError.BadRequest("ایمیل وارد شده صحیح نمی باشد")),
  role: Joi.string()
    .required()
    .valid("FREELANCER", "OWNER")
    .error(createHttpError.BadRequest("نقش وارد شده صحیح نمی باشد")),
});

const updateProfileSchema = Joi.object({
  name: Joi.string()
    .min(5)
    .max(50)
    .required()
    .error(createHttpError.BadRequest("نام کاربری وارد شده صحیح نمی باشد")),
  email: Joi.string()
    .required()
    .email()
    .error(createHttpError.BadRequest("ایمیل وارد شده صحیح نمی باشد")),
  phoneNumber: Joi.string()
    .length(11)
    .pattern(/^09[0-9]{9}$/)
    .error(createHttpError.BadRequest("شماره موبایل وارد شده صحیح نمیباشد")),
  biography: Joi.string()
    .max(30)
    .allow("")
    .error(createHttpError.BadRequest("حوزه تخصصی صحیح نمی باشد.")),
});

module.exports = {
  getOtpSchema,
  completeProfileSchema,
  checkOtpSchema,
  updateProfileSchema,
};
