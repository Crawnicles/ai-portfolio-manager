import { NextResponse } from 'next/server';

// Analyze cost per use for tracked items
function analyzeCostPerUse(item, usageHistory) {
  const totalCost = item.monthlyCost * (usageHistory.length > 0
    ? Math.ceil((new Date() - new Date(item.startDate)) / (1000 * 60 * 60 * 24 * 30))
    : 1);

  const totalUses = usageHistory.reduce((sum, entry) => sum + (entry.uses || 1), 0);
  const costPerUse = totalUses > 0 ? totalCost / totalUses : totalCost;

  // Calculate trend (last 3 months vs previous 3 months)
  const now = new Date();
  const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

  const recentUses = usageHistory.filter(u => new Date(u.date) >= threeMonthsAgo).reduce((sum, u) => sum + (u.uses || 1), 0);
  const previousUses = usageHistory.filter(u => new Date(u.date) >= sixMonthsAgo && new Date(u.date) < threeMonthsAgo).reduce((sum, u) => sum + (u.uses || 1), 0);

  const trend = previousUses > 0
    ? ((recentUses - previousUses) / previousUses * 100).toFixed(0)
    : recentUses > 0 ? 100 : 0;

  // Calculate monthly averages
  const monthlyUses = {};
  usageHistory.forEach(entry => {
    const month = entry.date.substring(0, 7); // YYYY-MM
    monthlyUses[month] = (monthlyUses[month] || 0) + (entry.uses || 1);
  });

  const monthsTracked = Object.keys(monthlyUses).length || 1;
  const avgUsesPerMonth = totalUses / monthsTracked;

  // Determine value rating
  let valueRating = 'poor';
  let recommendation = '';

  if (item.targetCostPerUse) {
    if (costPerUse <= item.targetCostPerUse) {
      valueRating = 'excellent';
      recommendation = `Great value! You're beating your target of $${item.targetCostPerUse}/use.`;
    } else if (costPerUse <= item.targetCostPerUse * 1.5) {
      valueRating = 'good';
      recommendation = `Close to your target. Try to use ${Math.ceil((totalCost / item.targetCostPerUse) - totalUses)} more times this period.`;
    } else if (costPerUse <= item.targetCostPerUse * 2) {
      valueRating = 'fair';
      recommendation = `Underutilized. Consider using more or finding alternatives.`;
    } else {
      valueRating = 'poor';
      recommendation = `Not getting value. Consider canceling - you'd need ${Math.ceil(totalCost / item.targetCostPerUse)} uses to hit target.`;
    }
  } else {
    // Default thresholds based on category
    const thresholds = {
      gym: { excellent: 5, good: 10, fair: 20 },
      streaming: { excellent: 2, good: 5, fair: 10 },
      subscription: { excellent: 5, good: 15, fair: 30 },
      membership: { excellent: 10, good: 25, fair: 50 },
      default: { excellent: 5, good: 15, fair: 30 },
    };
    const t = thresholds[item.category] || thresholds.default;

    if (costPerUse <= t.excellent) {
      valueRating = 'excellent';
      recommendation = 'Excellent value for money!';
    } else if (costPerUse <= t.good) {
      valueRating = 'good';
      recommendation = 'Good value. Keep using regularly.';
    } else if (costPerUse <= t.fair) {
      valueRating = 'fair';
      recommendation = 'Consider increasing usage to improve value.';
    } else {
      valueRating = 'poor';
      recommendation = 'Consider canceling or finding a cheaper alternative.';
    }
  }

  // Calculate break-even uses needed
  const usesNeededForTarget = item.targetCostPerUse
    ? Math.ceil(item.monthlyCost / item.targetCostPerUse)
    : null;

  return {
    itemId: item.id,
    name: item.name,
    category: item.category,
    monthlyCost: item.monthlyCost,
    totalCost: Math.round(totalCost * 100) / 100,
    totalUses,
    costPerUse: Math.round(costPerUse * 100) / 100,
    avgUsesPerMonth: Math.round(avgUsesPerMonth * 10) / 10,
    monthsTracked,
    trend: parseInt(trend),
    trendDirection: parseInt(trend) > 0 ? 'up' : parseInt(trend) < 0 ? 'down' : 'stable',
    valueRating,
    recommendation,
    targetCostPerUse: item.targetCostPerUse,
    usesNeededForTarget,
    monthlyBreakdown: Object.entries(monthlyUses)
      .map(([month, uses]) => ({ month, uses }))
      .sort((a, b) => a.month.localeCompare(b.month)),
  };
}

