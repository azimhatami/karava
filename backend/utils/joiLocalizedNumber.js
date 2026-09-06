const { toEnglishDigits } = require("./functions");
const Joi = require("joi");

function normalizeDigitsValue(value) {
  return toEnglishDigits(value);
}

function digitsOnlyValue(value) {
  return normalizeDigitsValue(value).replace(/[^\d]/g, "");
}

/** Joi helper: accept localized digits, return Latin digit string. */
function joiLocalizedDigits(schemaBuilder = (schema) => schema) {
  return schemaBuilder(
    Joi.any().custom((value, helpers) => {
      const normalized = digitsOnlyValue(value);
      if (!normalized && value !== 0 && value !== "0") {
        return helpers.error("any.invalid");
      }
      return normalized;
    })
  );
}

/** Joi helper: accept localized digits / numbers, return Number. */
function joiLocalizedNumber(options = {}) {
  const { positive = false, integer = false } = options;

  return Joi.any().custom((value, helpers) => {
    const normalized = normalizeDigitsValue(value).replace(/[^\d.-]/g, "");
    const num = Number(normalized);

    if (Number.isNaN(num)) return helpers.error("number.base");
    if (positive && !(num > 0)) return helpers.error("number.positive");
    if (integer && !Number.isInteger(num)) return helpers.error("number.integer");

    return num;
  });
}

module.exports = {
  normalizeDigitsValue,
  digitsOnlyValue,
  joiLocalizedDigits,
  joiLocalizedNumber,
};
