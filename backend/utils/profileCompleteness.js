const createHttpError = require("http-errors");

const ACTION_TYPES = Object.freeze({
  SEND_PROPOSAL: "send-proposal",
  CREATE_PROJECT: "create-project",
});

const FIELD_LABELS = Object.freeze({
  name: "نام و نام خانوادگی",
  email: "ایمیل",
  biography: "بیوگرافی",
  skills: "مهارت‌ها",
  companyName: "نام شرکت/کسب‌وکار",
  companyDescription: "معرفی کسب‌وکار",
});

function hasText(value, minLength = 1) {
  return typeof value === "string" && value.trim().length >= minLength;
}

function hasSkills(skills) {
  return Array.isArray(skills) && skills.some((skill) => hasText(skill));
}

const ACTION_REQUIREMENTS = Object.freeze({
  [ACTION_TYPES.SEND_PROPOSAL]: [
    { key: "name", check: (user) => hasText(user?.name, 3) },
    { key: "email", check: (user) => hasText(user?.email) },
    { key: "biography", check: (user) => hasText(user?.biography, 20) },
    { key: "skills", check: (user) => hasSkills(user?.skills) },
  ],
  [ACTION_TYPES.CREATE_PROJECT]: [
    { key: "name", check: (user) => hasText(user?.name, 3) },
    { key: "email", check: (user) => hasText(user?.email) },
    { key: "companyName", check: (user) => hasText(user?.companyName, 2) },
    {
      key: "companyDescription",
      check: (user) => hasText(user?.companyDescription, 20),
    },
  ],
});

const ROLE_PROGRESS_FIELDS = Object.freeze({
  FREELANCER: ["name", "email", "biography", "skills"],
  OWNER: ["name", "email", "companyName", "companyDescription"],
  ADMIN: ["name", "email"],
});

function getMissingFields(user, actionType) {
  const requirements = ACTION_REQUIREMENTS[actionType] || [];
  return requirements
    .filter((requirement) => !requirement.check(user))
    .map((requirement) => ({
      key: requirement.key,
      label: FIELD_LABELS[requirement.key] || requirement.key,
    }));
}

/**
 * Checks whether a user profile has the required fields for a gated action.
 * @param {object} user
 * @param {'send-proposal'|'create-project'} actionType
 * @returns {{ complete: boolean, missingFields: Array<{key: string, label: string}> }}
 */
function isProfileCompleteForAction(user, actionType) {
  const missingFields = getMissingFields(user, actionType);
  return {
    complete: missingFields.length === 0,
    missingFields,
  };
}

function assertProfileCompleteForAction(user, actionType, message) {
  const { complete, missingFields } = isProfileCompleteForAction(
    user,
    actionType
  );

  if (complete) return;

  const error = createHttpError.Forbidden(
    message || "برای انجام این عملیات باید ابتدا پروفایل خود را تکمیل کنید"
  );
  error.code = "PROFILE_INCOMPLETE";
  error.missingFields = missingFields;
  throw error;
}

function getProfileCompletion(user) {
  const role = user?.role || "FREELANCER";
  const fields = ROLE_PROGRESS_FIELDS[role] || ROLE_PROGRESS_FIELDS.FREELANCER;
  const checks = {
    name: () => hasText(user?.name, 3),
    email: () => hasText(user?.email),
    biography: () => hasText(user?.biography, 20),
    skills: () => hasSkills(user?.skills),
    companyName: () => hasText(user?.companyName, 2),
    companyDescription: () => hasText(user?.companyDescription, 20),
  };

  const filled = fields.filter((key) => checks[key]?.()).length;
  const total = fields.length || 1;
  const percent = Math.round((filled / total) * 100);

  return {
    percent,
    filled,
    total,
    fields: fields.map((key) => ({
      key,
      label: FIELD_LABELS[key] || key,
      complete: Boolean(checks[key]?.()),
    })),
  };
}

module.exports = {
  ACTION_TYPES,
  FIELD_LABELS,
  isProfileCompleteForAction,
  assertProfileCompleteForAction,
  getProfileCompletion,
};
