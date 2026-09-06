/**
 * Seed sample data for local development.
 *
 * Usage:
 *   npm run seed -- --force
 *   node scripts/seed.js --force
 *
 * Requires --force to wipe and reseed collections.
 * Only intended for NODE_ENV=development.
 */

require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const { UserModel } = require("../app/models/user");
const { CategoryModel } = require("../app/models/category");
const { ProjectModel } = require("../app/models/project");
const { ProposalModel } = require("../app/models/proposal");

const DEV_OTP = 111111;
const FORCE = process.argv.includes("--force");

const categoriesData = [
  {
    title: "طراحی وب",
    englishTitle: "web-design",
    description: "طراحی رابط کاربری و تجربه کاربری وب‌سایت",
    type: "project",
  },
  {
    title: "برنامه‌نویسی موبایل",
    englishTitle: "mobile-dev",
    description: "توسعه اپلیکیشن اندروید و iOS",
    type: "project",
  },
  {
    title: "تولید محتوا",
    englishTitle: "content",
    description: "نویسندگی، کپی‌رایتینگ و تولید محتوای متنی",
    type: "project",
  },
  {
    title: "برنامه‌نویسی وب",
    englishTitle: "web-dev",
    description: "توسعه فرانت‌اند و بک‌اند وب",
    type: "project",
  },
  {
    title: "گرافیک و برندینگ",
    englishTitle: "graphic-design",
    description: "طراحی لوگو، هویت بصری و گرافیک",
    type: "project",
  },
];

const ownersData = [
  {
    name: "علی رضایی",
    email: "ali.owner@example.com",
    phoneNumber: "09121111111",
    role: "OWNER",
    biography: "کارفرمای فناوری",
  },
  {
    name: "سارا محمدی",
    email: "sara.owner@example.com",
    phoneNumber: "09122222222",
    role: "OWNER",
    biography: "مدیر استارتاپ",
  },
  {
    name: "حسین کریمی",
    email: "hossein.owner@example.com",
    phoneNumber: "09123333333",
    role: "OWNER",
    biography: "صاحب کسب‌وکار آنلاین",
  },
];

const freelancersData = [
  {
    name: "مینا احمدی",
    email: "mina.freelancer@example.com",
    phoneNumber: "09124444444",
    role: "FREELANCER",
    biography: "توسعه‌دهنده React",
  },
  {
    name: "رضا نوری",
    email: "reza.freelancer@example.com",
    phoneNumber: "09125555555",
    role: "FREELANCER",
    biography: "طراح UI/UX",
  },
  {
    name: "نگار صادقی",
    email: "negar.freelancer@example.com",
    phoneNumber: "09126666666",
    role: "FREELANCER",
    biography: "برنامه‌نویس موبایل",
  },
  {
    name: "امیر حسینی",
    email: "amir.freelancer@example.com",
    phoneNumber: "09127777777",
    role: "FREELANCER",
    biography: "تولیدکننده محتوا",
  },
];

const adminData = {
  name: "ادمین سیستم",
  email: "admin@karava.local",
  phoneNumber: "09128888888",
  role: "ADMIN",
  biography: "مدیر پلتفرم",
};

function daysFromNow(days) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

function userDefaults(extra) {
  return {
    isActive: true,
    isVerifiedPhoneNumber: true,
    status: 2,
    otp: {
      code: DEV_OTP,
      expiresIn: daysFromNow(30),
    },
    ...extra,
  };
}

