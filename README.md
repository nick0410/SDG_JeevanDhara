# JeevanDhara

**SDG Verified Impact Platform**

JeevanDhara connects communities with verified NGOs working towards UN Sustainable Development Goals (SDGs). It features blockchain-based verification, AI-powered recommendations, and real-time project tracking for transparent, accountable social impact.

---

## Features

- **Explore Verified NGOs** — Browse NGOs filtered by SDG goals, location, and expertise
- **Submit Problems** — Report local issues with evidence uploads (images) and geo-tagging
- **Blockchain Verification** — On-chain impact proofs stored on Polygon for immutable transparency
- **AI Recommendations** — ML-powered matching of problems to the best-fit NGOs
- **Multi-Language Support** — English, Hindi, Spanish, French
- **MetaMask Integration** — Web3 wallet authentication
- **Dashboard** — Track your submitted projects, recommendations, and impact stats

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, TailwindCSS, Shadcn/UI |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL (Neon Serverless / Drizzle ORM) |
| Blockchain | Polygon Network (ethers.js) |
| AI/ML | OpenAI API for recommendations & content analysis |
| Auth | Session-based (extensible to JWT/OAuth) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- (Optional) PostgreSQL database URL

### Installation

```bash
git clone https://github.com/nick0410/SDG_JeevanDhara.git
cd SDG_JeevanDhara
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
DATABASE_URL=postgresql://...        # Optional — runs with in-memory storage if not set
SESSION_SECRET=your-secret-key
OPENAI_API_KEY=sk-...                # For AI recommendations
```

### Run Locally

```bash
# Windows PowerShell
$env:NODE_ENV="development"; npx tsx server/index.ts

# macOS / Linux
NODE_ENV=development npx tsx server/index.ts
```

Open [http://localhost:5000](http://localhost:5000)

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── client/                # React frontend (Vite)
│   ├── src/
│   │   ├── components/    # UI components (Header, Hero, AuthModal, etc.)
│   │   ├── pages/         # Route pages (home, explore, submit, verify, dashboard)
│   │   ├── hooks/         # Custom hooks (useAuth, useLanguage, etc.)
│   │   └── lib/           # Utilities
│   └── index.html
├── server/                # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database / in-memory storage layer
│   ├── db.ts              # Drizzle + Neon DB connection
│   └── services/          # Blockchain, OpenAI, Recommendations
├── shared/
│   └── schema.ts          # Drizzle ORM schema (PostgreSQL)
└── package.json
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ngos` | List all NGOs |
| POST | `/api/ngos` | Create an NGO |
| GET | `/api/projects` | List all projects |
| POST | `/api/projects` | Submit a new project |
| POST | `/api/blockchain/verify` | Verify impact on-chain |
| GET | `/api/statistics` | Platform stats |
| GET | `/api/recommendations/:id` | AI recommendations for a project |

## License

MIT
