// Multi-Agent Research Pipeline - Phase 2
// Research Agent → Analysis Agent → Decision Agent

export async function POST(request) {
  try {
    const { symbols, positions, preferences } = await request.json();

    // Stage 1: Research Agent - Gather data
    const researchData = await researchAgent(symbols);

    // Stage 2: Analysis Agent - Process and score
    const analysisResults = await analysisAgent(researchData, positions);

    // Stage 3: Decision Agent - Generate recommendations
    const decisions = await decisionAgent(analysisResults, preferences);

    return Response.json({
      research: researchData,
      analysis: analysisResults,
      decisions,
      pipeline: {
        stages: ['research', 'analysis', 'decision'],
        completedAt: new Date().toISOString()
      }
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// RESEARCH AGENT: Gathers news, filings, analyst reports, social sentiment
async function researchAgent(symbols) {
  const usedSymbols = symbols && symbols.length > 0 ? symbols : ['AAPL', 'MSFT', 'NVDA'];

  const research = {};

  for (const symbol of usedSymbols) {
    // Simulate gathering data from multiple sources
    research[symbol] = {
      sources: {
        news: generateNewsData(symbol),
        filings: generateFilingsData(symbol),
        analysts: generateAnalystData(symbol),
        social: generateSocialData(symbol),
        technicals: generateTechnicalData(symbol)
      },
      dataQuality: 0.85 + Math.random() * 0.15,
      lastUpdated: new Date().toISOString()
    };
  }

  return research;
}

// ANALYSIS AGENT: Processes research data, calculates scores
async function analysisAgent(researchData, positions) {
  const analysis = {};

  for (const [symbol, data] of Object.entries(researchData)) {
    const position = positions?.find(p => p.symbol === symbol);
    const sources = data.sources;

    // Calculate composite scores
    const sentimentScore = (
      sources.news.sentiment * 0.35 +
      sources.social.sentiment * 0.25 +
      sources.analysts.sentiment * 0.40
    );

    const technicalScore = sources.technicals.score;
    const fundamentalScore = sources.filings.score;

    // Risk assessment
    const volatility = sources.technicals.volatility;
    const beta = sources.technicals.beta;
    const riskScore = Math.max(0, 100 - (volatility * 2 + Math.abs(beta - 1) * 20));

    // Momentum indicators
    const momentum = {
      short: sources.technicals.rsi > 50 ? 'bullish' : 'bearish',
      medium: sources.technicals.macdSignal,
      long: sources.technicals.trend200d
    };

    analysis[symbol] = {
      scores: {
        sentiment: Math.round(sentimentScore * 100) / 100,
        technical: Math.round(technicalScore),
        fundamental: Math.round(fundamentalScore),
        risk: Math.round(riskScore),
        composite: Math.round((sentimentScore * 30 + technicalScore * 0.35 + fundamentalScore * 0.35) * 100) / 100
      },
      momentum,
      signals: generateSignals(sources, sentimentScore, technicalScore),
      catalysts: generateCatalysts(sources),
      risks: generateRisks(sources, beta, volatility),
      position: position ? {
        qty: parseFloat(position.qty),
        avgPrice: parseFloat(position.avg_entry_price),
        currentPrice: parseFloat(position.current_price),
        unrealizedPL: parseFloat(position.unrealized_pl),
        unrealizedPLPct: parseFloat(position.unrealized_plpc) * 100
      } : null
    };
  }

  return analysis;
}

// DECISION AGENT: Makes buy/sell/hold recommendations
async function decisionAgent(analysisResults, preferences) {
  const decisions = {};
  const riskMultiplier = {
    conservative: 0.7,
    moderate: 1.0,
    aggressive: 1.3
  }[preferences?.riskTolerance || 'moderate'];

  for (const [symbol, analysis] of Object.entries(analysisResults)) {
    const { scores, momentum, signals, position } = analysis;

    // Decision logic
    let rating, confidence, action, reasoning = [];

    // Calculate base rating from scores
    const weightedScore = (
      scores.sentiment * 0.25 +
      (scores.technical / 100) * 0.30 +
      (scores.fundamental / 100) * 0.30 +
      (scores.risk / 100) * 0.15
    );

    // Determine rating
    if (weightedScore > 0.65) {
      rating = 'BUY';
      confidence = Math.min(95, Math.round(60 + weightedScore * 40));
      reasoning.push('Strong composite score across multiple factors');
    } else if (weightedScore > 0.45) {
      rating = 'HOLD';
      confidence = Math.round(50 + (0.65 - Math.abs(weightedScore - 0.55)) * 60);
      reasoning.push('Mixed signals suggest maintaining current position');
    } else {
      rating = 'SELL';
      confidence = Math.min(95, Math.round(60 + (0.45 - weightedScore) * 80));
      reasoning.push('Weak fundamentals and negative sentiment');
    }

    // Adjust based on momentum
    if (momentum.short === 'bullish' && momentum.medium === 'bullish') {
      if (rating === 'HOLD') {
        confidence += 10;
        reasoning.push('Positive short and medium-term momentum');
      }
    } else if (momentum.short === 'bearish' && momentum.medium === 'bearish') {
      if (rating === 'BUY') {
        confidence -= 15;
        reasoning.push('Caution: Negative momentum despite fundamentals');
      }
    }

    // Position-specific adjustments
    if (position) {
      if (position.unrealizedPLPct > 20 && rating !== 'SELL') {
        reasoning.push(`Consider taking partial profits (up ${position.unrealizedPLPct.toFixed(1)}%)`);
        action = 'TAKE_PARTIAL_PROFIT';
      } else if (position.unrealizedPLPct < -15 && rating === 'SELL') {
        confidence += 10;
        reasoning.push('Position down significantly, cut losses');
        action = 'CUT_LOSSES';
      } else if (rating === 'BUY' && position.unrealizedPLPct > 0) {
        action = 'ADD_TO_POSITION';
        reasoning.push('Winner showing continued strength');
      }
    } else {
      if (rating === 'BUY') {
        action = 'INITIATE_POSITION';
      }
    }

    // Risk-adjust confidence
    confidence = Math.round(confidence * riskMultiplier);
    confidence = Math.max(30, Math.min(95, confidence));

    // Add signal-based reasoning
    signals.filter(s => s.strength === 'strong').forEach(s => {
      reasoning.push(s.description);
    });

    decisions[symbol] = {
      rating,
      confidence,
      action: action || (rating === 'BUY' ? 'BUY' : rating === 'SELL' ? 'SELL' : 'HOLD'),
      reasoning: reasoning.slice(0, 4),
      targetAction: {
        type: rating.toLowerCase(),
        suggestedSize: rating === 'BUY' ? Math.ceil(5 * riskMultiplier) : rating === 'SELL' && position ? Math.ceil(position.qty * 0.5) : 0,
        urgency: confidence > 80 ? 'high' : confidence > 60 ? 'medium' : 'low'
      },
      scores,
      generatedAt: new Date().toISOString()
    };
  }

  return decisions;
}

// Helper functions for data generation
function generateNewsData(symbol) {
  return {
    count: Math.floor(Math.random() * 15) + 5,
    sentiment: (Math.random() - 0.3) * 2,
    recentMentions: Math.floor(Math.random() * 50) + 10,
    trendingScore: Math.random()
  };
}

function generateFilingsData(symbol) {
  return {
    lastFiling: '10-Q',
    daysAgo: Math.floor(Math.random() * 60),
    revenueGrowth: (Math.random() - 0.2) * 40,
    epsGrowth: (Math.random() - 0.2) * 50,
    score: 50 + Math.random() * 50
  };
}

function generateAnalystData(symbol) {
  return {
    buyRatings: Math.floor(Math.random() * 20) + 5,
    holdRatings: Math.floor(Math.random() * 15),
    sellRatings: Math.floor(Math.random() * 8),
    avgTarget: 100 + Math.random() * 400,
    sentiment: (Math.random() - 0.2) * 2
  };
}

function generateSocialData(symbol) {
  return {
    mentions: Math.floor(Math.random() * 1000) + 100,
    sentiment: (Math.random() - 0.4) * 2,
    trending: Math.random() > 0.7,
    influencerMentions: Math.floor(Math.random() * 10)
  };
}

function generateTechnicalData(symbol) {
  return {
    rsi: 30 + Math.random() * 40,
    macd: (Math.random() - 0.5) * 10,
    macdSignal: Math.random() > 0.5 ? 'bullish' : 'bearish',
    trend50d: Math.random() > 0.5 ? 'above' : 'below',
    trend200d: Math.random() > 0.5 ? 'bullish' : 'bearish',
    volatility: 15 + Math.random() * 30,
    beta: 0.5 + Math.random() * 1.5,
    score: 40 + Math.random() * 50,
    support: 100 + Math.random() * 50,
    resistance: 150 + Math.random() * 100
  };
}

function generateSignals(sources, sentimentScore, technicalScore) {
  const signals = [];

  if (sentimentScore > 0.5) {
    signals.push({ type: 'sentiment', direction: 'bullish', strength: 'strong', description: 'Strong positive sentiment across news and social media' });
  } else if (sentimentScore < -0.3) {
    signals.push({ type: 'sentiment', direction: 'bearish', strength: 'strong', description: 'Negative sentiment detected in recent coverage' });
  }

  if (sources.technicals.rsi < 30) {
    signals.push({ type: 'technical', direction: 'bullish', strength: 'strong', description: 'RSI indicates oversold conditions' });
  } else if (sources.technicals.rsi > 70) {
    signals.push({ type: 'technical', direction: 'bearish', strength: 'moderate', description: 'RSI indicates overbought conditions' });
  }

  if (sources.filings.revenueGrowth > 15) {
    signals.push({ type: 'fundamental', direction: 'bullish', strength: 'strong', description: `Revenue growth of ${sources.filings.revenueGrowth.toFixed(1)}%` });
  }

  if (sources.analysts.buyRatings > sources.analysts.holdRatings + sources.analysts.sellRatings) {
    signals.push({ type: 'analyst', direction: 'bullish', strength: 'moderate', description: 'Majority analyst buy ratings' });
  }

  return signals;
}

function generateCatalysts(sources) {
  const catalysts = [];

  if (Math.random() > 0.6) {
    catalysts.push({ type: 'earnings', timeframe: `${Math.floor(Math.random() * 30) + 1} days`, impact: 'high' });
  }
  if (Math.random() > 0.7) {
    catalysts.push({ type: 'product_launch', timeframe: 'Q1 2026', impact: 'medium' });
  }
  if (Math.random() > 0.8) {
    catalysts.push({ type: 'acquisition', timeframe: 'Pending', impact: 'high' });
  }

  return catalysts;
}

function generateRisks(sources, beta, volatility) {
  const risks = [];

  if (beta > 1.5) {
    risks.push({ type: 'volatility', level: 'high', description: 'High beta indicates significant market sensitivity' });
  }
  if (volatility > 35) {
    risks.push({ type: 'price_movement', level: 'high', description: 'Elevated price volatility' });
  }
  if (sources.filings.revenueGrowth < 0) {
    risks.push({ type: 'fundamental', level: 'medium', description: 'Declining revenue growth' });
  }

  return risks;
}
