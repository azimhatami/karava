# Development seed and login

> **Warning:** The fixed OTP and seed script are for development only. Never run them with `NODE_ENV=production`, and never seed a real database.

## Prerequisites

- MongoDB running (e.g. `mongodb://127.0.0.1:27017/karava`)
- `backend/.env` with `NODE_ENV=development` and a correct `APP_DB`

## Running the seed

From the `backend` folder:

```bash
npm run seed -- --force
```

Or:

```bash
node scripts/seed.js --force
```

Without `--force`, the script does not run (prevents accidental data wipes).

With `--force`, these collections are cleared and reseeded:

- `users`
- `categories`
- `projects`
- `proposals`

Seeded proposals include `durationUnit` (`day` by default).

## Fixed OTP login (development only)

When `NODE_ENV=development`:

1. Enter a seeded phone number (e.g. `09121111111`).
2. On the OTP step, enter the fixed code **`111111`**.
3. A real Kavenegar key is not required; SMS is not sent. The server logs:

```text
OTP در محیط development: 111111
```

### Sample numbers after seed

| Role | Phone numbers |
|------|---------------|
| ADMIN | `09128888888` |
| OWNER | `09121111111`, `09122222222`, `09123333333` |
| FREELANCER | `09124444444`, `09125555555`, `09126666666`, `09127777777` |

### Quick curl test

```bash
curl -c cookies.txt -X POST http://localhost:5000/api/user/get-otp \
  -H 'Content-Type: application/json' \
  -d '{"phoneNumber":"09121111111"}'

curl -b cookies.txt -c cookies.txt -X POST http://localhost:5000/api/user/check-otp \
  -H 'Content-Type: application/json' \
  -d '{"phoneNumber":"09121111111","otp":"111111"}'

curl -b cookies.txt http://localhost:5000/api/user/profile
```

Persian / Arabic digits in `phoneNumber` and `otp` are accepted and normalized server-side.

## Production

- In production, `get-otp` still uses Kavenegar.
- Fixed OTP `111111` is not accepted.
- The seed script exits if `NODE_ENV=production`.