async function seed() {
  if (process.env.NODE_ENV === "production") {
    console.error("❌ Seed در production مجاز نیست.");
    process.exit(1);
  }

  if (!FORCE) {
    console.error(
      "❌ برای پاک کردن و seed مجدد، اسکریپت را با فلگ --force اجرا کنید:\n   npm run seed -- --force"
    );
    process.exit(1);
  }

  const dbUri = process.env.APP_DB;
  if (!dbUri) {
    console.error("❌ APP_DB در .env تعریف نشده است.");
    process.exit(1);
  }

  console.log("Connecting to", dbUri);
  await mongoose.connect(dbUri);

  console.log("Clearing collections...");
  await Promise.all([
    ProposalModel.deleteMany({}),
    ProjectModel.deleteMany({}),
    CategoryModel.deleteMany({}),
    UserModel.deleteMany({}),
  ]);

  console.log("Seeding categories...");
  const categories = await CategoryModel.insertMany(categoriesData);

  console.log("Seeding users...");
  const owners = await UserModel.insertMany(ownersData.map(userDefaults));
  const freelancers = await UserModel.insertMany(
    freelancersData.map(userDefaults)
  );
  const [admin] = await UserModel.insertMany([userDefaults(adminData)]);

  const byEnglish = Object.fromEntries(
    categories.map((c) => [c.englishTitle, c])
  );

  console.log("Seeding projects...");
  const projectsPayload = [
    {
      title: "طراحی لندینگ استارتاپ",
      description: "نیاز به طراحی یک لندینگ مدرن و ریسپانسیو برای معرفی محصول داریم.",
      status: "OPEN",
      category: byEnglish["web-design"]._id,
      budget: 25000000,
      tags: ["ui", "figma", "landing"],
      deadline: daysFromNow(20),
      owner: owners[0]._id,
      freelancer: null,
      proposals: [],
    },
    {
      title: "اپلیکیشن رزرو آنلاین",
      description: "ساخت اپ اندروید/iOS برای رزرو نوبت کلینیک زیبایی.",
      status: "OPEN",
      category: byEnglish["mobile-dev"]._id,
      budget: 80000000,
      tags: ["react-native", "mobile"],
      deadline: daysFromNow(45),
      owner: owners[1]._id,
      freelancer: null,
      proposals: [],
    },
    {
      title: "تولید محتوای بلاگ فروشگاهی",
      description: "نوشتن ۱۰ مقاله سئو‌محور برای فروشگاه لوازم خانگی.",
      status: "OPEN",
      category: byEnglish["content"]._id,
      budget: 12000000,
      tags: ["seo", "content"],
      deadline: daysFromNow(15),
      owner: owners[2]._id,
      freelancer: null,
      proposals: [],
    },
    {
      title: "پنل ادمین فروشگاه",
      description: "توسعه داشبورد React برای مدیریت سفارش‌ها و موجودی.",
      status: "CLOSED",
      category: byEnglish["web-dev"]._id,
      budget: 45000000,
      tags: ["react", "dashboard"],
      deadline: daysFromNow(-5),
      owner: owners[0]._id,
      freelancer: freelancers[0]._id,
      proposals: [],
    },
    {
      title: "هویت بصری برند کافه",
      description: "طراحی لوگو، کارت ویست و پکیج شبکه‌های اجتماعی.",
      status: "CLOSED",
      category: byEnglish["graphic-design"]._id,
      budget: 18000000,
      tags: ["logo", "branding"],
      deadline: daysFromNow(-10),
      owner: owners[1]._id,
      freelancer: freelancers[1]._id,
      proposals: [],
    },
    {
      title: "API بک‌اند مارکت‌پلیس",
      description: "پیاده‌سازی REST API با Node و MongoDB برای مارکت‌پلیس.",
      status: "OPEN",
      category: byEnglish["web-dev"]._id,
      budget: 60000000,
      tags: ["node", "express", "mongodb"],
      deadline: daysFromNow(30),
      owner: owners[2]._id,
      freelancer: null,
      proposals: [],
    },
  ];

  const projects = await ProjectModel.insertMany(projectsPayload);
  const openProjects = projects.filter((p) => p.status === "OPEN");

  console.log("Seeding proposals...");
  const proposalsPayload = [
    {
      price: 22000000,
      duration: 14,
      durationUnit: "day",
      description: "آماده طراحی کامل در فیگما با دو دور بازبینی.",
      user: freelancers[1]._id,
      status: 1, // pending
      projectIndex: 0,
    },
    {
      price: 24000000,
      duration: 10,
      durationUnit: "day",
      description: "طراحی سریع با تمرکز روی تبدیل کاربر.",
      user: freelancers[0]._id,
      status: 0, // rejected
      projectIndex: 0,
    },
    {
      price: 75000000,
      duration: 40,
      durationUnit: "day",
      description: "اپ با React Native و اتصال به API موجود.",
      user: freelancers[2]._id,
      status: 1, // pending
      projectIndex: 1,
    },
    {
      price: 70000000,
      duration: 35,
      durationUnit: "day",
      description: "نسخه کامل اندروید و iOS با تست کاربری.",
      user: freelancers[0]._id,
      status: 2, // accepted — but keep project OPEN for demo variety; optional
      projectIndex: 1,
    },
    {
      price: 10000000,
      duration: 12,
      durationUnit: "day",
      description: "۱۰ مقاله ۳۰۰۰ کلمه‌ای با تحقیق کلمه کلیدی.",
      user: freelancers[3]._id,
      status: 1, // pending
      projectIndex: 2,
    },
    {
      price: 55000000,
      duration: 25,
      durationUnit: "day",
      description: "طراحی و پیاده‌سازی API با احراز هویت JWT.",
      user: freelancers[0]._id,
      status: 1, // pending
      projectIndex: 5,
    },
    {
      price: 50000000,
      duration: 20,
      durationUnit: "day",
      description: "پیاده‌سازی سریع با پوشش تست واحد.",
      user: freelancers[2]._id,
      status: 0, // rejected
      projectIndex: 5,
    },
  ];

  const createdProposals = [];
  for (const item of proposalsPayload) {
    const { projectIndex, ...proposalFields } = item;
    const proposal = await ProposalModel.create(proposalFields);
    createdProposals.push(proposal);

    const project = projects[projectIndex];
    const update = { $push: { proposals: proposal._id } };

    // If accepted, assign freelancer on that project
    if (proposalFields.status === 2) {
      update.$set = { freelancer: proposalFields.user };
    }

    await ProjectModel.updateOne({ _id: project._id }, update);
  }

  const userCounts = {
    OWNER: owners.length,
    FREELANCER: freelancers.length,
    ADMIN: 1,
  };

  console.log("\n✅ Seed completed successfully\n");
  console.log("Summary:");
  console.log(`  Categories : ${categories.length}`);
  console.log(
    `  Users      : ${owners.length + freelancers.length + 1} (OWNER=${userCounts.OWNER}, FREELANCER=${userCounts.FREELANCER}, ADMIN=${userCounts.ADMIN})`
  );
  console.log(
    `  Projects   : ${projects.length} (OPEN=${openProjects.length}, CLOSED=${projects.length - openProjects.length})`
  );
  console.log(`  Proposals  : ${createdProposals.length}`);
  console.log("\nTest phone numbers (dev OTP = 111111):");
  console.log("  ADMIN      :", admin.phoneNumber);
  owners.forEach((u) => console.log(`  OWNER      : ${u.phoneNumber}  (${u.name})`));
  freelancers.forEach((u) =>
    console.log(`  FREELANCER : ${u.phoneNumber}  (${u.name})`)
  );
  console.log(
    "\nLogin flow: POST /api/user/get-otp → POST /api/user/check-otp with otp \"111111\""
  );

  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error("Seed failed:", err);
  try {
    await mongoose.disconnect();
  } catch (_) {}
  process.exit(1);
});
