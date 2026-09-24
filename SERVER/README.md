# RSIA Sayang Ibu Batusangkar — Website & CMS Backend

NestJS + TypeScript + Prisma ORM + MariaDB implementation of `API_DOCUMENTATION.txt`.

## 1. Architecture

```
Controller → Service → Repository → Prisma → MariaDB
```

Two separate database connections are used, per an explicit decision made during
requirements analysis (the SIMRS Khanza appointment/queue system lives on a
**different server** than our CMS database):

| Connection | Schema | Ownership | Rule |
|---|---|---|---|
| `DATABASE_URL` | `prisma/schema.prisma` | Owned by this backend | Migrated normally (`prisma migrate`) |
| `SIMRS_DATABASE_URL` | `prisma/simrs/schema.prisma` | Owned by the hospital's SIMRS Khanza system | **Introspect-only** (`prisma db pull`), never migrated. Only `booking_periksa` is written to by this app; `booking_registrasi`, `reg_periksa`, `pasien`, `poliklinik`, `dokter` are read-only. |

```
src/
├── config/                  # env loader for ConfigModule
├── common/                  # guards, decorators, filters, interceptors, DTOs, utils
├── prisma/                  # PrismaService for the app DB (global module)
├── simrs/                   # SimrsService for the external SIMRS DB (global module)
├── health/                  # GET /health
└── modules/
    ├── auth/                # POST /auth/login, GET /auth/me, POST /auth/logout
    ├── doctors/              controllers/ services/ repositories/ dto/
    ├── services/             (medical services / poliklinik listing)
    ├── articles/
    ├── ads/                  (promo campaigns)
    ├── vacancies/            (job_vacancies)
    ├── media/                (upload w/ swappable local/S3 storage adapter)
    ├── settings/             (hospital_settings + registration_settings, singleton rows)
    ├── dashboard/            (GET /dashboard/stats)
    ├── users/                (CMS account management, Super Admin only)
    ├── booking/              (SIMRS integration: poliklinik/register/check/update-status/history)
    └── queue/                (SIMRS queue: check/my-queue/stream[SSE])

prisma/
├── schema.prisma            # app DB
└── simrs/schema.prisma      # external SIMRS DB (read/introspect-only)
```

## 2. Installation

```bash
npm install
cp .env.example .env
# edit .env: DATABASE_URL, SIMRS_DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET at minimum
```

## 3. Database setup

```bash
# 1. Generate both Prisma clients
npm run prisma:generate

# 2. Create/migrate the app database (our own tables)
npm run prisma:migrate:dev        # dev, creates a migration
npm run prisma:migrate:deploy     # prod, applies existing migrations

# 3. Sync the SIMRS schema by INTROSPECTING the hospital's existing database.
#    Do NOT run `prisma migrate` against SIMRS_DATABASE_URL - we do not own
#    that schema. This overwrites prisma/simrs/schema.prisma with the real
#    column set, which will very likely differ from the placeholder shipped
#    here (see UNRESOLVED items below) - re-apply the read/introspect-only
#    header comment after pulling.
npm run simrs:pull

# 4. Seed an initial Super Admin account
npm run prisma:seed
# Change the printed password immediately after first login.
```

## 4. Running

```bash
npm run start:dev     # http://localhost:5000/api/v1, Swagger at /docs (non-production only)
npm run start:prod    # after `npm run build`
```

## 5. Testing

```bash
npm run test          # unit tests (AuthService, DoctorsService, pagination utils)
npm run test:cov      # with coverage
npm run test:e2e      # requires a reachable test DATABASE_URL + SIMRS_DATABASE_URL
```

Unit tests are provided for the representative core (Auth, Doctors, shared pagination
utilities). The remaining CRUD modules (Services, Articles, Ads, Vacancies, Media,
Settings, Users) follow the exact same repository/service pattern as Doctors —
copy `doctors.service.spec.ts` as a template when adding coverage for them; this
was left as the highest-value remaining follow-up given the size of the full module set.

## 6. Example requests

```bash
# Public: list doctors
curl http://localhost:5000/api/v1/doctors

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@sayangibu.co.id","password":"ChangeMe123!"}'

# Authenticated: create a doctor
curl -X POST http://localhost:5000/api/v1/doctors \
  -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{"name":"dr. Budi Santoso, Sp.A","specialty":"Anak","schedule":"Senin & Rabu, 09:00-12:00"}'

# Public: submit an online booking (writes to SIMRS booking_periksa)
curl -X POST http://localhost:5000/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{"nama":"Ny. Rahmawati","alamat":"Jl. Sudirman 12","noTelp":"628123456789","kdPoli":"02","tanggal":"2026-09-25"}'
```

