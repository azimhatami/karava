# Seed و لاگین توسعه (Development)

> **هشدار:** OTP ثابت و اسکریپت seed فقط برای محیط توسعه هستند. هرگز `NODE_ENV=production` را با این قابلیت‌ها اجرا نکنید و seed را روی دیتابیس واقعی نزنید.

## پیش‌نیاز

- MongoDB در حال اجرا (مثلاً `mongodb://localhost:27017/karava`)
- فایل `backend/.env` با `NODE_ENV=development` و `APP_DB` صحیح

## اجرای Seed

از پوشه `backend`:

```bash
npm run seed -- --force
```

یا:

```bash
node scripts/seed.js --force
```

بدون `--force` اسکریپت اجرا نمی‌شود (جلوگیری از پاک شدن تصادفی دیتا).

با `--force` این collectionها پاک و دوباره پر می‌شوند:

- `users`
- `categories`
- `projects`
- `proposals`

## لاگین با OTP ثابت (فقط development)

وقتی `NODE_ENV=development` است:

1. شماره یکی از کاربران seed را وارد کنید (مثلاً `09121111111`).
2. در مرحله OTP کد ثابت **`111111`** را بزنید.
3. نیازی به کلید واقعی کاوه‌نگار نیست؛ SMS ارسال نمی‌شود و در لاگ سرور پیام زیر دیده می‌شود:

```text
OTP در محیط development: 111111
```

### شماره‌های نمونه بعد از seed

| نقش | شماره موبایل |
|-----|---------------|
| ADMIN | `09128888888` |
| OWNER | `09121111111`, `09122222222`, `09123333333` |
| FREELANCER | `09124444444`, `09125555555`, `09126666666`, `09127777777` |

### تست سریع با curl

```bash
curl -c cookies.txt -X POST http://localhost:5000/api/user/get-otp \
  -H 'Content-Type: application/json' \
  -d '{"phoneNumber":"09121111111"}'

curl -b cookies.txt -c cookies.txt -X POST http://localhost:5000/api/user/check-otp \
  -H 'Content-Type: application/json' \
  -d '{"phoneNumber":"09121111111","otp":"111111"}'

curl -b cookies.txt http://localhost:5000/api/user/profile
```

## Production

- در production، `get-otp` همچنان از کاوه‌نگار استفاده می‌کند.
- OTP ثابت `111111` پذیرفته نمی‌شود.
- اسکریپت seed اگر `NODE_ENV=production` باشد متوقف می‌شود.
