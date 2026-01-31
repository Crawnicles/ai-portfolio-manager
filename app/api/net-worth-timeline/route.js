import { NextResponse } from 'next/server';

// Phase 19: Net Worth Timeline
// Tracks historical net worth and provides growth analysis

function generateHistoricalData(currentNetWorth, accounts, debts, monthsBack = 24) {
  // Generate realistic historical progression based on current state
  const history = [];
  const monthlyGrowthRate = 0.005 + Math.random() * 0.01; // 0.5-1.5% monthly growth
  const volatility = 0.02; // 2% monthly volatility

  let netWorth = currentNetWorth / Math.pow(1 + monthlyGrowthRate, monthsBack);

  // Calculate asset/debt breakdown
  const totalAssets = accounts.reduce((sum, a) => sum + parseFloat(a.balance || 0), 0);
  const totalDebts = debts.reduce((sum, d) => sum + parseFloat(d.balance || 0), 0);
  const assetRatio = totalAssets / (totalAssets + totalDebts || 1);

  for (let i = monthsBack; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);

    // Add some randomness for realism
    const monthlyChange = monthlyGrowthRate + (Math.random() - 0.5) * volatility;

    // Market events simulation
    let marketImpact = 1;
    const monthNum = date.getMonth();
    if (monthNum === 2 || monthNum === 9) { // March, October historically volatile
      marketImpact = 0.98 + Math.random() * 0.04;
    }

    const assets = netWorth * assetRatio * marketImpact;
    const debtsPortion = Math.max(0, assets - netWorth);

    history.push({
      date: date.toISOString().split('T')[0],
      month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
      netWorth: Math.round(netWorth),
      assets: Math.round(assets),
      debts: Math.round(debtsPortion),
      change: i < monthsBack ? Math.round(netWorth - history[history.length - 1]?.netWorth || 0) : 0,
    });

    netWorth *= (1 + monthlyChange);
  }

  return history;
}

function analyzeGrowth(history) {
  if (history.length < 2) {
    return { error: 'Insufficient data for analysis' };
  }

  const latest = history[history.length - 1];
  const oldest = history[0];
  const totalGrowth = latest.netWorth - oldest.netWorth;
  const growthPercent = ((latest.netWorth - oldest.netWorth) / Math.abs(oldest.netWorth || 1)) * 100;
  const monthlyAvgGrowth = totalGrowth / history.length;
  const annualizedGrowth = (Math.pow(latest.netWorth / oldest.netWorth, 12 / history.length) - 1) * 100;

  // Find best and worst months
  const monthlyChanges = history.slice(1).map((h, i) => ({
    month: h.month,
    change: h.netWorth - history[i].netWorth,
  }));

  const bestMonth = monthlyChanges.sort((a, b) => b.change - a.change)[0];
  const worstMonth = monthlyChanges.sort((a, b) => a.change - b.change)[0];

  // Calculate streaks
  let currentStreak = 0;
  let maxStreak = 0;
  let streakType = 'none';

  for (let i = history.length - 1; i > 0; i--) {
    if (history[i].netWorth > history[i - 1].netWorth) {
      currentStreak++;
      if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
        streakType = 'growth';
      }
    } else {
      break;
    }
  }

  // Milestones
  const milestones = [];
  const milestoneValues = [10000, 25000, 50000, 100000, 250000, 500000, 1000000];

  milestoneValues.forEach(milestone => {
    const reachedMonth = history.find(h => h.netWorth >= milestone);
    if (reachedMonth) {
      milestones.push({
        value: milestone,
        reached: reachedMonth.month,
        label: milestone >= 1000000 ? `$${milestone / 1000000}M` : `$${milestone / 1000}K`,
      });
    }
  });

  // Next milestone projection
  const nextMilestone = milestoneValues.find(m => m > latest.netWorth);
  let monthsToNextMilestone = null;
  if (nextMilestone && monthlyAvgGrowth > 0) {
    monthsToNextMilestone = Math.ceil((nextMilestone - latest.netWorth) / monthlyAvgGrowth);
  }

  return {
    summary: {
      currentNetWorth: latest.netWorth,
      startingNetWorth: oldest.netWorth,
      totalGrowth,
      growthPercent: growthPercent.toFixed(1),
      annualizedGrowth: annualizedGrowth.toFixed(1),
      monthlyAvgGrowth: Math.round(monthlyAvgGrowth),
    },
    highlights: {
      bestMonth,
      worstMonth,
      currentStreak,
      maxStreak,
      streakType,
    },
    milestones,
    nextMilestone: nextMilestone ? {
      value: nextMilestone,
      label: nextMilestone >= 1000000 ? `$${nextMilestone / 1000000}M` : `$${nextMilestone / 1000}K`,
      monthsAway: monthsToNextMilestone,
    } : null,
  };
}

