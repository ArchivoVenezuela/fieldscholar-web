# FieldScholar public website

Public marketing site for **FieldScholar — A Global Learning Companion**.

This repository is separate from the FieldScholar application (`../fieldscholar`).

| Surface | URL | Repository |
| --- | --- | --- |
| Application | https://fieldscholar.app | `fieldscholar` |
| Public website | https://about.fieldscholar.app | `fieldscholar-web` |

## Local development

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

Static output for Firebase Hosting: `dist/client/`

## Deployment

Deploy **only** the marketing Hosting target. Never run an unscoped `firebase deploy`.

```bash
npm run deploy:marketing
```

That command runs `npm run build` and then:

```bash
firebase deploy --only hosting:marketing
```
