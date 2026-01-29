// News & Research API - Phase 2: Research Agent Pipeline
export async function POST(request) {
  try {
    const { apiKey, secretKey, symbols } = await request.json();

    // For now, we'll generate intelligent mock data
    // In production, this would call Alpaca News API, Alpha Vantage, or other data sources

    const newsItems = generateNewsForSymbols(symbols);
    const sentimentData = generateSentimentAnalysis(symbols);
    const analystRatings = generateAnalystRatings(symbols);
    const upcomingEvents = generateUpcomingEvents(symbols);

    return Response.json({
      news: newsItems,
      sentiment: sentimentData,
      ratings: analystRatings,
      events: upcomingEvents,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

function generateNewsForSymbols(symbols) {
  const newsTemplates = [
    { type: 'earnings', sentiment: 'positive', template: '{symbol} beats earnings estimates, stock rises in after-hours trading' },
    { type: 'earnings', sentiment: 'negative', template: '{symbol} misses revenue expectations, guidance lowered for Q2' },
    { type: 'analyst', sentiment: 'positive', template: 'Morgan Stanley upgrades {symbol} to Overweight, raises price target' },
    { type: 'analyst', sentiment: 'negative', template: 'Goldman Sachs downgrades {symbol} citing valuation concerns' },
    { type: 'product', sentiment: 'positive', template: '{symbol} announces new AI partnership, expanding market reach' },
    { type: 'sector', sentiment: 'neutral', template: 'Tech sector rotation continues as investors weigh {symbol} outlook' },
    { type: 'macro', sentiment: 'neutral', template: 'Fed comments impact {symbol} as rate expectations shift' },
    { type: 'insider', sentiment: 'positive', template: '{symbol} CEO purchases $2M in shares, signaling confidence' },
    { type: 'insider', sentiment: 'negative', template: '{symbol} CFO sells portion of holdings in planned transaction' },
    { type: 'competition', sentiment: 'negative', template: 'New competitor threatens {symbol} market share in key segment' },
  ];

  const news = [];
  const usedSymbols = symbols && symbols.length > 0 ? symbols : ['AAPL', 'MSFT', 'NVDA', 'GOOGL'];

  // Generate 2-4 news items per symbol
  usedSymbols.forEach(symbol => {
    const numNews = 2 + Math.floor(Math.random() * 3);
    const shuffled = [...newsTemplates].sort(() => Math.random() - 0.5);

    for (let i = 0; i < numNews && i < shuffled.length; i++) {
      const template = shuffled[i];
      const hoursAgo = Math.floor(Math.random() * 48);

      news.push({
        id: `${symbol}-${Date.now()}-${i}`,
        symbol,
        headline: template.template.replace('{symbol}', symbol),
        type: template.type,
        sentiment: template.sentiment,
        sentimentScore: template.sentiment === 'positive' ? 0.6 + Math.random() * 0.4
                      : template.sentiment === 'negative' ? -0.6 - Math.random() * 0.4
                      : (Math.random() - 0.5) * 0.4,
        source: ['Reuters', 'Bloomberg', 'CNBC', 'WSJ', 'Barron\'s'][Math.floor(Math.random() * 5)],
        timestamp: new Date(Date.now() - hoursAgo * 3600000).toISOString(),
        relevance: 0.7 + Math.random() * 0.3
      });
    }
  });

  return news.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 15);
}

function generateSentimentAnalysis(symbols) {
  const usedSymbols = symbols && symbols.length > 0 ? symbols : ['AAPL', 'MSFT', 'NVDA', 'GOOGL'];

  return usedSymbols.reduce((acc, symbol) => {
    const newsScore = (Math.random() - 0.3) * 2; // Slightly bullish bias
    const socialScore = (Math.random() - 0.4) * 2;
    const analystScore = (Math.random() - 0.2) * 2;

    acc[symbol] = {
      overall: (newsScore * 0.4 + socialScore * 0.3 + analystScore * 0.3),
      news: newsScore,
      social: socialScore,
      analyst: analystScore,
      momentum: Math.random() > 0.5 ? 'improving' : Math.random() > 0.5 ? 'stable' : 'declining',
      volume: ['high', 'normal', 'low'][Math.floor(Math.random() * 3)],
      trend: Math.random() > 0.6 ? 'bullish' : Math.random() > 0.4 ? 'neutral' : 'bearish'
    };
    return acc;
  }, {});
}

function generateAnalystRatings(symbols) {
  const usedSymbols = symbols && symbols.length > 0 ? symbols : ['AAPL', 'MSFT', 'NVDA', 'GOOGL'];

  return usedSymbols.reduce((acc, symbol) => {
    const buy = Math.floor(Math.random() * 20) + 5;
    const hold = Math.floor(Math.random() * 15) + 3;
    const sell = Math.floor(Math.random() * 8);
    const total = buy + hold + sell;

    const currentPrice = 100 + Math.random() * 400;
    const targetPrice = currentPrice * (0.9 + Math.random() * 0.4);

    acc[symbol] = {
      buy,
      hold,
      sell,
      total,
      consensus: buy > hold + sell ? 'Buy' : hold > buy + sell ? 'Hold' : buy >= sell ? 'Hold' : 'Sell',
      averageTarget: targetPrice,
      currentPrice,
      upside: ((targetPrice - currentPrice) / currentPrice * 100),
      recentChanges: Math.floor(Math.random() * 5)
    };
    return acc;
  }, {});
}

function generateUpcomingEvents(symbols) {
  const events = [];
  const usedSymbols = symbols && symbols.length > 0 ? symbols : ['AAPL', 'MSFT', 'NVDA', 'GOOGL'];

  usedSymbols.forEach(symbol => {
    // Earnings date
    if (Math.random() > 0.5) {
      const daysUntil = Math.floor(Math.random() * 45) + 1;
      events.push({
        symbol,
        type: 'earnings',
        title: `${symbol} Q4 Earnings`,
        date: new Date(Date.now() + daysUntil * 86400000).toISOString(),
        daysUntil,
        importance: 'high'
      });
    }

    // Dividend
    if (Math.random() > 0.6) {
      const daysUntil = Math.floor(Math.random() * 30) + 1;
      events.push({
        symbol,
        type: 'dividend',
        title: `${symbol} Ex-Dividend Date`,
        date: new Date(Date.now() + daysUntil * 86400000).toISOString(),
        daysUntil,
        importance: 'medium'
      });
    }

    // Conference/Event
    if (Math.random() > 0.7) {
      const daysUntil = Math.floor(Math.random() * 60) + 1;
      events.push({
        symbol,
        type: 'conference',
        title: `${symbol} at Tech Conference`,
        date: new Date(Date.now() + daysUntil * 86400000).toISOString(),
        daysUntil,
        importance: 'low'
      });
    }
  });

  return events.sort((a, b) => a.daysUntil - b.daysUntil);
}