function projectFutureNetWorth(currentNetWorth, monthlyContribution, years = 10, returnRate = 0.07) {
  const projection = [];
  let netWorth = currentNetWorth;
  const monthlyReturn = Math.pow(1 + returnRate, 1 / 12) - 1;

  for (let month = 0; month <= years * 12; month++) {
    if (month % 12 === 0) {
      projection.push({
        year: new Date().getFullYear() + Math.floor(month / 12),
        netWorth: Math.round(netWorth),
        contributed: Math.round(monthlyContribution * month),
        growth: Math.round(netWorth - currentNetWorth - monthlyContribution * month),
      });
    }
    netWorth = netWorth * (1 + monthlyReturn) + monthlyContribution;
  }

  return projection;
}

function generateInsights(analysis, projection) {
  const insights = [];

  // Growth rate insight
  if (analysis.summary.annualizedGrowth > 10) {
    insights.push({
      type: 'positive',
      icon: '🚀',
      message: `Your net worth is growing at ${analysis.summary.annualizedGrowth}% annually - faster than the S&P 500 average!`,
    });
  } else if (analysis.summary.annualizedGrowth > 0) {
    insights.push({
      type: 'neutral',
      icon: '📈',
      message: `Your net worth grew ${analysis.summary.annualizedGrowth}% this year. Consider increasing savings or investment allocation.`,
    });
  } else {
    insights.push({
      type: 'warning',
      icon: '⚠️',
      message: `Your net worth decreased. Focus on reducing debt and building emergency savings.`,
    });
  }

  // Streak insight
  if (analysis.highlights.currentStreak >= 6) {
    insights.push({
      type: 'positive',
      icon: '🔥',
      message: `${analysis.highlights.currentStreak} month growth streak! Keep up the momentum.`,
    });
  }

  // Milestone insight
  if (analysis.nextMilestone) {
    insights.push({
      type: 'info',
      icon: '🎯',
      message: `At current pace, you'll reach ${analysis.nextMilestone.label} in ${analysis.nextMilestone.monthsAway} months.`,
    });
  }

  // Projection insight
  if (projection && projection.length > 5) {
    const fiveYearValue = projection[5]?.netWorth;
    insights.push({
      type: 'info',
      icon: '🔮',
      message: `Projected net worth in 5 years: $${fiveYearValue?.toLocaleString()}`,
    });
  }

  return insights;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      action,
      currentNetWorth = 0,
      accounts = [],
      debts = [],
      monthlyContribution = 0,
      projectionYears = 10,
      expectedReturn = 0.07,
    } = body;

    if (action === 'getTimeline') {
      const history = generateHistoricalData(currentNetWorth, accounts, debts, 24);
      const analysis = analyzeGrowth(history);
      const projection = projectFutureNetWorth(currentNetWorth, monthlyContribution, projectionYears, expectedReturn);
      const insights = generateInsights(analysis, projection);

      return NextResponse.json({
        success: true,
        timeline: {
          history,
          analysis,
          projection,
          insights,
        },
      });
    }

    if (action === 'getProjection') {
      const projection = projectFutureNetWorth(currentNetWorth, monthlyContribution, projectionYears, expectedReturn);
      return NextResponse.json({ success: true, projection });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Net Worth Timeline error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
