const Joi = require("joi");
const createHttpError = require("http-errors");
const {
  joiLocalizedDigits,
  joiLocalizedNumber,
  digitsOnlyValue,
} = require("../../../utils/joiLocalizedNumber");

const getOtpSchema = Joi.object({
  phoneNumber: joiLocalizedDigits((schema) =>
    schema
      .required()
      .custom((value, helpers) => {
        const normalized = digitsOnlyValue(value);
        if (!/^09[0-9]{9}$/.test(normalized)) {
          return helpers.error("any.invalid");
        }
        return normalized;
      })
  ).error(
    createHttpError.BadRequest("شماره موبایل وارد شده صحیح نمیباشد")
  ),
});

const checkOtpSchema = Joi.object({
  otp: joiLocalizedDigits((schema) =>
    schema
      .required()
      .custom((value, helpers) => {
        const normalized = digitsOnlyValue(value);
        if (!/^\d{5,6}$/.test(normalized)) {
          return helpers.error("any.invalid");
        }
        return normalized;
      })
  ).error(createHttpError.BadRequest("کد ارسال شده صحیح نمیباشد")),
  phoneNumber: joiLocalizedDigits((schema) =>
    schema
      .required()
      .custom((value, helpers) => {
        const normalized = digitsOnlyValue(value);
        if (!/^09[0-9]{9}$/.test(normalized)) {
          return helpers.error("any.invalid");
        }
        return normalized;
      })
  ).error(
    createHttpError.BadRequest("شماره موبایل وارد شده صحیح نمیباشد")
  ),
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
  phoneNumber: joiLocalizedDigits((schema) =>
    schema
      .required()
      .custom((value, helpers) => {
        const normalized = digitsOnlyValue(value);
        if (!/^09[0-9]{9}$/.test(normalized)) {
          return helpers.error("any.invalid");
        }
        return normalized;
      })
  ).error(
    createHttpError.BadRequest("شماره موبایل وارد شده صحیح نمیباشد")
  ),
  biography: Joi.string()
    .max(500)
    .allow("")
    .error(createHttpError.BadRequest("بیوگرافی صحیح نمی باشد.")),
  skills: Joi.array()
    .items(Joi.string().trim().min(1).max(40))
    .max(20)
    .optional()
    .error(createHttpError.BadRequest("مهارت‌ها صحیح نمی باشد.")),
  companyName: Joi.string()
    .max(100)
    .allow("")
    .optional()
    .error(createHttpError.BadRequest("نام شرکت/کسب‌وکار صحیح نمی باشد.")),
  companyDescription: Joi.string()
    .max(500)
    .allow("")
    .optional()
    .error(createHttpError.BadRequest("معرفی کسب‌وکار صحیح نمی باشد.")),
});

module.exports = {
  getOtpSchema,
  completeProfileSchema,
  checkOtpSchema,
  updateProfileSchema,
  joiLocalizedNumber,
};
