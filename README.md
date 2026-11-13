# AMULYA AGROTECH — AGRICULTURAL DRONE TECHNOLOGY PLATFORM

Amulya Agrotech (P) Ltd is a precision agricultural drone and services platform based in Kolhapur, Maharashtra, India. The application features a responsive React + TypeScript frontend with an interactive illustrated agricultural landscape, full trilingual support (English, Hindi, Marathi), dark and light theme toggling, and an asynchronous Python/FastAPI backend backed by SQLAlchemy and SQLite/PostgreSQL.

---

## 1. Technology Stack

- **Frontend**:
  - React 18 + TypeScript
  - Vite 6
  - Tailwind CSS 3
  - React Router DOM v7
  - Custom Context (Language & Theme)
  - Lucide React Icons
- **Backend**:
  - Python 3.11 / 3.12
  - FastAPI 0.115
  - Pydantic v2 & Pydantic-Settings
  - SQLAlchemy 2.0 ORM
  - ReportLab (Quotation Estimate PDF Generation)
  - SQLite (Default development/local storage: `amulya.db`)
  - PostgreSQL (Supported for production via `psycopg[binary]`)
  - Pytest + HTTPX for API testing

---

## 2. Repository Structure

```
Mama/
├── frontend/
│   ├── public/
│   │   ├── assets/              # Company logos, branding seals, agricultural photos
│   │   ├── robots.txt           # Search crawler directives
│   │   └── sitemap.xml          # Search engine sitemap
│   ├── src/
│   │   ├── api/                 # Centralized API client (Contact & Quotation endpoints)
│   │   ├── components/
│   │   │   ├── common/          # Button, Container, ThemeToggle, SectionHeading
│   │   │   ├── drones/          # Drone cards & comparison grids
│   │   │   ├── home/            # Hero, FeatureStrip, IntroSection, InteractiveFarm, etc.
│   │   │   │   └── InteractiveFarm/ # 6-Landmark SVG Landscape, Pins, Detail Panel & Grid
│   │   │   └── layout/          # Navbar, Footer, PublicPage wrapper
│   │   ├── data/                # Agricultural dataset, real media mappings, specs
│   │   ├── i18n/                # Language context, translations dictionary (EN, HI, MR)
│   │   ├── pages/               # Home, About, Drones, DroneDetail, Services, Subsidy,
│   │   │                        # Gallery, Contact, Quotation, NotFound
│   │   ├── App.tsx              # React Router v7 routes & intersection observer
│   │   ├── main.tsx             # Application bootstrap
│   │   ├── styles.css           # Global typography, tokens, animations
│   │   └── ThemeContext.tsx     # Dark/Light theme provider with localStorage sync
│   ├── .env.example             # Frontend environment template
│   ├── package.json
│   └── vite.config.ts
│
├── amulya.db                    # Local SQLite file (location depends on backend working directory)
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py        # Pydantic settings & environment configuration
│   │   │   └── notifications.py # Safe, optional SMTP email notification dispatch
│   │   ├── database.py          # SQLAlchemy models (Enquiry, Quotation, Drone) & DB engine
│   │   ├── main.py              # FastAPI application, CORS, public endpoints, PDF generator
│   │   └── schemas.py           # Pydantic v2 request/response schemas & validation
│   ├── requirements.txt         # Python dependencies
│   ├── test_main.py             # Pytest automated test suite
│   └── .env.example             # Backend environment template
│
└── README.md                    # Project documentation
```

The database URL defaults to `sqlite:///./amulya.db` and is resolved from the backend process working directory. Running from the repository root creates `amulya.db` there; running from `backend/` creates `backend/amulya.db`. Use a consistent working directory or configure an absolute database URL to avoid opening a different local database.

---

## 3. Public Routes & Navigation

The public application supports the following routes:

| Route | Description |
|---|---|
| `/` | Homepage featuring Hero, Feature Strip, Interactive Farm Experience, Showcase, Services, and Testimonials |
| `/about` | Company mission, story, agricultural values, operational capabilities, and fleet approach |
| `/drones` | Fleet catalog with category filters and product cards |
| `/drones/:id` | Detailed drone profile, technical specifications, included services, and FAQ |
| `/services` | Precision spraying, crop monitoring, field mapping, consultation, and operator training |
| `/subsidy` | Agricultural drone subsidy guidance, eligibility framework, required documents checklist |
| `/gallery` | Real field photography archive across drone flights, crop spraying, and field work |
| `/contact` | Verified office address, phone lines, operating hours, and inquiry submission form |
| `/quotation` | 5-Step interactive quotation wizard with backend reference generation |
| `*` | Branded 404 Not Found page directing visitors safely back to Home or Contact |

---

## 4. Interactive Agricultural Experience

Located on the Homepage after the Feature Strip, the **"Explore the World of Amulya"** component is an illustrated modern agricultural ecosystem featuring:
- **Illustrated Landscape**: Vector SVG depicting crop rows, terrace contours, irrigation canals, weather stations, solar pavilions, and a hovering agricultural drone.
- **6 Navigation Landmarks**:
  1. `01 / DRONE FLEET` -> `/drones`
  2. `02 / PRECISION SPRAYING` -> `/services`
  3. `03 / FIELD OPERATIONS` -> `/services`
  4. `04 / SUBSIDY GUIDANCE` -> `/subsidy`
  5. `05 / FARM GALLERY` -> `/gallery`
  6. `06 / REQUEST A QUOTATION` -> `/quotation`
- **Interactivity**:
  - Desktop: Hovering highlights landmark beacons and displays name chips; clicking docks a comprehensive information panel with real photography preview and direct "Explore" button. <kbd>Esc</kbd> closes open panels.
  - Mobile/Tablet: Touch-accessible pins plus an expansive, accessible landmark grid directly beneath the landscape for seamless navigation on touchscreens.

