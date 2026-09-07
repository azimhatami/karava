const createError = require("http-errors");
const Joi = require("joi");
const { joiLocalizedNumber } = require("../../../utils/joiLocalizedNumber");
const {
  MIN_DEPOSIT_AMOUNT,
  MAX_DEPOSIT_AMOUNT,
} = require("../../../utils/walletHelpers");

const depositSchema = Joi.object({
  amount: joiLocalizedNumber({ positive: true }).error(
    createError.BadRequest("مبلغ شارژ وارد شده صحیح نمیباشد")
  ),
});

module.exports = {
  depositSchema,
  MIN_DEPOSIT_AMOUNT,
  MAX_DEPOSIT_AMOUNT,
};
