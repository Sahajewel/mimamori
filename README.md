<div align="center">

# ♡ Mimamori（見守り）

### A family eldercare platform for Japan — keeping distant families connected to their aging loved ones.

[![Live](https://img.shields.io/badge/Live-mimamori--health.vercel.app-4F46E5?style=for-the-badge)](https://mimamori-health.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

*Built solo, end to end — from database schema to production PWA.*

</div>

---

## 📖 The problem

Japan is the world's most aged society — over 29% of the population is 65 or older, and a growing number live alone while their children live far away. Families worry: *Is Mom okay today? Did Dad take his medicine? Who do I call in an emergency?*

**Mimamori** turns that daily worry into quiet reassurance. An elderly parent taps one large button once a day; the whole family sees it instantly. No account, no password, no learning curve for the senior — just a single icon on their home screen.

---

## ✨ Key features

| For the senior (no login) | For the family |
|---|---|
| 🟢 One-tap daily check-in (元気 / 気になる / 助けて) | 📊 Shared dashboard across all family members |
| 💊 Medicine reminders & one-tap logging | 🔔 Real-time push notifications (emergency, missed meds, refills) |
| 📱 Home-screen icon via QR — no app store, no login | 💬 Family chat & care notes per senior |
| | 📧 Weekly email summary of check-ins & medication |

**What makes it work for elderly users:** the senior's page is reachable through a stable QR/home-screen link that needs *no authentication*. They never see a login screen — they open an icon and press a big colored button. Everything they do reaches the family in real time.

---

## 🛠️ Tech stack

**Framework** · Next.js 15 (App Router, Server Components, Server Actions)
**Language** · TypeScript (end to end, strict)
**Database** · PostgreSQL (Neon) with Prisma ORM
**Auth** · NextAuth v5 (JWT sessions, credentials, bcrypt, email verification)
**Styling** · Tailwind CSS
**Notifications** · Web Push API + Service Worker (VAPID, `web-push`)
**PWA** · Installable, offline-aware, custom pre-hydration loader
**Deployment** · Vercel (CI/CD on push)

---

## 🏗️ Architecture highlights

Things I designed carefully and would be happy to walk through in an interview:

- **Dual role model** — a global `Role` (family / caregiver / admin) plus a per-senior `SeniorMemberRole` (owner / editor / viewer), so permissions are scoped to each elderly person rather than the whole app.
- **Authless senior access** — a stable `quickToken` per senior powers the QR / home-screen link. Tokens are generated once and reused (so saved icons never break), with a guarded, two-step regenerate flow for when a link is compromised.
- **Real-time push pipeline** — check-ins, missed medicine, refill reminders and emergencies each route to a purpose-built page. A service worker handles notification clicks and drives in-app navigation reliably across desktop and mobile PWA, including the logged-out → login → original-destination flow.
- **Data survives deletion** — check-ins, care notes and medicine logs store an `authorName` snapshot, so history stays intact and readable even after a member deletes their account (`onDelete: SetNull`).
- **Security per route** — every API route enforces auth → membership (`findFirst`, not `findUnique`, to prevent IDOR) → role check for writes.
- **Admin panel** — a role-gated `/admin` dashboard with live usage stats (users, seniors, check-ins, emergencies) and test-account filtering, built for monitoring a real-world pilot.
- **Japan-first details** — all times computed in `Asia/Tokyo`, Japanese-language UI with furigana-friendly rendering, and a QR/home-screen onboarding designed for elderly Japanese users.

---

## 📊 Data model (overview)

```
User ──< SeniorMember >── Senior ──< CheckIn
                            │        ├─< Medicine ──< MedicineReminder ──< MedicineLog
                            │        ├─< CareNote
                            │        ├─< Message (family chat)
                            │        └─< Invitation
User ──< PushSubscription
```

A `Senior` is the center of the graph; family members connect to it through `SeniorMember` with scoped roles. Everything a senior does (check-ins, medicine logs) hangs off the `Senior`, while family collaboration (chat, notes, invitations) is scoped per senior too.

---

## 🚀 Getting started

```bash
# 1. Clone & install
git clone https://github.com/Sahajewel/mimamori.git
cd mimamori
npm install

# 2. Environment (.env)
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_VAPID_PUBLIC_KEY="..."
VAPID_PRIVATE_KEY="..."
VAPID_MAILTO="mailto:you@example.com"

# 3. Database
npx prisma migrate dev

# 4. Run
npm run dev
```

---

## 🌱 Status & roadmap

Mimamori is in an **early real-world pilot** — currently being introduced to local elderly-support centers (地域包括支援センター) and day-care services in Saitama.

Planned next: SMS/voice escalation for emergencies that outlives silent-mode phones, usage analytics in the admin panel, and subsidy-backed rollout.

---

## 👤 Author

**Saha Jewel Kumar** — Full-Stack Developer, based in Saitama, Japan (9+ years).
Designed, built, and shipped Mimamori solo — product, database, backend, frontend, and PWA.

[Portfolio](https://sahajewelkumar.vercel.app) · [GitHub](https://github.com/Sahajewel) · [LinkedIn](https://www.linkedin.com/in/sahajewelkumar)

---

<div align="center">
<sub>Built with care for families who watch over each other from afar.</sub>
</div>
