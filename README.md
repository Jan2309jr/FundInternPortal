# FundRaise Pro - Intern Portal

A full-stack fundraising platform that allows interns to track donations, compete on leaderboards, and earn rewards based on their fundraising performance.

## Features

### 🎯 Core Features
- **Dashboard**: Personal fundraising metrics, recent donations, and rewards progress
- **Leaderboard**: Ranking system showing all interns' performance
- **Authentication**: Simple email-based login/signup system
- **Rewards System**: Unlockable achievements based on fundraising milestones
- **Referral Tracking**: Unique codes for each intern to track attribution

### 🛠️ Tech Stack
- **Frontend**: React with TypeScript, Vite
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI**: shadcn/ui components with Tailwind CSS
- **State Management**: TanStack Query
- **Routing**: Wouter

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fundraising-intern-portal.git
cd fundraising-intern-portal
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Add your database URL
DATABASE_URL=your_postgresql_connection_string
```

4. Set up the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Demo Data

The app comes with sample data including:
- 5 sample interns with different fundraising amounts
- Sample donations and rewards
- Test login: `sarah@example.com` (any password)

## Project Structure

```
├── client/src/           # React frontend
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   ├── lib/             # Utilities and query client
│   └── hooks/           # Custom React hooks
├── server/              # Express backend
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Database operations
│   └── db.ts           # Database connection
├── shared/              # Shared types and schemas
│   └── schema.ts        # Drizzle database schema
└── package.json         # Dependencies and scripts
```

## API Endpoints

- `POST /api/auth/login` - User authentication
- `POST /api/auth/signup` - User registration
- `GET /api/dashboard/:internId` - Dashboard data
- `GET /api/leaderboard` - Leaderboard rankings
- `GET /api/interns/by-email/:email` - Get intern by email

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).