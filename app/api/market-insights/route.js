import { NextResponse } from 'next/server';

// Phase 17: Market Insights from News
// Provides market themes, investment ideas, and portfolio diversification analysis

const MARKET_THEMES = [
  {
    theme: 'AI & Machine Learning Boom',
    sentiment: 'bullish',
    confidence: 88,
    description: 'Continued investment in AI infrastructure and applications driving growth',
    stocks: ['NVDA', 'MSFT', 'GOOGL', 'AMD', 'META'],
    sectors: ['Technology', 'Semiconductors'],
  },
  {
    theme: 'Interest Rate Stabilization',
    sentiment: 'neutral',
    confidence: 72,
    description: 'Fed signaling pause in rate hikes benefits growth stocks and REITs',
    stocks: ['SPY', 'QQQ', 'VNQ', 'SCHD'],
    sectors: ['Financials', 'Real Estate'],
  },
  {
    theme: 'Healthcare Innovation',
    sentiment: 'bullish',
    confidence: 81,
    description: 'GLP-1 drugs and biotech breakthroughs creating new opportunities',
    stocks: ['LLY', 'NVO', 'UNH', 'JNJ', 'PFE'],
    sectors: ['Healthcare', 'Pharmaceuticals'],
  },
  {
    theme: 'Energy Transition',
    sentiment: 'cautious',
    confidence: 65,
    description: 'Mixed signals on renewable energy investments amid policy uncertainty',
    stocks: ['XOM', 'CVX', 'NEE', 'ENPH', 'FSLR'],
    sectors: ['Energy', 'Utilities'],
  },
  {
    theme: 'Consumer Resilience',
    sentiment: 'neutral',
    confidence: 68,
    description: 'Strong employment but high prices affecting consumer spending patterns',
    stocks: ['AMZN', 'COST', 'WMT', 'TGT', 'HD'],
    sectors: ['Consumer Discretionary', 'Consumer Staples'],
  },
  {
    theme: 'Reshoring & Manufacturing',
    sentiment: 'bullish',
    confidence: 76,
    description: 'CHIPS Act and supply chain concerns driving domestic manufacturing',
    stocks: ['CAT', 'DE', 'GE', 'HON', 'RTX'],
    sectors: ['Industrials', 'Defense'],
  },
];

const SECTOR_DATA = {
  'Technology': { weight: 0.28, ytdReturn: 12.5, peRatio: 28.5 },
  'Healthcare': { weight: 0.13, ytdReturn: 4.2, peRatio: 18.2 },
  'Financials': { weight: 0.13, ytdReturn: 8.1, peRatio: 14.8 },
  'Consumer Discretionary': { weight: 0.11, ytdReturn: 9.8, peRatio: 24.3 },
  'Industrials': { weight: 0.09, ytdReturn: 7.5, peRatio: 21.1 },
  'Consumer Staples': { weight: 0.06, ytdReturn: 2.1, peRatio: 22.4 },
  'Energy': { weight: 0.04, ytdReturn: -2.3, peRatio: 11.5 },
  'Real Estate': { weight: 0.02, ytdReturn: 1.8, peRatio: 35.2 },
  'Utilities': { weight: 0.02, ytdReturn: 3.5, peRatio: 17.8 },
  'Materials': { weight: 0.02, ytdReturn: 4.8, peRatio: 16.2 },
};

const STOCK_SECTORS = {
  'AAPL': 'Technology', 'MSFT': 'Technology', 'GOOGL': 'Technology', 'META': 'Technology',
  'NVDA': 'Technology', 'AMD': 'Technology', 'AMZN': 'Consumer Discretionary',
  'TSLA': 'Consumer Discretionary', 'JPM': 'Financials', 'V': 'Financials',
  'JNJ': 'Healthcare', 'UNH': 'Healthcare', 'LLY': 'Healthcare', 'PFE': 'Healthcare',
  'XOM': 'Energy', 'CVX': 'Energy', 'HD': 'Consumer Discretionary',
  'PG': 'Consumer Staples', 'KO': 'Consumer Staples', 'WMT': 'Consumer Staples',
  'CAT': 'Industrials', 'GE': 'Industrials', 'HON': 'Industrials',
  'NEE': 'Utilities', 'DUK': 'Utilities', 'VNQ': 'Real Estate',
  'SPY': 'ETF', 'QQQ': 'ETF', 'SCHD': 'ETF',
};

