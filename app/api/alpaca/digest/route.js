// Periodic Digest Generator - Phase 3
// Generates daily/weekly/monthly summaries of portfolio activity

export async function POST(request) {
  try {
    const { period, accounts, positions, tradeHistory, preferences } = await request.json();

    const digest = generateDigest(period, accounts, positions, tradeHistory, preferences);

    return Response.json(digest);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

function generateDigest(period, accounts, positions, tradeHistory, preferences) {
  const now = new Date();
  const periodDays = { daily: 1, weekly: 7, monthly: 30, quarterly: 90 }[period] || 7;

  // Calculate totals across all accounts
  const totalNetWorth = calculateNetWorth(accounts);
  const previousNetWorth = totalNetWorth * (1 - (Math.random() - 0.4) * 0.05); // Simulate previous
  const netWorthChange = totalNetWorth - previousNetWorth;
  const netWorthChangePct = (netWorthChange / previousNetWorth) * 100;

  // Portfolio performance
  const portfolioValue = positions?.reduce((sum, p) => sum + parseFloat(p.market_value || 0), 0) || 0;
  const portfolioPL = positions?.reduce((sum, p) => sum + parseFloat(p.unrealized_pl || 0), 0) || 0;

  // Top movers
  const topGainers = [...(positions || [])]
    .sort((a, b) => parseFloat(b.unrealized_plpc) - parseFloat(a.unrealized_plpc))
    .slice(0, 3)
    .map(p => ({
      symbol: p.symbol,
      change: (parseFloat(p.unrealized_plpc) * 100).toFixed(1),
      value: parseFloat(p.market_value).toFixed(2)
    }));

  const topLosers = [...(positions || [])]
    .sort((a, b) => parseFloat(a.unrealized_plpc) - parseFloat(b.unrealized_plpc))
    .slice(0, 3)
    .map(p => ({
      symbol: p.symbol,
      change: (parseFloat(p.unrealized_plpc) * 100).toFixed(1),
      value: parseFloat(p.market_value).toFixed(2)
    }));

  // Recent trades
  const recentTrades = (tradeHistory || [])
    .filter(t => {
      const tradeDate = new Date(t.timestamp);
      const daysAgo = (now - tradeDate) / (1000 * 60 * 60 * 24);
      return daysAgo <= periodDays;
    })
    .slice(0, 5);

  // Generate insights
  const insights = generateInsights(accounts, positions, netWorthChangePct, period);

  // Action items
  const actionItems = generateActionItems(positions, accounts, preferences);

  // Account breakdown
  const accountBreakdown = generateAccountBreakdown(accounts);

  return {
    period,
    generatedAt: now.toISOString(),
    summary: {
      netWorth: totalNetWorth,
      netWorthChange,
      netWorthChangePct,
      portfolioValue,
      portfolioPL,
      portfolioPLPct: portfolioValue > 0 ? (portfolioPL / (portfolioValue - portfolioPL)) * 100 : 0,
      totalAccounts: accounts?.length || 0,
      totalPositions: positions?.length || 0,
    },
    topMovers: {
      gainers: topGainers,
      losers: topLosers.filter(p => parseFloat(p.change) < 0)
    },
    recentActivity: {
      trades: recentTrades,
      tradeCount: recentTrades.length
    },
    insights,
    actionItems,
    accountBreakdown,
    periodLabel: getPeriodLabel(period)
  };
}

function calculateNetWorth(accounts) {
  if (!accounts || accounts.length === 0) return 0;
  return accounts.reduce((sum, acc) => sum + (parseFloat(acc.balance) || 0), 0);
}

function generateInsights(accounts, positions, changePct, period) {
  const insights = [];

  // Performance insight
  if (changePct > 2) {
    insights.push({
      type: 'positive',
      icon: 'trending-up',
      title: 'Strong Performance',
      description: `Your net worth grew ${changePct.toFixed(1)}% this ${period}. Keep up the momentum!`
    });
  } else if (changePct < -2) {
    insights.push({
      type: 'warning',
      icon: 'trending-down',
      title: 'Market Headwinds',
      description: `Net worth declined ${Math.abs(changePct).toFixed(1)}% this ${period}. Consider reviewing your positions.`
    });
  } else {
    insights.push({
      type: 'neutral',
      icon: 'minus',
      title: 'Steady Progress',
      description: `Your portfolio is holding steady with ${changePct >= 0 ? '+' : ''}${changePct.toFixed(1)}% change.`
    });
  }

  // Diversification insight
  if (positions && positions.length > 0) {
    const techPositions = positions.filter(p => ['AAPL', 'MSFT', 'GOOGL', 'NVDA', 'META', 'AMD'].includes(p.symbol));
    const techWeight = techPositions.reduce((sum, p) => sum + parseFloat(p.market_value), 0) /
                       positions.reduce((sum, p) => sum + parseFloat(p.market_value), 0);

    if (techWeight > 0.6) {
      insights.push({
        type: 'info',
        icon: 'pie-chart',
        title: 'Tech Heavy Portfolio',
        description: `${(techWeight * 100).toFixed(0)}% of your portfolio is in tech. Consider diversifying into other sectors.`
      });
    }
  }

  // Account insight
  if (accounts) {
    const investmentAccounts = accounts.filter(a => a.type === 'investment' || a.type === 'retirement');
    const cashAccounts = accounts.filter(a => a.type === 'checking' || a.type === 'savings');
    const totalInvestments = investmentAccounts.reduce((s, a) => s + parseFloat(a.balance), 0);
    const totalCash = cashAccounts.reduce((s, a) => s + parseFloat(a.balance), 0);

    if (totalCash > 0 && totalInvestments > 0) {
      const cashRatio = totalCash / (totalCash + totalInvestments);
      if (cashRatio > 0.3) {
        insights.push({
          type: 'info',
          icon: 'dollar',
          title: 'High Cash Position',
          description: `${(cashRatio * 100).toFixed(0)}% of your assets are in cash. Consider putting more to work.`
        });
      }
    }
  }

  return insights;
}

function generateActionItems(positions, accounts, preferences) {
  const items = [];

  // Check for positions needing attention
  if (positions) {
    positions.forEach(p => {
      const plPct = parseFloat(p.unrealized_plpc) * 100;
      if (plPct > 25) {
        items.push({
          priority: 'medium',
          type: 'take_profit',
          symbol: p.symbol,
          description: `${p.symbol} is up ${plPct.toFixed(1)}%. Consider taking some profits.`
        });
      } else if (plPct < -15) {
        items.push({
          priority: 'high',
          type: 'review',
          symbol: p.symbol,
          description: `${p.symbol} is down ${Math.abs(plPct).toFixed(1)}%. Review thesis or cut losses.`
        });
      }
    });
  }

  // Check for account balance thresholds
  if (accounts) {
    accounts.forEach(acc => {
      if (acc.type === 'checking' && parseFloat(acc.balance) < 1000) {
        items.push({
          priority: 'high',
          type: 'low_balance',
          account: acc.name,
          description: `${acc.name} balance is low ($${parseFloat(acc.balance).toFixed(2)}). Consider replenishing.`
        });
      }
    });
  }

  // Add general items
  if (items.length === 0) {
    items.push({
      priority: 'low',
      type: 'review',
      description: 'All accounts look healthy. Review your investment thesis quarterly.'
    });
  }

  return items.slice(0, 5);
}

function generateAccountBreakdown(accounts) {
  if (!accounts || accounts.length === 0) return [];

  const typeGroups = {};
  accounts.forEach(acc => {
    const type = acc.type || 'other';
    if (!typeGroups[type]) {
      typeGroups[type] = { type, accounts: [], total: 0 };
    }
    typeGroups[type].accounts.push(acc);
    typeGroups[type].total += parseFloat(acc.balance) || 0;
  });

  return Object.values(typeGroups).sort((a, b) => b.total - a.total);
}

function getPeriodLabel(period) {
  const labels = {
    daily: 'Today',
    weekly: 'This Week',
    monthly: 'This Month',
    quarterly: 'This Quarter'
  };
  return labels[period] || 'Summary';
}