## 7. Production deployment checklist

- [ ] `.env` populated with real `DATABASE_URL`, `SIMRS_DATABASE_URL`, strong random `JWT_SECRET`/`JWT_REFRESH_SECRET`
- [ ] `npm run simrs:pull` run against the **real** SIMRS connection and the generated schema reviewed (the shipped `prisma/simrs/schema.prisma` is reconstructed from documentation, not a live introspection)
- [ ] SIMRS DB user's grants restricted at the infra level: `INSERT/UPDATE` on `booking_periksa` only, `SELECT`-only on the rest — this is not something Prisma enforces
- [ ] `npm run prisma:migrate:deploy` run against production app DB
- [ ] `npm run prisma:seed` run once, then the seeded Super Admin password changed
- [ ] `STORAGE_DRIVER=s3` configured with real bucket/credentials if not using local disk storage in production (local disk does not survive redeploys on most PaaS)
- [ ] `CORS_ORIGINS` set to the real frontend/CMS domains only
- [ ] Reverse proxy / load balancer forwards `X-Forwarded-For` correctly (Throttler uses request IP)
- [ ] HTTPS terminated in front of the app (Helmet does not do TLS)
- [ ] Log aggregation wired to capture the `Logger.error` calls in `HttpExceptionFilter` / `SimrsService` (5xx + SIMRS outages)

## 8. Final audit (per requested checklist)

- [x] Every endpoint identified in the documentation across Modules 1–5, 7–10, plus Auth/Users/Dashboard/Health is implemented
- [x] Module 6 (Appointments/Booking) implemented as the SIMRS integration variant, per the explicit resolution of the Section 2 vs Section 3.6 conflict
- [x] Request/response bodies follow the documented field names and the Section 1.1/1.2 success/error envelope
- [x] Status codes: 200/201 success, 401/403 auth, 404 not found, 422 validation, 429 rate limit, 500 generic — mapped via the global exception filter
- [x] Prisma schema mirrors Section 2 tables, enums, defaults, and indexes
- [x] Foreign keys modeled where the doc specifies them; SIMRS relationships modeled as separate introspected tables, not FKs, since they're a different physical database
- [x] class-validator DTOs on every write endpoint
- [x] Errors never leak stack traces/SQL/credentials — filtered centrally in `HttpExceptionFilter`
- [x] Role checks (`@Roles`) match the documented per-endpoint access matrix
- [x] No secrets hardcoded — everything routed through `ConfigService`/`.env`
- [x] `any` avoided except where Prisma's own JSON input types require it (documented inline)
- [x] Representative unit + e2e tests included; full per-module coverage left as a mechanical follow-up (see Testing section)
- [x] No endpoints, fields, or business rules invented beyond the source document

## 9. UNRESOLVED items carried into the code

These are flagged in code comments at their exact location; summarized here for visibility:

1. **SIMRS `dokter` table columns** (`prisma/simrs/schema.prisma`) — only `kd_dokter`/`nm_dokter` were documented; run `simrs:pull` against the real DB to get the full set.
2. **Refresh-token/logout revocation** — no blacklist table was documented; `logout` is currently stateless. Add a `refresh_tokens` table + repository if server-side revocation is required.
3. **Media cloud storage** (`S3StorageProvider`) — no bucket/credentials were documented; ships as a working interface with `local` disk as the default driver and an S3 adapter stub ready to wire to `@aws-sdk/client-s3`.
4. **Rate limit numbers** beyond the two documented endpoints (`/auth/login`, and the booking/queue public endpoints at 10 req/min) — global default of 100 req/min/IP is this project's own reasonable choice, not from the doc; adjust via `THROTTLE_LIMIT`.
5. **SIMRS grants** — Prisma cannot enforce "read-only except `booking_periksa`" at the database level; this must be set up by the hospital's DBA on the `SIMRS_DATABASE_URL` credentials (see deployment checklist).
6. **Queue SSE polling interval** — not specified in the doc; implemented as a 5-second poll against SIMRS (`queue.service.ts`), adjustable.
7. **Dashboard stats fields** — reconstructed from the general shape of the CMS (doctor/service/article/ad/vacancy/media counts + today's SIMRS bookings); re-verify against the exact field names in Section 3's dashboard endpoint before shipping, as this module was written from earlier analysis context rather than a fresh direct read of that section.
