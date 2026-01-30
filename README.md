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

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: React 18, Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Trading API**: Alpaca (paper trading)
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
├── page.js                    # Main application (2500+ lines)
├── layout.js                  # Root layout
├── globals.css                # Global styles
└── api/alpaca/
    ├── account/route.js       # Account data proxy
    ├── positions/route.js     # Positions proxy
    ├── orders/route.js        # Orders proxy
    ├── trade/route.js         # Trade execution
    ├── news/route.js          # News & sentiment
    ├── research/route.js      # Multi-agent research pipeline
    ├── digest/route.js        # Periodic digest generation
    ├── advisor/route.js       # AI financial advisor
    └── ai-competition/route.js # AI arena competition
```

## Roadmap

- [x] Phase 1: Auto-trading with safety limits
- [x] Phase 2: Research agent pipeline
- [x] Phase 3: Net worth overview & digests
- [x] Phase 4: Crypto, partnerships, debts, AI advisor
- [x] Phase 5: Multi-model AI arena
- [ ] Phase 6: Partnership dashboard (quarterly reports)
- [ ] Phase 7: Read-only bank integrations (Plaid)
- [ ] Phase 8: Podcast/transcript analysis for investment ideas

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
