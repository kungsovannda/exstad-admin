<p align="center">
  <img src="https://www.exstad.tech/_next/image?url=%2Fimage%2Flogo%2FexSTAD-01.png&w=128&q=75" width="120" alt="Exstad Logo"/>
</p>

<h1 align="center">✨ Exstad Admin — Powering the Minds Behind Learning</h1>

<p align="center">
  <sub>
    Exstad Admin is the intelligent admin & instructor panel for the Exstad Learning Platform — built to manage programs, scholars, instructors, and institutions with precision and modern design.
  </sub>
</p>

---

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-core-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-architecture">Architecture</a> •
  <a href="#-author--credits">Author</a>
</p>

---

## 🧭 Overview

Exstad Admin is the command center for the Exstad Learning Platform — designed for admins and instructors to manage enrollments, programs, scholars, and institutional data with clarity and speed. It brings together automation, analytics, and a curated UI to make complex academic workflows intuitive and reliable.

---

## 🚀 Core Features

- 🧾 Enrollment Flow — Track, verify, and approve enrollments across programs and intakes with clear status indicators and approval workflows.
- 🧩 Program Builder — Create programs, curriculums, and roadmaps; assign instructors and schedule classes.
- 🧠 Scholar Hub — View and manage scholar profiles, achievements, verifications, and history in one place.
- 🏅 Achievement Center — Define badges and awards, assign them automatically or manually, and publish recognitions.
- 📜 Certificate Studio — Auto-generate and export certificates with customizable templates and data binding.
- 👥 Role & Access Control — Granular roles for Admins, Instructors, and staff powered by NextAuth.
- ⚙️ System Configuration — Manage institutions, addresses, enrollment sources, and foundational data.
- 📊 Analytics & Reports — Built-in charts and exports (Excel/PDF) for auditing and decision support.
- 🔔 Notifications — Real-time UI notifications for important events and approvals.

---

## 🧪 Tech Stack

| Layer                      | Technology                                                                                                      |
| -------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Framework                  | [Next.js 15](https://nextjs.org/) (App Router + Turbopack)                                                      |
| Language                   | [TypeScript 5](https://www.typescriptlang.org/)                                                                 |
| Styling                    | [TailwindCSS 4](https://tailwindcss.com/) + PostCSS                                                             |
| UI                         | [Radix UI](https://www.radix-ui.com/), [Shadcn UI](https://ui.shadcn.com/), [Lucide Icons](https://lucide.dev/) |
| State & Data               | [Redux Toolkit](https://redux-toolkit.js.org/), [React Query](https://tanstack.com/query)                       |
| Forms & Validation         | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)                                        |
| Auth                       | [NextAuth.js](https://next-auth.js.org/)                                                                        |
| Rich Text                  | [Lexical Editor](https://lexical.dev/)                                                                          |
| Charts & Flow              | [Recharts](https://recharts.org/), [ReactFlow](https://reactflow.dev/)                                          |
| Export & Files             | ExcelJS, FileSaver, PDF.js, Xlsx                                                                                |
| Notifications & Animations | Sonner, Vaul, tw-animate-css                                                                                    |

---

## 🛠 Getting Started

Prerequisites:

- Node.js v18+
- npm / yarn / pnpm

Quick start:

```bash
# clone
git clone https://github.com/kungsovannda/exstad-admin.git
cd exstad-admin

# install
npm install

# run dev
npm run dev

# build for production
npm run build
npm run start
```

Open http://localhost:3000 to view the app during development.

Environment:

- Create a .env.local from the example in the repo and provide NextAuth credentials, API endpoints, and any required keys.

Tips:

- Use Turbopack for fast local reloads.
- Run lint and type checks before pushing: npm run lint && npm run type

---

## 🗂 Project Architecture

```
exstad-admin/
├── src/
│   ├── app/                 # App router (Next.js 15)
│   ├── components/          # UI Components (Radix + Shadcn)
│   ├── features/            # Feature modules (Enrollment, Scholar, Program)
│   ├── hooks/               # Reusable logic
│   ├── lib/                 # Utilities, constants, helpers
│   ├── store/               # Redux Toolkit + Persist
│   └── styles/              # Tailwind / global CSS
│
├── public/                  # Assets
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── tsconfig.json
└── package.json
```

Short descriptions:

- src/app/: Routing + layouts and server/client components.
- src/components/: Shared UI primitives and composed components.
- src/features/: Domain-specific modules with slices, hooks and routes.
- src/hooks/: Small reusable hooks used across features.
- src/lib/: Helpers, API clients, adapters, and constants.
- src/store/: Redux Toolkit store, slices, and persist config.
- src/styles/: Tailwind configuration and global styles.

---

## ⚡ Scripts

| Command       | Description                          |
| ------------- | ------------------------------------ |
| npm run dev   | Start development server (Turbopack) |
| npm run build | Build for production                 |
| npm run start | Run production server                |
| npm run lint  | Run ESLint checks                    |
| npm run type  | Run TypeScript type checks           |
| npm run test  | Run unit tests (if configured)       |

---

## 💡 Vision

A beautifully crafted admin experience can change how education is managed. Exstad Admin aims to take the friction out of administration so educators can focus on what matters most: designing meaningful learning experiences. We build tools that are thoughtful, fast, and reliable — designed for people who care about learning.

<p align="center">
  <img src="https://admin.exstad.tech/preview.png" alt="Exstad Admin Preview" width="80%"/>
</p>

---

**🧠 Exstad Admin — Control Learning, Not Chaos.**
