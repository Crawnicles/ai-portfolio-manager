// Multi-Model AI Competition System - Phase 5
// Simulates different AI trading personalities until real API integrations are added

export async function POST(request) {
  try {
    const { action, traders, marketData, positions } = await request.json();

    switch (action) {
      case 'generate_decisions':
        return Response.json(generateTraderDecisions(traders, marketData, positions));
      case 'simulate_performance':
        return Response.json(simulatePerformance(traders));
      case 'get_leaderboard':
        return Response.json(calculateLeaderboard(traders));
      default:
        return Response.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// AI Personality Profiles - each model has different trading characteristics
const AI_PERSONALITIES = {
  claude: {
    name: 'Claude',
    provider: 'Anthropic',
    style: 'Balanced & Thoughtful',
    riskTolerance: 0.5,
    holdingPeriod: 'medium',
    prefersSectors: ['Technology', 'Healthcare'],
    tradeFrequency: 0.4, // Lower = more selective
    confidenceThreshold: 75,
    strengths: ['Risk assessment', 'Long-term thinking', 'Diversification'],
    color: '#D97706', // Amber
  },
  gpt: {
    name: 'GPT-4',
    provider: 'OpenAI',
    style: 'Aggressive Growth',
    riskTolerance: 0.7,
    holdingPeriod: 'short',
    prefersSectors: ['Technology', 'Consumer Cyclical'],
    tradeFrequency: 0.6,
    confidenceThreshold: 65,
    strengths: ['Trend identification', 'Quick decisions', 'Momentum plays'],
    color: '#10B981', // Green
  },
  grok: {
    name: 'Grok',
    provider: 'xAI',
    style: 'Contrarian & Bold',
    riskTolerance: 0.8,
    holdingPeriod: 'short',
    prefersSectors: ['Technology', 'Energy', 'Crypto-adjacent'],
    tradeFrequency: 0.7,
    confidenceThreshold: 60,
    strengths: ['Unconventional picks', 'High conviction bets', 'Meme awareness'],
    color: '#EF4444', // Red
  },
  gemini: {
    name: 'Gemini',
    provider: 'Google',
    style: 'Data-Driven Conservative',
    riskTolerance: 0.4,
    holdingPeriod: 'long',
    prefersSectors: ['Technology', 'Financial', 'Healthcare'],
    tradeFrequency: 0.3,
    confidenceThreshold: 80,
    strengths: ['Fundamental analysis', 'Pattern recognition', 'Risk management'],
    color: '#3B82F6', // Blue
  },
};

function generateTraderDecisions(traders, marketData, userPositions) {
  const decisions = {};
  const availableStocks = ['AAPL', 'MSFT', 'GOOGL', 'NVDA', 'TSLA', 'META', 'AMZN', 'JPM', 'JNJ', 'V', 'AMD', 'NFLX'];

  for (const trader of traders) {
    const personality = AI_PERSONALITIES[trader.model];
    if (!personality) continue;

    const traderDecisions = [];

    // Each AI evaluates potential trades based on their personality
    for (const symbol of availableStocks) {
      // Skip if trader already holds max position
      const currentHolding = trader.positions?.find(p => p.symbol === symbol);
      if (currentHolding && parseFloat(currentHolding.qty) >= 20) continue;

      // Generate decision based on personality
      const shouldTrade = Math.random() < personality.tradeFrequency;
      if (!shouldTrade) continue;

      const baseConfidence = 50 + Math.random() * 50;
      const sectorBonus = personality.prefersSectors.some(s =>
        getSector(symbol) === s
      ) ? 10 : 0;

      const confidence = Math.min(99, baseConfidence + sectorBonus);

      if (confidence >= personality.confidenceThreshold) {
        // Determine action based on personality
        const action = determineAction(personality, currentHolding, confidence);

        if (action) {
          const price = getSimulatedPrice(symbol);
          const qty = calculateQty(trader, personality, price);

          traderDecisions.push({
            symbol,
            action: action.type,
            qty,
            price,
            confidence: Math.round(confidence),
            reasoning: generateReasoning(personality, symbol, action.type, confidence),
            timestamp: new Date().toISOString()
          });
        }
      }
    }

    // Limit decisions per round based on personality
    const maxDecisions = personality.tradeFrequency > 0.5 ? 3 : 2;
    decisions[trader.model] = traderDecisions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, maxDecisions);
  }

  return { decisions, timestamp: new Date().toISOString() };
}

function getSector(symbol) {
  const sectors = {
    'AAPL': 'Technology', 'MSFT': 'Technology', 'GOOGL': 'Technology',
    'NVDA': 'Technology', 'META': 'Technology', 'AMD': 'Technology',
    'TSLA': 'Consumer Cyclical', 'AMZN': 'Consumer Cyclical', 'NFLX': 'Consumer Cyclical',
    'JPM': 'Financial', 'V': 'Financial',
    'JNJ': 'Healthcare',
  };
  return sectors[symbol] || 'Other';
}

function getSimulatedPrice(symbol) {
  const basePrices = {
    'AAPL': 185, 'MSFT': 420, 'GOOGL': 155, 'NVDA': 880,
    'TSLA': 175, 'META': 510, 'AMZN': 185, 'JPM': 195,
    'JNJ': 160, 'V': 280, 'AMD': 165, 'NFLX': 620,
  };
  const base = basePrices[symbol] || 100;
  return base * (0.95 + Math.random() * 0.1); // +/- 5% variance
}

function determineAction(personality, currentHolding, confidence) {
  if (!currentHolding) {
    // No position - consider buying
    if (confidence >= personality.confidenceThreshold) {
      return { type: 'BUY' };
    }
  } else {
    const plPct = parseFloat(currentHolding.unrealized_plpc || 0) * 100;

    // Take profit threshold varies by personality
    const profitThreshold = personality.riskTolerance > 0.6 ? 20 : 15;
    const lossThreshold = personality.riskTolerance > 0.6 ? -12 : -8;

    if (plPct > profitThreshold) {
      return { type: 'TAKE_PROFIT' };
    } else if (plPct < lossThreshold) {
      return { type: 'STOP_LOSS' };
    } else if (confidence > 85 && plPct > 0) {
      return { type: 'ADD' };
    }
  }
  return null;
}

function calculateQty(trader, personality, price) {
  const portfolioValue = trader.portfolioValue || 100000;
  const maxPositionPct = 0.05 + (personality.riskTolerance * 0.05); // 5-10%
  const maxPositionValue = portfolioValue * maxPositionPct;
  const qty = Math.floor(maxPositionValue / price);
  return Math.max(1, Math.min(qty, 10)); // 1-10 shares per trade
}

function generateReasoning(personality, symbol, action, confidence) {
  const reasons = {
    claude: {
      BUY: [
        `Balanced risk-reward profile for ${symbol}`,
        `Strong fundamentals with reasonable valuation`,
        `Fits portfolio diversification strategy`
      ],
      TAKE_PROFIT: [`Securing gains while maintaining discipline`],
      STOP_LOSS: [`Managing downside risk per allocation rules`],
      ADD: [`High conviction based on continued strength`]
    },
    gpt: {
      BUY: [
        `Strong momentum signals detected in ${symbol}`,
        `Technical breakout pattern forming`,
        `Sector rotation favoring this position`
      ],
      TAKE_PROFIT: [`Momentum fading, locking in gains`],
      STOP_LOSS: [`Cutting losses quickly to preserve capital`],
      ADD: [`Doubling down on winner`]
    },
    grok: {
      BUY: [
        `Contrarian opportunity in ${symbol}`,
        `Market underestimating potential catalyst`,
        `High conviction divergent play`
      ],
      TAKE_PROFIT: [`Taking chips off the table`],
      STOP_LOSS: [`Thesis invalidated, moving on`],
      ADD: [`Conviction increasing, size up`]
    },
    gemini: {
      BUY: [
        `Data analysis supports ${symbol} entry`,
        `Fundamental metrics exceed sector average`,
        `Historical patterns suggest upside`
      ],
      TAKE_PROFIT: [`Statistical target reached`],
      STOP_LOSS: [`Risk parameters exceeded threshold`],
      ADD: [`Additional data confirms thesis`]
    }
  };

  const modelReasons = reasons[personality.name.toLowerCase()] || reasons.claude;
  const actionReasons = modelReasons[action] || modelReasons.BUY;
  return actionReasons[Math.floor(Math.random() * actionReasons.length)];
}

function simulatePerformance(traders) {
  const performance = {};

  for (const trader of traders) {
    const dailyReturn = (Math.random() - 0.48) * 0.04; // Slight positive bias
    const personality = AI_PERSONALITIES[trader.model];

    // Personality affects volatility
    const volatilityMultiplier = 0.5 + personality.riskTolerance;
    const adjustedReturn = dailyReturn * volatilityMultiplier;

    performance[trader.model] = {
      dailyReturn: adjustedReturn,
      dailyReturnPct: adjustedReturn * 100,
      newValue: (trader.portfolioValue || 100000) * (1 + adjustedReturn),
      trades: trader.tradeHistory?.length || 0,
      winRate: calculateWinRate(trader.tradeHistory),
    };
  }

  return performance;
}

function calculateWinRate(tradeHistory) {
  if (!tradeHistory || tradeHistory.length === 0) return 0;
  const wins = tradeHistory.filter(t => t.pnl > 0).length;
  return (wins / tradeHistory.length) * 100;
}

function calculateLeaderboard(traders) {
  const leaderboard = traders.map(trader => {
    const personality = AI_PERSONALITIES[trader.model];
    const startValue = 100000;
    const currentValue = trader.portfolioValue || startValue;
    const totalReturn = ((currentValue - startValue) / startValue) * 100;
    const tradeCount = trader.tradeHistory?.length || 0;
    const winRate = calculateWinRate(trader.tradeHistory);

    return {
      model: trader.model,
      name: personality?.name || trader.model,
      provider: personality?.provider || 'Unknown',
      style: personality?.style || 'Unknown',
      color: personality?.color || '#888',
      portfolioValue: currentValue,
      totalReturn,
      tradeCount,
      winRate,
      sharpeRatio: calculateSharpeRatio(trader.dailyReturns),
      maxDrawdown: calculateMaxDrawdown(trader.valueHistory),
      strengths: personality?.strengths || [],
    };
  });

  return leaderboard.sort((a, b) => b.totalReturn - a.totalReturn);
}

function calculateSharpeRatio(dailyReturns) {
  if (!dailyReturns || dailyReturns.length < 5) return 0;
  const avg = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
  const variance = dailyReturns.reduce((sum, r) => sum + Math.pow(r - avg, 2), 0) / dailyReturns.length;
  const stdDev = Math.sqrt(variance);
  if (stdDev === 0) return 0;
  return ((avg * 252) / (stdDev * Math.sqrt(252))).toFixed(2); // Annualized
}

function calculateMaxDrawdown(valueHistory) {
  if (!valueHistory || valueHistory.length < 2) return 0;
  let maxDrawdown = 0;
  let peak = valueHistory[0];

  for (const value of valueHistory) {
    if (value > peak) peak = value;
    const drawdown = (peak - value) / peak;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  }

  return (maxDrawdown * 100).toFixed(1);
}
