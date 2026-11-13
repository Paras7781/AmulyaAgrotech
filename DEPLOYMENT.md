# Free deployment preparation checklist

This project is prepared for a Render Blueprint with a static frontend, a free
FastAPI web service, Neon PostgreSQL, and an optional Resend HTTPS email API.
This file and `render.yaml` configure a deployment but do not create services,
publish code, or send email.

## What is already prepared

- `render.yaml` defines the Render service roots, build/start commands, health
  endpoint, and an SPA rewrite to `/index.html` for React Router refreshes.
- `DATABASE_URL` accepts SQLite locally and normalizes Neon/Postgres URLs to the
  installed `psycopg` v3 driver.
- Successful new quotation submissions are stored in the additive
  `public_quotation_requests` table so their PDFs can be regenerated after
  backend restarts. Contact submissions remain email-only.
- SMTP remains the default local email transport. The optional Resend transport
  sends through HTTPS and does not require SMTP credentials.
- Production settings continue to reject mock email mode and require HTTPS
  origins in `ALLOWED_ORIGINS`.
- Environment files, local SQLite databases, virtual environments, dependency
  directories, caches, and build outputs are ignored by Git.

## Manual environment configuration

Configure these values in Render's environment-variable prompts/dashboard. Do
not put real values in `render.yaml` or commit them.

### FastAPI web service

| Variable | Required value |
|---|---|
| `ENVIRONMENT` | `production` (set by `render.yaml`) |
| `DATABASE_URL` | Neon connection string, preferably the pooled connection string; keep its TLS requirement (commonly `sslmode=require`) |
| `ALLOWED_ORIGINS` | Exact deployed frontend origin, e.g. `https://your-site.onrender.com`; comma-separate any additional HTTPS origins, with no paths |
| `EMAIL_PROVIDER` | `resend` (set by `render.yaml`); use `smtp` only where outbound SMTP is allowed |
| `RESEND_API_KEY` | Secret API key created in your Resend account |
| `EMAIL_FROM` | Sender address/name on a sending domain verified with the email provider |
| `NOTIFICATION_EMAIL` | Business inbox that receives enquiry and quotation notifications |
| `SMTP_MOCK_MODE` | `false` (set by `render.yaml`; do not change in production) |

Render's free web-service plan blocks outbound SMTP on ports 25, 465, and 587,
so the existing Gmail SMTP transport will not work from that plan. The
optional Resend API transport uses HTTPS. Resend currently lists a free
transactional-email plan with daily and monthly limits; check its current
pricing and verify your sending domain before relying on it:
[Render free-instance limits](https://render.com/docs/free),
[Resend send-email API](https://resend.com/docs/api-reference/emails/send-email),
[Resend pricing](https://resend.com/pricing).

### Static frontend

| Variable | Required value |
|---|---|
| `VITE_API_BASE_URL` | HTTPS origin of the deployed FastAPI service, e.g. `https://your-api.onrender.com` |

Vite embeds this value at build time. After changing it in Render, trigger a new
static-site build. Configure the exact resulting frontend origin in the
backend's `ALLOWED_ORIGINS` setting and redeploy/restart the backend.

## Database and existing SQLite data

- The repository contains two local SQLite files: `amulya.db` at the repository
  root and `backend/amulya.db`. They are ignored by Git and were not changed.
- A read-only count found legacy rows in both files. The app's current public
  contact workflow remains email-only. New successful quotation submissions
  are stored in `public_quotation_requests`, not in the legacy `enquiries` or
  `quotations` tables.
- On startup, `Base.metadata.create_all()` creates missing SQLAlchemy tables;
  it does not migrate or alter existing schemas. There is no Alembic migration
  setup. This creates the new quotation table additively; it does not migrate
  any legacy SQLite rows.
- Setting Neon as `DATABASE_URL` does not copy either SQLite file or its rows.
  If legacy rows must be retained in Neon, first make private backups and plan
  a separately reviewed, verified migration. No data migration is included
  here. Do not point the deployed service at a local SQLite file: Render free
  web-service filesystems are ephemeral.

## Before connecting a Git repository or deploying

- [ ] Confirm that both local SQLite databases have backups stored outside Git.
- [ ] Decide whether the legacy SQLite records need migration to Neon; do not
  assume they will be copied automatically.
- [ ] Define a retention and deletion policy for the personal details in new
  quotation records, and plan database backups before accepting production
  submissions.
- [ ] Create/configure Neon and copy its connection string directly into the
  Render `DATABASE_URL` secret field.
- [ ] If using the HTTPS email API, create an account, verify a sending domain,
  create an API key, and configure `RESEND_API_KEY`, `EMAIL_FROM`, and
  `NOTIFICATION_EMAIL`. No email has been sent as part of this preparation.
- [ ] After Render assigns service URLs, set `VITE_API_BASE_URL` and
  `ALLOWED_ORIGINS` to the corresponding HTTPS origins, then rebuild/redeploy.
- [ ] Test health, CORS preflight, direct page refreshes, and a deliberately
  mocked email transport in a non-production environment. Only test actual
  delivery when authorized.
- [ ] Review the Git status and ensure no `.env`, database, secret, or generated
  files are staged. The nested frontend Git metadata was preserved outside the
  project workspace after verifying that it had no commits or remotes. The
  root is now the sole repository, but it has no commits or remotes; all
  project files remain unstaged. `/Microsoft/` is explicitly ignored.

## Free-tier operational limits

Render documents that free web services spin down after inactivity, have
ephemeral filesystems, and are not intended for production applications. Neon
Free also scales its compute to zero. Expect a cold-start delay and validate
current provider quotas, backup/retention, and service limits before using this
setup for real customer traffic. In-memory rate limiting, duplicate
suppression, and quotation-PDF state are process-local and are not durable.
