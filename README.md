# AI Portfolio Manager

A comprehensive personal finance command center with AI-powered trading, multi-model competition, and complete financial oversight.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## Overview

This project combines portfolio management, AI-driven trade analysis, and personal finance tracking into a single unified dashboard. Originally built as a trading assistant, it has evolved into a full financial command center that tracks net worth, analyzes debt payoff strategies, and even runs AI model competitions.

### Key Highlights

- **Multi-Agent AI System** - Research, analysis, and decision agents work together
- **AI Trading Arena** - Watch Claude, GPT-4, Grok, and Gemini compete with virtual portfolios
- **Complete Financial Picture** - Track investments, crypto, partnerships, debts, and calculate true net worth
- **Spending Tracker** - Connect bank accounts via Plaid for transaction analysis and subscription detection
- **Intelligent Advisor** - Get personalized recommendations on debt vs. investing decisions

## Features

### Portfolio Management
- Real-time portfolio dashboard with performance charts
- Holdings table with P&L tracking
- Quick trade execution via Alpaca paper trading API
- Trade history with auto/manual indicators

### AI Trade Suggestions
- Configurable risk tolerance (conservative/moderate/aggressive)
- Sector preference filtering
- Confidence scores with detailed reasoning
- Technical, fundamental, and sentiment analysis

### Auto-Trading System
- Automated execution based on confidence thresholds
- Circuit breaker for daily loss limits
- Maximum position size controls
- Trade frequency limits

### Research Agent Pipeline
Multi-stage AI analysis system:
1. **Research Agent** - Gathers news, filings, analyst data, social sentiment
2. **Analysis Agent** - Calculates composite scores across multiple factors
3. **Decision Agent** - Generates Buy/Sell/Hold recommendations with confidence levels

### AI Trading Arena
Compare trading strategies across different AI personalities:

| Model | Provider | Trading Style |
|-------|----------|---------------|
| Claude | Anthropic | Balanced & Thoughtful |
| GPT-4 | OpenAI | Aggressive Growth |
| Grok | xAI | Contrarian & Bold |
| Gemini | Google | Data-Driven Conservative |

Each AI starts with $100k and makes decisions based on its unique personality. Track performance, win rates, and see decision reasoning in real-time.

### Net Worth Overview
- **Assets**: Investment accounts, retirement (IRA/401k), checking, savings, crypto (Ledger), investment partnerships
- **Liabilities**: Mortgages, student loans, auto loans, credit cards with interest rates
- **True Net Worth**: Assets minus liabilities calculation
- Data persists via localStorage

### AI Financial Advisor
- Financial health score (0-100)
- Prioritized recommendations based on your complete picture
- Debt payoff strategy analysis (avalanche vs. snowball method)
- Investment opportunity suggestions (Roth IRA, I-Bonds, diversification)

### Periodic Digests
Generate daily, weekly, monthly, or quarterly summaries including:
- Net worth changes
- Top gainers and losers
- Action items
- Key insights

### Spending Tracker (Plaid Integration)
Connect your bank accounts and credit cards for comprehensive spending analysis:
- **Transaction Import** - Automatically pull transactions from connected accounts
- **Category Analysis** - See spending breakdown by category with visual charts
- **Top Merchants** - Identify where you spend the most
- **Subscription Detection** - Find recurring charges and subscriptions
- **Daily Spending Charts** - Visualize spending patterns over time
- **Search & Filter** - Find specific transactions quickly

### Joint Finance (Multi-User)
Share your financial dashboard with your spouse or family:
- **User Authentication** - Secure login with email/password
- **Household Sharing** - Create or join a household with a 6-character code
- **Shared Data** - All accounts, debts, budgets, and settings sync automatically
- **Real-time Sync** - Changes by one user appear for all household members
- **Member Management** - See who's in your household

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: React 18, Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Auth**: NextAuth.js with credentials provider
- **Trading API**: Alpaca (paper trading)
- **Banking API**: Plaid (transactions, balances, recurring)
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Alpaca account (free, for paper trading)

### Installation

```bash
# Clone the repository
git clone https://github.com/Crawnicles/ai-portfolio-manager.git
cd ai-portfolio-manager

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Alpaca API Setup

1. Create a free account at [alpaca.markets](https://alpaca.markets)
2. Switch to **Paper Trading** mode in your dashboard
3. Generate API keys from the API Keys section
4. Enter keys in the app (paper trading only - no real money at risk)

### Plaid API Setup (Optional - for Spending Tracker)

1. Create a free account at [dashboard.plaid.com](https://dashboard.plaid.com/signup)
2. Get your Client ID and Secret from the Keys section
3. Use **Sandbox** mode for testing (no real bank connections)
4. Sandbox test credentials: `user_good` / `pass_good`
5. Upgrade to Development/Production for real bank connections

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Crawnicles/ai-portfolio-manager)

Or manually:

```bash
npm i -g vercel
vercel
```

## Project Structure

```
app/
├── page.js                    # Main application (3000+ lines)
├── layout.js                  # Root layout
├── globals.css                # Global styles
├── api/alpaca/
│   ├── account/route.js       # Account data proxy
│   ├── positions/route.js     # Positions proxy
│   ├── orders/route.js        # Orders proxy
│   ├── trade/route.js         # Trade execution
│   ├── news/route.js          # News & sentiment
│   ├── research/route.js      # Multi-agent research pipeline
│   ├── digest/route.js        # Periodic digest generation
│   ├── advisor/route.js       # AI financial advisor
│   ├── ai-competition/route.js # AI arena competition
│   └── partnership/route.js   # Partnership dashboard API
└── api/plaid/
    ├── create-link-token/route.js  # Initialize Plaid Link
    ├── exchange-token/route.js     # Exchange tokens
    ├── transactions/route.js       # Fetch transactions
    ├── balances/route.js           # Account balances
    ├── recurring/route.js          # Subscription detection
    └── budget-analysis/route.js    # Smart budgeting & insights
├── api/auth/
│   └── [...nextauth]/route.js      # NextAuth.js authentication
├── api/household/
│   └── route.js                    # Household data sync
└── providers.js                    # Session provider wrapper
```

## Roadmap

### ✅ Completed
- Phase 1: Auto-trading with safety limits
- Phase 2: Research agent pipeline
- Phase 3: Net worth overview & digests
- Phase 4: Crypto, partnerships, debts, AI advisor
- Phase 5: Multi-model AI arena
- Phase 6: Partnership dashboard (quarterly reports)
- Phase 7: Plaid bank integrations & spending tracker
- Phase 8: Smart categorization & budgeting
- Phase 9: Joint finance (multi-user authentication)

### 📋 Planned
- Phase 10: Trip & event expense tracking
- Phase 11: Cost-benefit analysis engine
- Phase 12: Cash flow forecasting
- Phase 13: Portfolio analytics (attribution, risk metrics)
- Phase 14: Tax optimization (tax-loss harvesting)
- Phase 15: Automated DCA & rebalancing
- Phase 16: Financial goals dashboard
- Phase 17: Retirement & FIRE planning
- Phase 18: Net worth projections
- Phase 19: AI Financial Advisor 2.0 (weekly insights)
- Phase 20: Podcast/transcript analysis for investment ideas
- Phase 21: Family finance hub

## Security Notes

- This app uses **paper trading only** - no real money is at risk
- API keys are entered client-side and proxied through serverless functions
- Keys are never stored on the server
- Financial data in the Overview tab is stored locally in your browser

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Built by [Andrew Crawford](https://github.com/Crawnicles)
