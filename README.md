                    ┌──────────────────────┐
                    │      React UI         │
                    │   TypeScript + Vite   │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │   Node.js + Express   │
                    │    CORE BACKEND       │
                    │                      │
                    │ Auth                 │
                    │ Projects             │
                    │ Materials            │
                    │ Passports            │
                    │ Matching             │
                    │ GIS                  │
                    │ Cost calculation     │
                    │ Recommendations      │
                    └───────┬──────────────┘
                            │
                 ┌──────────┴──────────┐
                 │                     │
                 ▼                     ▼
        ┌────────────────┐    ┌────────────────┐
        │ PostgreSQL     │    │ AI Service     │
        │ + PostGIS      │    │    FUTURE      │
        │                │    │ Python/FastAPI │
        └────────────────┘    └────────────────┘
