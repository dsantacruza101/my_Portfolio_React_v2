# Daniel Santacruz — Portfolio

A personal portfolio website built with React, TypeScript, Tailwind CSS, and Vite. It showcases projects, skills, and a contact form, and supports both light/dark mode and multiple languages.

---

## What's inside

- **Hero** — introduction and call-to-action
- **About** — background and experience summary
- **Skills** — technology stack overview
- **Projects** — cards linking to live demos and source code
- **Contact** — form with hCaptcha protection that sends messages directly
- **Navbar** — smooth-scroll navigation with dark mode and language toggle (i18n)

---

## Prerequisites

- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) + Docker Compose

---

## Getting started

1. **Clone the repository**

   git clone <repo-url>
   cd my_Portfolio_React_v2

2. **Set up environment variables**

   Copy the provided template and fill in your values:

   cp .env.template .env

   Open `.env` and replace the placeholder values (e.g. your hCaptcha site key).

3. **Initialize submodules**

   git submodule update --init --recursive

4. **Build and run with Docker**

   docker compose up --build

   The app will be available at `http://localhost:8080`.

To stop the container:

docker compose down

---

## Building for production

npm run build

The optimized output goes into the `dist/` folder, ready to be served by any static host (Netlify, Vercel, Nginx, etc.).

To preview the production build locally:

npm run preview

---

## Running tests

# Run all tests
npm test

# Run tests with a coverage report
npm run test:coverage

---

## Project structure

```
src/
├── components/     # Page sections (Hero, About, Skills, Projects, Contact, Navbar)
├── data/           # Static content (projects list, skills, etc.)
├── hooks/          # Custom React hooks
├── i18n/           # Internationalization config and locale files
├── services/       # API/form submission logic
├── types/          # TypeScript type definitions
└── test/           # Test utilities and setup
```

---

## Tech stack

| Tool | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Dev server & bundler |
| Tailwind CSS v4 | Styling |
| Framer Motion | Animations |
| react-hook-form + Zod | Form validation |
| hCaptcha | Spam protection on the contact form |
| i18next | Internationalization |
| Vitest | Unit testing |
| Docker + Nginx | Production container |
