# Visa Overstay Application

App built to track your trips and determine the length of time you have spent within the uk or eu etc.

## Tech Stack

- **Framework**: Next.js 15.1.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Neon (PostgreSQL)
- **ORM**: Drizzle ORM
- **Authentication**: NextAuth.js
- **UI Components**: Radix UI
- **Form Handling**: React Hook Form with Zod validation
- **Testing**: Jest

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- pnpm package manager
- PostgreSQL database (Neon recommended)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd visa-overstay
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Fill in the required environment variables in the `.env` file.

4. Run the development server:
```bash
pnpm dev
```

prod available at https://visa-overstay.vercel.app
