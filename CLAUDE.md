# smartfluxsites — Project Context

## What this project is
This is the website for **smartflux sites**, a web services / website builder company.
It is a separate brand from **smartflux AI** (smartflux.ai), but shares the same name and visual theme.
The goal is to revamp this site from an AI company template into a website builder / web services company website.

## Tech stack
- Static HTML site with a custom SPA router (`router.js`)
- Tailwind CSS (compiled via `npm run build:css`)
- Firebase Hosting (project: `smartfluxsites`)
- Auto-deploys to Firebase on every push to `main` via GitHub Actions

## How to run locally
```bash
npm install
npm start
```
Site runs at http://127.0.0.1:8081

## Content structure
Pages live in `public/content/`. Each page has two versions:
- `page.html` — English version
- `page-nl.html` — Dutch version

## IMPORTANT — Translation workflow
**When making content changes, only update the Dutch (`-nl.html`) files first.**
Do NOT automatically update the English (`page.html`) versions at the same time.
The English versions will be updated separately once the Dutch version of the full site is finished and approved.

## Deployment
Push to `main` → GitHub Actions builds CSS and deploys to Firebase automatically.
Live URL: https://smartfluxsites.web.app