// Generate overall subscription health report
function generateSubscriptionReport(items, usageHistories) {
  const analyses = items.map(item => {
    const history = usageHistories[item.id] || [];
    return analyzeCostPerUse(item, history);
  });

  // Calculate totals
  const totalMonthlyCost = items.reduce((sum, item) => sum + item.monthlyCost, 0);
  const totalAnnualCost = totalMonthlyCost * 12;

  // Categorize by value rating
  const byRating = {
    excellent: analyses.filter(a => a.valueRating === 'excellent'),
    good: analyses.filter(a => a.valueRating === 'good'),
    fair: analyses.filter(a => a.valueRating === 'fair'),
    poor: analyses.filter(a => a.valueRating === 'poor'),
  };

  // Potential savings from poor value items
  const potentialMonthlySavings = byRating.poor.reduce((sum, a) => sum + a.monthlyCost, 0);
  const potentialAnnualSavings = potentialMonthlySavings * 12;

  // Top recommendations
  const recommendations = [];

  byRating.poor.forEach(item => {
    recommendations.push({
      type: 'cancel',
      priority: 1,
      item: item.name,
      message: `Consider canceling ${item.name} - $${item.costPerUse.toFixed(2)}/use is too high`,
      savings: item.monthlyCost,
    });
  });

  byRating.fair.forEach(item => {
    recommendations.push({
      type: 'improve',
      priority: 2,
      item: item.name,
      message: `Increase usage of ${item.name} to improve value`,
      targetUses: item.usesNeededForTarget,
    });
  });

  // Underutilized categories
  const categoryStats = {};
  analyses.forEach(a => {
    if (!categoryStats[a.category]) {
      categoryStats[a.category] = { total: 0, poor: 0, cost: 0 };
    }
    categoryStats[a.category].total++;
    if (a.valueRating === 'poor') categoryStats[a.category].poor++;
    categoryStats[a.category].cost += a.monthlyCost;
  });

  return {
    analyses,
    summary: {
      totalItems: items.length,
      totalMonthlyCost: Math.round(totalMonthlyCost * 100) / 100,
      totalAnnualCost: Math.round(totalAnnualCost * 100) / 100,
      potentialMonthlySavings: Math.round(potentialMonthlySavings * 100) / 100,
      potentialAnnualSavings: Math.round(potentialAnnualSavings * 100) / 100,
      byRating: {
        excellent: byRating.excellent.length,
        good: byRating.good.length,
        fair: byRating.fair.length,
        poor: byRating.poor.length,
      },
      averageCostPerUse: analyses.length > 0
        ? Math.round((analyses.reduce((sum, a) => sum + a.costPerUse, 0) / analyses.length) * 100) / 100
        : 0,
    },
    recommendations: recommendations.sort((a, b) => a.priority - b.priority),
    categoryStats,
  };
}

export async function POST(request) {
  try {
    const { action, item, items, usageHistory, usageHistories } = await request.json();

    switch (action) {
      case 'analyze':
        if (!item) {
          return NextResponse.json({ error: 'Item required' }, { status: 400 });
        }
        return NextResponse.json(analyzeCostPerUse(item, usageHistory || []));

      case 'report':
        if (!items) {
          return NextResponse.json({ error: 'Items required' }, { status: 400 });
        }
        return NextResponse.json(generateSubscriptionReport(items, usageHistories || {}));

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Cost-benefit analysis error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
