# Karava

A Persian (RTL) freelancing marketplace that connects project owners and freelancers: post projects, submit proposals, admin verification, and role-based dashboards.

---

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Architecture](#architecture)
- [Roles and user status](#roles-and-user-status)
- [Local setup](#local-setup)
- [Seed data and development OTP](#seed-data-and-development-otp)
- [Environment variables](#environment-variables)
- [API](#api)
- [Database models](#database-models)
- [Frontend routes](#frontend-routes)
- [Notes and limitations](#notes-and-limitations)

---

## Overview

**Karava** is a freelancing marketplace where:

1. An owner (`OWNER`) creates a project.
2. A freelancer (`FREELANCER`) submits proposals on open projects.
3. The owner accepts or rejects a proposal.
4. An admin (`ADMIN`) verifies users and manages categories.

Authentication uses **SMS OTP** (Kavenegar). The UI is fully Persian and right-to-left.

---

## Features

| Feature | Status |
|---------|--------|
| Login with mobile OTP | Implemented |
| Role selection and complete-profile onboarding | Implemented |
| Admin user verification | Implemented |
| Project CRUD (owner) | Implemented |
| Open project list and proposal submission | Implemented |
| Accept / reject proposals | Implemented |
| Category management (admin) | Implemented |
| Role-based dashboards and simple stats | Implemented |
| Public project details page | Implemented |
| In-panel profile editing (skills, company, bio) | Implemented |
| Profile completeness gate for create-project / send-proposal | Implemented |
| Proposal duration units (`day` / `week` / `month`) | Implemented |
| Localized price input with thousand separators | Implemented |
| Persian / Arabic digit normalization (inputs + validators) | Implemented |
| File uploads (portfolio, project attachments, deliverables) | Implemented |
| Post-acceptance chat with polling | Implemented |
| Mock internal wallet (deposit, escrow, release) | Implemented |
| Reviews and ratings after project completion | Implemented |
| Development OTP bypass (`111111`) and DB seed script | Implemented |
| Dark mode | Implemented |
| Payments / wallet | Mock internal wallet (deposit, escrow hold on accept, release on complete) |
| Chat / messaging | Post-acceptance conversations with polling |
| File upload | Local disk via swappable `fileStorage` (`backend/uploads/`) |

---

## Tech stack

### Frontend (`frontend/`)

- React 18 + Vite 6
- React Router 7
- Tailwind CSS 3
- TanStack React Query 5
- Axios (`withCredentials`)
- react-hook-form, react-hot-toast / Karava toasts, Headless UI
- Vazirmatn / Vazir fonts

### Backend (`backend/`)

- Node.js + Express 4
- MongoDB + Mongoose 7
- JWT + signed HTTP-only cookies
- Joi validation (with localized digit coercion)
- Kavenegar for SMS OTP

### Prerequisites

- Node.js and npm
- MongoDB
- Kavenegar API key (for real OTP delivery; not required in development)

---

## Project structure

```
Karava/
├── README.md
├── backend/
│   ├── index.js                 # Entry point
│   ├── .env.example
│   ├── app/
│   │   ├── server.js            # Express, CORS, DB, routes
│   │   ├── router/              # API route definitions
│   │   ├── http/
│   │   │   ├── controllers/     # Business logic
│   │   │   ├── middlewares/     # JWT, roles, verified user, optional auth
│   │   │   └── validators/      # Joi schemas
│   │   └── models/              # User, Project, Proposal, Category
│   ├── scripts/                 # Seed script + docs
│   └── utils/                   # Roles, JWT, OTP helpers, profile completeness
└── frontend/
    ├── .env.example
    ├── vite.config.js           # Port 3000
    └── src/
        ├── pages/               # Route pages
        ├── features/            # auth, owner, freelancer, admin, profile, ...
        ├── services/            # HTTP / API clients
        ├── ui/                  # Shared components
        ├── hooks/
        ├── utils/               # Digits, profile completeness, formatting
        └── context/             # e.g. DarkMode
```

---

## Architecture

```
Browser (localhost:3000)
    │  Axios + cookies
    ▼
Express API (localhost:5000/api)
    │  Mongoose
    ▼
MongoDB
```

- Success response: `{ statusCode, data: { ... } }`
- Error response: `{ statusCode, message }` (may include `code` / `missingFields` for profile incompleteness)
- CORS with `credentials: true` and origin from `ALLOW_CORS_ORIGIN`
- Frontend API base URL: `VITE_API_URL` (default `http://localhost:5000/api` in `frontend/src/services/httpService.js`)

### Auth flow

1. `POST /api/user/get-otp` — send a 6-digit code (expires in 90 seconds)
2. `POST /api/user/check-otp` — verify and set `accessToken` (1 day) and `refreshToken` (1 year) cookies
3. If the profile is incomplete → `POST /api/user/complete-profile`
4. While `status !== 2`, sensitive project / proposal / admin routes are blocked (`isVerifiedUser`)
5. Admin changes status via `PATCH /api/admin/user/verify/:userId`
6. On 401, the frontend retries once with `GET /api/user/refresh-token` (guest / public list flows avoid refresh loops)
7. Creating a project or sending a proposal requires a complete profile (`PROFILE_INCOMPLETE` / `403` when missing)

---

## Roles and user status

### Roles (`OWNER` | `FREELANCER` | `ADMIN`)

| Role | Main access |
|------|-------------|
| OWNER | Create and manage projects, review proposals |
| FREELANCER | Browse open projects, submit proposals |
| ADMIN | Verify users, category CRUD, broader access |

### User status (`status`)

| Value | Meaning |
|-------|---------|
| `0` | Rejected |
| `1` | Pending approval (default) |
| `2` | Approved |

---

## Local setup

### 1. Backend

```bash
cd backend
cp .env.example .env   # adjust secrets as needed
npm install
npm run dev            # nodemon — default port 5000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env   # optional; defaults to http://localhost:5000/api
npm install
npm run dev            # Vite — port 3000
```

### URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:5000 |
| API | http://localhost:5000/api |

`ALLOW_CORS_ORIGIN` must match the frontend origin (e.g. `http://localhost:3000`).

---

## Seed data and development OTP

> **Warning:** These features are active only when `NODE_ENV=development`. Do not use the fixed OTP in production, and do not run seed against a real database.

### Seed the database

```bash
cd backend
npm run seed -- --force
```

Without `--force`, the script exits on purpose. More detail: [`backend/scripts/README.md`](backend/scripts/README.md).

### Login without Kavenegar (development only)

1. Enter a seeded phone number (e.g. `09121111111` for OWNER).
2. Enter OTP **`111111`**.
3. Backend logs: `OTP در محیط development: 111111`.

| Role | Sample phone |
|------|--------------|
| ADMIN | `09128888888` |
| OWNER | `09121111111` |
| FREELANCER | `09124444444` |

---

## Environment variables

### Backend — `backend/.env` (not committed)

See [`backend/.env.example`](backend/.env.example):

```env
PORT=5000
APP_DB=mongodb://127.0.0.1:27017/karava
ALLOW_CORS_ORIGIN=http://localhost:3000

COOKIE_PARSER_SECRET_KEY=change-me-cookie-secret
ACCESS_TOKEN_SECRET_KEY=change-me-access-token-secret
REFRESH_TOKEN_SECRET_KEY=change-me-refresh-token-secret
TOKEN_SECRET_KEY=change-me-token-secret

ACCESS_TOKEN_EXPIRES_IN=1d
REFRESH_TOKEN_EXPIRES_IN=1y

# Leave empty for local development (do not use "localhost")
DOMAIN=
NODE_ENV=development
SERVER_URL=http://localhost:5000

# Get your key from https://panel.kavenegar.com
KAVENEGAR_API_KEY=YOUR_KAVENEGAR_API_KEY_HERE
```

| Variable | Purpose |
|----------|---------|
| `PORT` | Server port (default `5000`) |
| `APP_DB` | MongoDB connection URI |
| `ALLOW_CORS_ORIGIN` | Allowed CORS origin |
| `COOKIE_PARSER_SECRET_KEY` | Cookie signing secret |
| `ACCESS_TOKEN_SECRET_KEY` | Access JWT secret |
| `REFRESH_TOKEN_SECRET_KEY` | Refresh JWT secret |
| `TOKEN_SECRET_KEY` | Fallback token secret |
| `ACCESS_TOKEN_EXPIRES_IN` | Access token TTL (e.g. `1d`) |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh token TTL (e.g. `1y`) |
| `DOMAIN` | Cookie domain (omit / empty for local host-only cookies) |
| `NODE_ENV` | In `development`, cookie `secure` is off and fixed OTP is allowed |
| `KAVENEGAR_API_KEY` | SMS OTP delivery |
| `SERVER_URL` | Base URL for avatar URLs |
| `UPLOAD_DIR` | Upload root relative to backend (default `uploads`) |
| `UPLOAD_MAX_IMAGE_MB` | Max image size in MB (default `5`) |
| `UPLOAD_MAX_DOC_MB` | Max document size in MB (default `10`) |
| `UPLOAD_MAX_PORTFOLIO` | Max portfolio items per user |
| `UPLOAD_MAX_ATTACHMENTS` | Max attachments per project |
| `UPLOAD_MAX_DELIVERABLES` | Max deliverables per project |
| `UPLOAD_RATE_LIMIT_MAX` | Max uploads per window |
| `UPLOAD_RATE_LIMIT_WINDOW_MS` | Rate-limit window in ms |

### Frontend — `frontend/.env` (optional)

See [`frontend/.env.example`](frontend/.env.example):

```env
VITE_API_URL=http://localhost:5000/api
```

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | Axios base URL for the API |

---

## API

Base path: `/api`

### User — `/api/user`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/get-otp` | Public | Send OTP |
| POST | `/check-otp` | Public | Verify OTP |
| POST | `/complete-profile` | Token | Complete name, email, role |
| GET | `/refresh-token` | Refresh cookie | Renew tokens |
| PATCH | `/update` | Token | Update profile (bio, skills, company, phone, …) |
| GET | `/profile` | Token | Current user profile |
| POST | `/portfolio/upload` | Token | Upload freelancer portfolio image (`multipart/form-data`, field `file`) |
| DELETE | `/portfolio/:fileId` | Token | Delete a portfolio item |
| POST | `/logout` | — | Clear auth cookies |

### Category — `/api/category`

| Method | Path | Auth |
|--------|------|------|
| GET | `/list` | Public |
| GET | `/:id` | Public |

### Project — `/api/project`

| Method | Path | Auth / role | Description |
|--------|------|-------------|-------------|
| GET | `/list` | Public | Open listing (filters: `search`, `category`, `sort`, `status`) |
| GET | `/details/:id` | Public (optional auth) | Public details; includes `myProposal` when logged in |
| GET | `/owner-projects` | Token + verified; OWNER, ADMIN | Owner’s projects |
| POST | `/add` | Token + verified; OWNER, ADMIN | Create project (requires complete profile) |
| POST | `/:projectId/attachment` | Token + verified; OWNER, ADMIN | Upload project attachment (`multipart`, field `file`) |
| POST | `/:projectId/deliverable` | Token + verified; FREELANCER, ADMIN | Upload deliverable (assigned freelancer only) |
| GET | `/:id` | Token + verified; OWNER, ADMIN | Owner project detail |
| PATCH | `/update/:id` | Token + verified; OWNER, ADMIN | Update project |
| PATCH | `/:id/complete` | Token + verified; OWNER, ADMIN | Mark project completed and release escrow to freelancer |
| PATCH | `/:id` | Token + verified; OWNER, ADMIN | Set status `OPEN` / `CLOSED` |
| DELETE | `/:id` | Token + verified; OWNER, ADMIN | Delete project |

### Files — `/api/files`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/files/:folder/:filename` | Portfolio: public; attachments: logged-in; deliverables: owner / assigned freelancer / admin | Download stored file |

Folders: `portfolio`, `attachments`, `deliverables`.

### Proposal — `/api/proposal` (token + verified user)

| Method | Path | Role | Description |
|--------|------|------|-------------|
| GET | `/list` | FREELANCER, ADMIN | List proposals |
| POST | `/add` | FREELANCER, ADMIN | Create proposal (`price`, `duration`, `durationUnit`; requires complete profile) |
| GET | `/:id` | FREELANCER, ADMIN | Proposal by id |
| PATCH | `/:id` | OWNER, ADMIN | Change proposal status (accept holds proposal price in escrow) |

### Review — `/api/review`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` | Token + verified; OWNER, FREELANCER | Create a review for a completed project (`projectId`, `rating` 1–5, optional `comment`). `reviewee` is derived server-side |
| GET | `/user/:userId` | Public | Reviews received by a user, plus `averageRating` and `totalReviews` |
| GET | `/project/:projectId` | Public (optional auth) | Reviews for a project; includes `myReview` and `canReview` when logged in |

### Wallet — `/api/wallet` (token + verified; OWNER, FREELANCER, ADMIN)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Balance, heldBalance, mock flag, paginated transactions (`page`, `limit`) |
| POST | `/deposit` | Mock top-up (`amount` only; min 10,000 / max 200,000,000 تومان) |

### Admin — `/api/admin` (token + verified + ADMIN)

| Method | Path |
|--------|------|
| GET | `/user/list` |
| PATCH | `/user/verify/:userId` |
| GET | `/user/profile/:userId` |
| POST | `/category/add` |
| PATCH | `/category/update/:id` |
| DELETE | `/category/remove/:id` |

---

## Database models

### User

- `name`, `avatar`, `biography`, `email`, `phoneNumber`, `password`
- `skills[]` (freelancer)
- `companyName`, `companyDescription` (owner)
- `portfolio[]` — `{ filename, originalName, mimeType, size, storageKey, url, uploadedAt }`
- `otp { code, expiresIn }`
- `isVerifiedPhoneNumber`, `isActive`
- `status` (`0` | `1` | `2`)
- `role` (default `OWNER`)

### Project

- `title`, `description`, `budget`, `tags[]`, `deadline`
- `attachments[]`, `deliverables[]` — same file shape as portfolio
- `status`: `OPEN` | `CLOSED` | `COMPLETED`
- `escrowAmount`, `escrowProposal`, `escrowStatus` (`none` \| `held` \| `released` \| `refunded`)
- `category` → Category
- `owner` → User
- `freelancer` → User | null
- `proposals[]` → Proposal

### Proposal

- `price`, `duration`, `durationUnit` (`day` | `week` | `month`, default `day`)
- `description`
- `user` → User
- `status`: `0` rejected | `1` pending | `2` accepted
- Linked to a project via `Project.proposals` (no `projectId` field on Proposal)

### Category

- `title`, `englishTitle` (unique), `description`
- `type` (default `project`)
- `parentId`, `icon { sm, lg }`

### Wallet

- `user` → User (unique)
- `balance` (spendable), `heldBalance` (escrow total)

### WalletTransaction

- `wallet` → Wallet
- `type`: `deposit` | `hold` | `release` | `refund`
- `amount`, `relatedProject`, `relatedProposal`, `description`

### Review

- `project` → Project, `proposal` → Proposal
- `reviewer`, `reviewee` → User
- `rating` (1–5), `comment` (optional, max 500)
- Unique index on `(project, reviewer)`

---

## Frontend routes

| Path | Description |
|------|-------------|
| `/` | Home / public project list |
| `/projects/:projectId` | Public project details |
| `/users/:userId` | Public user profile and reviews |
| `/auth` | OTP login (role selection first) |
| `/complete-profile` | Complete name, email, role |
| `/owner/dashboard` | Owner dashboard |
| `/owner/projects` | Owner projects |
| `/owner/projects/:id` | Owner project detail and proposals |
| `/owner/messages` | Owner conversations |
| `/owner/wallet` | Owner mock wallet |
| `/owner/profile` | Owner profile |
| `/freelancer/dashboard` | Freelancer dashboard |
| `/freelancer/projects` | Open projects |
| `/freelancer/proposals` | Freelancer proposals |
| `/freelancer/messages` | Freelancer conversations |
| `/freelancer/wallet` | Freelancer mock wallet |
| `/freelancer/profile` | Freelancer profile |
| `/admin/dashboard` | Admin dashboard |
| `/admin/users` | User management |
| `/admin/projects` | Projects |
| `/admin/proposals` | Proposals |
| `/admin/profile` | Admin profile |

Role-scoped routes are guarded by `ProtectedRoute` and match the user’s role to the path segment (`/owner`, `/freelancer`, `/admin`).

---

## Notes and limitations

- Legacy cart / product helpers may still exist in `backend/utils/functions.js` and are unused.
- Numeric inputs accept Persian (`۰-۹`) and Arabic-Indic (`٠-٩`) digits and normalize to Latin digits before submit / Joi validation.
- Incomplete profile actions return `403` with `code: PROFILE_INCOMPLETE` and `missingFields`.
- Uploaded files are stored under `backend/uploads/` (gitignored) via `utils/fileStorage.js` (local now, swappable later).
- No Docker setup in the repo.
- Wallet deposits are simulated (no payment gateway). Accepting a proposal holds the proposal price; completing the project releases it to the freelancer. Un-accepting refunds held funds to the owner.

---

## Useful scripts

```bash
# Backend
cd backend && npm run dev      # development
cd backend && npm start        # production
cd backend && npm run seed -- --force

# Frontend
cd frontend && npm run dev     # development
cd frontend && npm run build   # production build
cd frontend && npm run preview # preview build
cd frontend && npm run lint    # lint
```