function analyzePortfolioDiversification(positions) {
  if (!positions || positions.length === 0) {
    return {
      sectorExposure: [],
      diversificationScore: 0,
      recommendations: ['Add positions to analyze diversification'],
    };
  }

  const totalValue = positions.reduce((sum, p) => sum + parseFloat(p.market_value || 0), 0);
  const sectorValues = {};

  positions.forEach(pos => {
    const sector = STOCK_SECTORS[pos.symbol] || 'Other';
    sectorValues[sector] = (sectorValues[sector] || 0) + parseFloat(pos.market_value || 0);
  });

  const sectorExposure = Object.entries(sectorValues).map(([sector, value]) => ({
    sector,
    value,
    weight: (value / totalValue * 100).toFixed(1),
    marketWeight: SECTOR_DATA[sector]?.weight * 100 || 0,
    difference: ((value / totalValue * 100) - (SECTOR_DATA[sector]?.weight * 100 || 0)).toFixed(1),
  })).sort((a, b) => b.value - a.value);

  // Calculate diversification score
  const sectorCount = Object.keys(sectorValues).filter(s => s !== 'ETF').length;
  const maxWeight = Math.max(...sectorExposure.filter(s => s.sector !== 'ETF').map(s => parseFloat(s.weight)));
  const etfWeight = sectorExposure.find(s => s.sector === 'ETF')?.weight || 0;

  let diversificationScore = 50; // Base score
  diversificationScore += Math.min(30, sectorCount * 5); // Up to 30 points for sector count
  diversificationScore -= Math.max(0, maxWeight - 40); // Penalize if any sector > 40%
  diversificationScore += Math.min(20, parseFloat(etfWeight) * 0.5); // Bonus for ETFs
  diversificationScore = Math.max(0, Math.min(100, Math.round(diversificationScore)));

  // Generate recommendations
  const recommendations = [];

  if (sectorCount < 4) {
    recommendations.push(`Add exposure to more sectors. You only have ${sectorCount} sectors represented.`);
  }

  const overweightSectors = sectorExposure.filter(s => parseFloat(s.difference) > 15 && s.sector !== 'ETF');
  overweightSectors.forEach(s => {
    recommendations.push(`Consider reducing ${s.sector} exposure (${s.weight}% vs ${s.marketWeight}% market weight)`);
  });

  const missingSectors = Object.keys(SECTOR_DATA).filter(s => !sectorValues[s]);
  if (missingSectors.length > 0) {
    recommendations.push(`Consider adding exposure to: ${missingSectors.slice(0, 3).join(', ')}`);
  }

  if (maxWeight > 50) {
    recommendations.push(`High concentration risk: ${sectorExposure[0]?.sector} is ${maxWeight.toFixed(0)}% of portfolio`);
  }

  return { sectorExposure, diversificationScore, recommendations };
}

function generateInvestmentIdeas(positions, riskTolerance = 'moderate') {
  const currentSymbols = positions.map(p => p.symbol);
  const ideas = [];

  // Find themes user isn't exposed to
  MARKET_THEMES.forEach(theme => {
    const hasExposure = theme.stocks.some(s => currentSymbols.includes(s));
    if (!hasExposure && theme.sentiment !== 'bearish') {
      const suggestedStock = theme.stocks.find(s => !currentSymbols.includes(s));
      if (suggestedStock) {
        ideas.push({
          symbol: suggestedStock,
          theme: theme.theme,
          sentiment: theme.sentiment,
          confidence: theme.confidence,
          reason: theme.description,
          riskLevel: theme.sentiment === 'cautious' ? 'high' : 'moderate',
          sectors: theme.sectors,
        });
      }
    }
  });

  // Filter by risk tolerance
  const filteredIdeas = ideas.filter(idea => {
    if (riskTolerance === 'conservative') return idea.riskLevel !== 'high';
    if (riskTolerance === 'aggressive') return true;
    return idea.riskLevel !== 'high' || idea.confidence > 75;
  });

  return filteredIdeas.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
}

function generateSimulatedNews() {
  const newsItems = [
    {
      headline: 'NVIDIA Reports Record Data Center Revenue',
      source: 'Financial Times',
      time: '2 hours ago',
      sentiment: 'bullish',
      impact: 'high',
      relatedStocks: ['NVDA', 'AMD', 'MSFT'],
      summary: 'AI chip demand continues to surge as enterprises scale AI infrastructure',
    },
    {
      headline: 'Fed Signals Patience on Rate Cuts',
      source: 'Reuters',
      time: '4 hours ago',
      sentiment: 'neutral',
      impact: 'high',
      relatedStocks: ['SPY', 'QQQ', 'TLT'],
      summary: 'Interest rates expected to remain steady through Q2, markets react calmly',
    },
    {
      headline: 'Eli Lilly Weight-Loss Drug Shows Strong Trial Results',
      source: 'Bloomberg',
      time: '6 hours ago',
      sentiment: 'bullish',
      impact: 'medium',
      relatedStocks: ['LLY', 'NVO', 'UNH'],
      summary: 'GLP-1 market expansion continues with new treatment options',
    },
    {
      headline: 'Apple Services Revenue Hits New High',
      source: 'CNBC',
      time: '1 day ago',
      sentiment: 'bullish',
      impact: 'medium',
      relatedStocks: ['AAPL'],
      summary: 'Services segment offsets slower hardware sales growth',
    },
    {
      headline: 'Oil Prices Dip on Demand Concerns',
      source: 'WSJ',
      time: '1 day ago',
      sentiment: 'bearish',
      impact: 'medium',
      relatedStocks: ['XOM', 'CVX', 'USO'],
      summary: 'Global economic slowdown fears weigh on energy sector',
    },
    {
      headline: 'Amazon AWS Growth Accelerates',
      source: 'TechCrunch',
      time: '2 days ago',
      sentiment: 'bullish',
      impact: 'high',
      relatedStocks: ['AMZN', 'MSFT', 'GOOGL'],
      summary: 'Cloud computing demand remains strong amid AI workload growth',
    },
  ];

  // Randomize and return subset
  return newsItems.sort(() => Math.random() - 0.5).slice(0, 5);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, positions = [], riskTolerance = 'moderate' } = body;

    if (action === 'getInsights') {
      const diversification = analyzePortfolioDiversification(positions);
      const investmentIdeas = generateInvestmentIdeas(positions, riskTolerance);

      // Filter themes based on current exposure
      const relevantThemes = MARKET_THEMES.map(theme => ({
        ...theme,
        hasExposure: theme.stocks.some(s => positions.map(p => p.symbol).includes(s)),
      }));

      return NextResponse.json({
        success: true,
        insights: {
          themes: relevantThemes,
          investmentIdeas,
          diversification,
          marketOverview: {
            sentiment: 'cautiously optimistic',
            volatilityIndex: 18.5,
            trendDirection: 'upward',
            keyDrivers: ['AI investment', 'Fed policy', 'Corporate earnings'],
          },
        },
      });
    }

    if (action === 'getNews') {
      const news = generateSimulatedNews();
      return NextResponse.json({ success: true, news });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Market Insights error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
