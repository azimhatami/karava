export const ACTION_TYPES = {
  SEND_PROPOSAL: 'send-proposal',
  CREATE_PROJECT: 'create-project',
};

export const FIELD_LABELS = {
  name: 'نام و نام خانوادگی',
  email: 'ایمیل',
  biography: 'بیوگرافی',
  skills: 'مهارت‌ها',
  companyName: 'نام شرکت/کسب‌وکار',
  companyDescription: 'معرفی کسب‌وکار',
};

function hasText(value, minLength = 1) {
  return typeof value === 'string' && value.trim().length >= minLength;
}

function hasSkills(skills) {
  return Array.isArray(skills) && skills.some((skill) => hasText(skill));
}

const ACTION_REQUIREMENTS = {
  [ACTION_TYPES.SEND_PROPOSAL]: [
    { key: 'name', check: (user) => hasText(user?.name, 3) },
    { key: 'email', check: (user) => hasText(user?.email) },
    { key: 'biography', check: (user) => hasText(user?.biography, 20) },
    { key: 'skills', check: (user) => hasSkills(user?.skills) },
  ],
  [ACTION_TYPES.CREATE_PROJECT]: [
    { key: 'name', check: (user) => hasText(user?.name, 3) },
    { key: 'email', check: (user) => hasText(user?.email) },
    { key: 'companyName', check: (user) => hasText(user?.companyName, 2) },
    {
      key: 'companyDescription',
      check: (user) => hasText(user?.companyDescription, 20),
    },
  ],
};

const ROLE_PROGRESS_FIELDS = {
  FREELANCER: ['name', 'email', 'biography', 'skills'],
  OWNER: ['name', 'email', 'companyName', 'companyDescription'],
  ADMIN: ['name', 'email'],
};

export function isProfileCompleteForAction(user, actionType) {
  const requirements = ACTION_REQUIREMENTS[actionType] || [];
  const missingFields = requirements
    .filter((requirement) => !requirement.check(user))
    .map((requirement) => ({
      key: requirement.key,
      label: FIELD_LABELS[requirement.key] || requirement.key,
    }));

  return {
    complete: missingFields.length === 0,
    missingFields,
  };
}

export function getProfileCompletion(user) {
  const role = user?.role || 'FREELANCER';
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

  return {
    percent: Math.round((filled / total) * 100),
    filled,
    total,
    fields: fields.map((key) => ({
      key,
      label: FIELD_LABELS[key] || key,
      complete: Boolean(checks[key]?.()),
    })),
  };
}

export function isProfileIncompleteError(error) {
  return error?.response?.data?.code === 'PROFILE_INCOMPLETE';
}

export function getProfileIncompletePayload(error) {
  const data = error?.response?.data || {};
  return {
    message:
      data.message ||
      'برای انجام این عملیات باید ابتدا پروفایل خود را تکمیل کنید',
    missingFields: data.missingFields || [],
  };
}