---

## 5. Multilingual & Theme Systems

### Multilingual Support (EN / HI / MR)
- Supported languages: English (`en`), Hindi (`hi`), Marathi (`mr`).
- Driven by `LanguageProvider` with persistent `localStorage` key (`amulya-language`).
- Translates every user-visible string including navigation, heroes, interactive landscape, forms, validation messages, and dynamic data getters.

### Theme System (Dark / Light)
- Driven by `ThemeProvider` (`data-theme="dark"` / `data-theme="light"`).
- Persisted in `localStorage` (`amulyagrotech-theme`).
- Custom SVG styling responds to theme changes (e.g. dawn/daylight palette vs twilight/deep green palette).

---

## 6. Backend API, Email Notifications & Quotation PDFs

### Submission and PDF data
- **Contact enquiries remain email-only**: Contact submissions are not written to database tables.
- **Quotation PDF recovery**: After email dispatch succeeds, new quotation request details are stored in `public_quotation_requests` so the PDF can be regenerated after a backend restart. Existing `enquiries` and `quotations` records are not modified or migrated.
- **Dual Email Notification**:
  1. **Business Notification**: Instant dispatch to `NOTIFICATION_EMAIL` containing full enquiry/quotation details.
  2. **Customer Confirmation**: A confirmation email is sent when a customer email is supplied and the delivery succeeds.
- **No Fake Success**: If SMTP is not configured (and mock mode is disabled), the backend honestly returns HTTP 503 instead of pretending success.
- **PDF Download**: `/api/quotations/{reference_number}/pdf` uses a bounded in-memory cache and falls back to the persisted quotation payload and then historical quotation records.
- **Absolute Privacy**: No admin dashboards, panels, logins, or public record listing endpoints exist.
- **Database Preservation**: Existing drone catalog records and database structures are preserved.

The quotation payload includes customer details and is stored in the configured database. The contact form remains email-only.

### Public REST Endpoints

1. `GET /api/health`
   - Returns service status, company name, and email delivery mode (`mock`, `configured`, or `unconfigured`).

2. `POST /api/contact` (also aliased as `/api/enquiries`)
   - Accepts customer name, phone, optional email, location, service, and message.
   - Validates Indian mobile number format (`^[6-9]\d{9}$`).
   - Dispatches business notification and customer confirmation.
   - Returns a high-entropy reference number beginning `AMC-YYYY-`.

3. `POST /api/quotations`
   - Accepts customer name, phone, email, need, drone selection, land area, crop, timeline, and notes.
   - Dispatches business notification and customer confirmation with a high-entropy reference number beginning `AMQ-YYYY-`.

4. `GET /api/quotations/{reference_number}/pdf`
   - Streams an A4 quotation estimate PDF generated on the fly via ReportLab.

5. `GET /api/drones`
   - Read-only catalog of active agricultural drones.

### Privacy & Security
- **No Admin Interfaces**: By architecture and requirement, no admin logins, dashboards, or role managers exist.
- **No Public Customer Data Leaks**: `GET /api/contact` and `GET /api/quotations` return 405 Method Not Allowed; customer personal information cannot be queried publicly.
- **Data handling**: Contact enquiries are email-only. New quotation details required to regenerate PDFs are stored in `public_quotation_requests`; there is no public listing endpoint. PDF references are high entropy, but should still be treated as private links.
- **Input validation**: Request lengths, email format, Indian mobile numbers, and email-header fields are validated on the server.
- **Abuse prevention**: Contact and quotation POST routes are limited to 10 requests per client IP per 60 seconds by default. This in-memory limit is per backend process; configure equivalent edge-proxy/WAF throttling for multi-worker or multi-instance deployments.
- **Reference privacy**: New quotation references use 128 bits of randomness. PDF downloads are non-cacheable and references in the legacy format remain accepted for existing records.
- **Production configuration**: Mock email mode is disabled in production, and production CORS origins must be HTTPS. Set `ALLOWED_ORIGINS` explicitly before deployment.
- **Operational limitations**: Rate limiting and duplicate suppression remain process-local. PDF downloads can be regenerated from the configured database across worker restarts. No quotation-data retention schedule is configured; establish one and backups before production use.

---

## 7. Development Setup & Execution

### Prerequisites
- Node.js 18+ and npm
- Python 3.11 or 3.12

### Frontend Setup
```bash
cd frontend

# Install packages
npm install

# Start development server (http://localhost:5173)
npm run dev

# Run production build
npm run build

# Preview production build
npm run preview
```

### Backend Setup
```bash
cd backend

# Create virtual environment (if not already created)
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt pytest httpx

# Run automated tests
pytest -v test_main.py

# Start FastAPI server (http://localhost:8000)
uvicorn app.main:app --reload --port 8000
```

FastAPI Interactive API Documentation will be available at:
`http://localhost:8000/docs`

---

## 8. Deployment Preparation

Render static-site and FastAPI service configuration, manual environment
variables, Neon migration caveats, Git safety findings, and free-tier
limitations are documented in [DEPLOYMENT.md](./DEPLOYMENT.md). No deployment
or email delivery is performed by this repository configuration.

The backend defaults to SQLite for local development and accepts a Neon
PostgreSQL connection string through `DATABASE_URL`. Contact enquiries remain
email-only; successful new quotation requests are stored in
`public_quotation_requests` for PDF regeneration. Existing local SQLite rows
are not migrated automatically.

### Local database default
The backend uses SQLite for local development:
```env
  DATABASE_URL=sqlite:///./amulya.db # Or postgresql+psycopg://user:password@host:5432/amulyadb
  ```
