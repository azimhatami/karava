# Karava

پلتفرم فریلنسری فارسی (RTL) برای اتصال کارفرما و فریلنسر: ثبت پروژه، ارسال پیشنهاد، تأیید ادمین و داشبوردهای نقش‌محور.

---

## فهرست مطالب

- [معرفی](#معرفی)
- [قابلیت‌ها](#قابلیت‌ها)
- [تکنولوژی‌ها](#تکنولوژی‌ها)
- [ساختار پروژه](#ساختار-پروژه)
- [معماری](#معماری)
- [نقش‌ها و وضعیت کاربر](#نقش‌ها-و-وضعیت-کاربر)
- [راه‌اندازی محلی](#راه‌اندازی-محلی)
- [دیتای تستی و OTP توسعه](#دیتای-تستی-و-otp-توسعه)
- [متغیرهای محیطی](#متغیرهای-محیطی)
- [API](#api)
- [مدل‌های دیتابیس](#مدل‌های-دیتابیس)
- [مسیرهای فرانت‌اند](#مسیرهای-فرانت‌اند)
- [نکات و محدودیت‌ها](#نکات-و-محدودیت‌ها)

---

## معرفی

**Karava** یک مارکت‌پلیس فریلنسری است که در آن:

1. کارفرما (`OWNER`) پروژه ثبت می‌کند.
2. فریلنسر (`FREELANCER`) روی پروژه‌های باز پیشنهاد می‌فرستد.
3. کارفرما پیشنهاد را می‌پذیرد یا رد می‌کند.
4. ادمین (`ADMIN`) کاربران را تأیید و دسته‌بندی‌ها را مدیریت می‌کند.

احراز هویت با **OTP پیامکی** (کاوه‌نگار) انجام می‌شود. رابط کاربری کاملاً فارسی و راست‌چین است.

---

## قابلیت‌ها

| قابلیت | وضعیت |
|--------|--------|
| ورود با OTP موبایل | پیاده‌سازی شده |
| تکمیل پروفایل و انتخاب نقش | پیاده‌سازی شده |
| تأیید کاربر توسط ادمین | پیاده‌سازی شده |
| CRUD پروژه (کارفرما) | پیاده‌سازی شده |
| لیست پروژه‌های باز و ارسال پیشنهاد | پیاده‌سازی شده |
| پذیرش / رد پیشنهاد | پیاده‌سازی شده |
| مدیریت دسته‌بندی (ادمین) | پیاده‌سازی شده |
| داشبورد و آمار ساده هر نقش | پیاده‌سازی شده |
| حالت تاریک (Dark Mode) | پیاده‌سازی شده |
| پرداخت / کیف پول | موجود نیست |
| چت / پیام‌رسانی | موجود نیست |
| آپلود فایل | موجود نیست (multer غیرفعال) |

---

## تکنولوژی‌ها

### فرانت‌اند (`frontend/`)

- React 18 + Vite 6
- React Router 7
- Tailwind CSS 3
- TanStack React Query 5
- Axios (با `withCredentials`)
- react-hook-form، react-hot-toast، Headless UI
- فونت Vazirmatn / Vazir

### بک‌اند (`backend/`)

- Node.js + Express 4
- MongoDB + Mongoose 7
- JWT + Cookie امضاشده (HTTP-only)
- Joi برای اعتبارسنجی
- Kavenegar برای SMS OTP

### پیش‌نیازها

- Node.js و npm
- MongoDB
- کلید API کاوه‌نگار (برای ارسال واقعی OTP)

---

## ساختار پروژه

```
Karava/
├── README.md
├── backend/
│   ├── index.js                 # نقطه ورود
│   ├── app/
│   │   ├── server.js            # Express، CORS، DB، روت‌ها
│   │   ├── router/              # تعریف مسیرهای API
│   │   ├── http/
│   │   │   ├── controllers/     # منطق کسب‌وکار
│   │   │   ├── middlewares/     # JWT، نقش، تأیید کاربر
│   │   │   └── validators/      # اسکیماهای Joi
│   │   └── models/              # User, Project, Proposal, Category
│   └── utils/                   # نقش‌ها، JWT، OTP
└── frontend/
    ├── vite.config.js           # پورت 3000
    └── src/
        ├── pages/               # صفحات مسیرها
        ├── features/            # auth, owner, freelancer, admin, ...
        ├── services/            # کلاینت‌های HTTP / API
        ├── ui/                  # کامپوننت‌های مشترک
        ├── hooks/
        └── context/             # مثلاً DarkMode
```

---

## معماری

```
Browser (localhost:3000)
    │  Axios + cookies
    ▼
Express API (localhost:5000/api)
    │  Mongoose
    ▼
MongoDB
```

- پاسخ موفق: `{ statusCode, data: { ... } }`
- پاسخ خطا: `{ statusCode, message }`
- CORS با `credentials: true` و origin از `ALLOW_CORS_ORIGIN`
- آدرس API فرانت در `frontend/src/services/httpService.js` به‌صورت ثابت روی `http://localhost:5000/api` تنظیم شده است.

### جریان احراز هویت

1. `POST /api/user/get-otp` — ارسال کد ۶ رقمی (انقضا ۹۰ ثانیه)
2. `POST /api/user/check-otp` — تأیید و ست کردن کوکی‌های `accessToken` (۱ روز) و `refreshToken` (۱ سال)
3. اگر پروفایل ناقص باشد → `POST /api/user/complete-profile`
4. تا وقتی `status !== 2` باشد، مسیرهای حساس پروژه/پیشنهاد/ادمین مسدودند (`isVerifiedUser`)
5. ادمین با `PATCH /api/admin/user/verify/:userId` وضعیت را تغییر می‌دهد
6. در صورت ۴۰۱، فرانت یک‌بار `GET /api/user/refresh-token` را امتحان می‌کند

---

## نقش‌ها و وضعیت کاربر

### نقش‌ها (`OWNER` | `FREELANCER` | `ADMIN`)

| نقش | دسترسی اصلی |
|-----|-------------|
| OWNER | ایجاد و مدیریت پروژه، بررسی پیشنهادها |
| FREELANCER | مشاهده پروژه‌های باز، ارسال پیشنهاد |
| ADMIN | تأیید کاربران، CRUD دسته‌بندی، دسترسی گسترده |

### وضعیت کاربر (`status`)

| مقدار | معنی |
|-------|------|
| `0` | رد شده |
| `1` | در انتظار تأیید (پیش‌فرض) |
| `2` | تأیید شده |

---

## راه‌اندازی محلی

### ۱. بک‌اند

```bash
cd backend
# فایل .env را بسازید (نمونه در بخش متغیرهای محیطی)
npm install
npm run dev    # nodemon — پورت پیش‌فرض 5000
```

### ۲. فرانت‌اند

```bash
cd frontend
npm install
npm run dev    # Vite — پورت 3000
```

### آدرس‌ها

| سرویس | آدرس |
|--------|------|
| فرانت‌اند | http://localhost:3000 |
| بک‌اند | http://localhost:5000 |
| API | http://localhost:5000/api |

مقدار `ALLOW_CORS_ORIGIN` باید با origin فرانت یکی باشد (مثلاً `http://localhost:3000`).

---

## دیتای تستی و OTP توسعه

> **هشدار:** این قابلیت‌ها فقط وقتی `NODE_ENV=development` است فعال‌اند. در production از OTP ثابت استفاده نکنید و seed را روی دیتابیس واقعی اجرا نکنید.

### Seed کردن دیتابیس

```bash
cd backend
npm run seed -- --force
```

بدون `--force` اسکریپت عمداً متوقف می‌شود. جزئیات بیشتر: [`backend/scripts/README.md`](backend/scripts/README.md).

### لاگین بدون کاوه‌نگار (فقط development)

1. یکی از شماره‌های seed را وارد کنید (مثلاً `09121111111` برای OWNER).
2. کد OTP را **`111111`** بزنید.
3. در لاگ backend پیام `OTP در محیط development: 111111` دیده می‌شود.

| نقش | شماره نمونه |
|-----|-------------|
| ADMIN | `09128888888` |
| OWNER | `09121111111` |
| FREELANCER | `09124444444` |

---

## متغیرهای محیطی

فایل `backend/.env` (در گیت نیست). نمونه:

```env
PORT=5000
APP_DB=mongodb://127.0.0.1:27017/karava
ALLOW_CORS_ORIGIN=http://localhost:3000
COOKIE_PARSER_SECRET_KEY=change-me-cookie
ACCESS_TOKEN_SECRET_KEY=change-me-access
REFRESH_TOKEN_SECRET_KEY=change-me-refresh
TOKEN_SECRET_KEY=change-me-token
DOMAIN=
NODE_ENV=development
KAVENEGAR_API_KEY=your-kavenegar-key
SERVER_URL=http://localhost:5000
```

| متغیر | کاربرد |
|--------|--------|
| `PORT` | پورت سرور (پیش‌فرض ۵۰۰۰) |
| `APP_DB` | URI اتصال MongoDB |
| `ALLOW_CORS_ORIGIN` | Origin مجاز CORS |
| `COOKIE_PARSER_SECRET_KEY` | امضای کوکی |
| `ACCESS_TOKEN_SECRET_KEY` | JWT دسترسی |
| `REFRESH_TOKEN_SECRET_KEY` | JWT رفرش |
| `TOKEN_SECRET_KEY` | کلید پشتیبان تولید توکن |
| `DOMAIN` | دامنه کوکی |
| `NODE_ENV` | در `development` فلگ `secure` کوکی خاموش است |
| `KAVENEGAR_API_KEY` | ارسال OTP |
| `SERVER_URL` | پیشوند URL آواتار |

فرانت‌اند فعلاً متغیر محیطی `VITE_*` ندارد.

---

## API

پایه: `/api`

### کاربر — `/api/user`

| متد | مسیر | احراز هویت | توضیح |
|-----|------|------------|--------|
| POST | `/get-otp` | عمومی | ارسال OTP |
| POST | `/check-otp` | عمومی | تأیید OTP |
| POST | `/complete-profile` | توکن | تکمیل پروفایل |
| GET | `/refresh-token` | کوکی رفرش | تمدید توکن |
| PATCH | `/update` | توکن | ویرایش پروفایل |
| GET | `/profile` | توکن | پروفایل فعلی |
| POST | `/logout` | — | پاک کردن کوکی‌ها |

### دسته‌بندی — `/api/category`

| متد | مسیر | احراز هویت |
|-----|------|------------|
| GET | `/list` | عمومی |
| GET | `/:id` | عمومی |

### پروژه — `/api/project` (توکن + کاربر تأییدشده)

| متد | مسیر | نقش |
|-----|------|-----|
| GET | `/list` | تأییدشده (فیلتر: search, category, sort, status) |
| GET | `/owner-projects` | OWNER, ADMIN |
| POST | `/add` | OWNER, ADMIN |
| GET | `/:id` | OWNER, ADMIN |
| PATCH | `/update/:id` | OWNER, ADMIN |
| PATCH | `/:id` | OWNER, ADMIN (وضعیت OPEN/CLOSED) |
| DELETE | `/:id` | OWNER, ADMIN |

### پیشنهاد — `/api/proposal` (توکن + کاربر تأییدشده)

| متد | مسیر | نقش |
|-----|------|-----|
| GET | `/list` | FREELANCER, ADMIN |
| POST | `/add` | FREELANCER, ADMIN |
| GET | `/:id` | FREELANCER, ADMIN |
| PATCH | `/:id` | OWNER, ADMIN (تغییر وضعیت) |

### ادمین — `/api/admin` (توکن + تأییدشده + ADMIN)

| متد | مسیر |
|-----|------|
| GET | `/user/list` |
| PATCH | `/user/verify/:userId` |
| GET | `/user/profile/:userId` |
| POST | `/category/add` |
| PATCH | `/category/update/:id` |
| DELETE | `/category/remove/:id` |

---

## مدل‌های دیتابیس

### User

- `name`, `avatar`, `biography`, `email`, `phoneNumber`, `password`
- `otp { code, expiresIn }`
- `isVerifiedPhoneNumber`, `isActive`
- `status` (0 | 1 | 2)
- `role` (پیش‌فرض `OWNER`)

### Project

- `title`, `description`, `budget`, `tags[]`, `deadline`
- `status`: `OPEN` | `CLOSED`
- `category` → Category
- `owner` → User
- `freelancer` → User | null
- `proposals[]` → Proposal

### Proposal

- `price`, `duration`, `description`
- `user` → User
- `status`: `0` رد | `1` در انتظار | `2` پذیرفته
- ارتباط با پروژه از طریق آرایه `Project.proposals` است (فیلد `projectId` روی Proposal نیست)

### Category

- `title`, `englishTitle` (یکتا), `description`
- `type` (پیش‌فرض `project`)
- `parentId`, `icon { sm, lg }`

---

## مسیرهای فرانت‌اند

| مسیر | توضیح |
|------|--------|
| `/` | صفحه اصلی / لیست پروژه‌ها |
| `/auth` | ورود با OTP |
| `/complete-profile` | تکمیل نام، ایمیل، نقش |
| `/owner/dashboard` | داشبورد کارفرما |
| `/owner/projects` | پروژه‌های کارفرما |
| `/owner/projects/:id` | جزئیات پروژه و پیشنهادها |
| `/freelancer/dashboard` | داشبورد فریلنسر |
| `/freelancer/projects` | پروژه‌های باز |
| `/freelancer/proposals` | پیشنهادهای فریلنسر |
| `/admin/dashboard` | داشبورد ادمین |
| `/admin/users` | مدیریت کاربران |
| `/admin/projects` | پروژه‌ها |
| `/admin/proposals` | پیشنهادها |

دسترسی به مسیرهای نقش‌دار با `ProtectedRoute` و تطبیق نقش کاربر با بخش مسیر (`/owner`, `/freelancer`, `/admin`) کنترل می‌شود.

---

## نکات و محدودیت‌ها

- در `backend/utils/functions.js` توابع قدیمی سبد خرید / محصول باقی مانده‌اند و استفاده نمی‌شوند.
- Docker در ریپو نیست.
- پرداخت، چت و آپلود فایل پیاده نشده‌اند.

---

## اسکریپت‌های مفید

```bash
# Backend
cd backend && npm run dev      # توسعه
cd backend && npm start        # پروداکشن

# Frontend
cd frontend && npm run dev     # توسعه
cd frontend && npm run build   # بیلد
cd frontend && npm run preview # پیش‌نمایش بیلد
cd frontend && npm run lint    # لینت
```
