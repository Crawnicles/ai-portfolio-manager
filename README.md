# AI Portfolio Manager

An intelligent trading assistant powered by AI analysis. Get personalized trade suggestions based on your risk tolerance, sector preferences, and trading style.

## Features

- **Portfolio Dashboard** - Real-time view of holdings, P&L, and performance charts
- **AI Trade Suggestions** - Intelligent buy/sell recommendations with confidence scores
- **Risk-Adjusted Analysis** - Technical, fundamental, sentiment, and risk scoring
- **One-Click Trading** - Execute trades directly through Alpaca paper trading
- **Customizable Preferences** - Set your trading style, risk tolerance, and sector focus

## Quick Deploy to Vercel

### Option 1: Deploy with Git (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/ai-portfolio-manager.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub
   - Click "Add New Project"
   - Import your repository
   - Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Getting Alpaca API Keys

1. Create a free account at [alpaca.markets](https://alpaca.markets)
2. Go to your dashboard and switch to "Paper Trading"
3. Generate API keys in the API Keys section
4. Use these keys in the app (paper trading only - no real money)

## Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS, Recharts
- **API:** Alpaca Trading API (paper trading)
- **Deployment:** Vercel

## Security Note

This app uses paper trading only. API keys are entered client-side and sent to serverless functions that proxy requests to Alpaca. Keys are never stored on the server.

---

Built with ❤️ by Andrew