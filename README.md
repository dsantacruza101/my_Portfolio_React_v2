# Daniel Santacruz — Portfolio

A personal portfolio website built with React, TypeScript, Tailwind CSS, and Vite. It showcases projects, skills, and a contact form, with support for dark mode and English/Spanish languages.

---

## What's inside

- **Hero** — introduction and call-to-action
- **About** — background and experience summary
- **Skills** — technology stack overview
- **Projects** — cards linking to live demos and source code
- **Contact** — form with hCaptcha spam protection
- **Navbar** — smooth-scroll navigation with dark mode and language toggle

---

## Prerequisites

- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) + Docker Compose

---

## Getting started

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd my_Portfolio_React_v2
   ```

2. **Set up environment variables**

   ```bash
   cp .env.template .env
   ```

   Open `.env` and fill in your values (e.g. your hCaptcha site key).

3. **Build and run**

   ```bash
   docker compose up --build
   ```

   The app will be available at `http://localhost:8080`.

To stop the container:

```bash
docker compose down
```

---

## Running tests

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage
```

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
