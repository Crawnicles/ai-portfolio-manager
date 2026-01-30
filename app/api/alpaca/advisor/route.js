// AI Financial Advisor - Phase 4
// Analyzes complete financial picture and provides actionable advice

export async function POST(request) {
  try {
    const { accounts, debts, positions, preferences } = await request.json();

    const analysis = analyzeFinancialSituation(accounts, debts, positions, preferences);
    const recommendations = generateRecommendations(analysis, preferences);
    const debtStrategy = analyzeDebtPayoff(debts, analysis);
    const investmentStrategy = analyzeInvestmentOpportunities(analysis, positions);

    return Response.json({
      analysis,
      recommendations,
      debtStrategy,
      investmentStrategy,
      generatedAt: new Date().toISOString()
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

function analyzeFinancialSituation(accounts, debts, positions, preferences) {
  // Calculate totals
  const totalAssets = (accounts || []).reduce((sum, acc) => sum + (acc.balance || 0), 0);
  const totalLiabilities = (debts || []).reduce((sum, d) => sum + (d.balance || 0), 0);
  const netWorth = totalAssets - totalLiabilities;

  // Categorize assets
  const liquidAssets = (accounts || [])
    .filter(a => ['checking', 'savings'].includes(a.type))
    .reduce((sum, a) => sum + a.balance, 0);

  const investedAssets = (accounts || [])
    .filter(a => ['investment', 'retirement', 'crypto', 'partnership'].includes(a.type))
    .reduce((sum, a) => sum + a.balance, 0);

  // Calculate debt metrics
  const highInterestDebt = (debts || [])
    .filter(d => d.interestRate > 6)
    .reduce((sum, d) => sum + d.balance, 0);

  const lowInterestDebt = (debts || [])
    .filter(d => d.interestRate <= 6)
    .reduce((sum, d) => sum + d.balance, 0);

  const weightedAvgRate = debts && debts.length > 0
    ? debts.reduce((sum, d) => sum + (d.balance * d.interestRate), 0) / totalLiabilities
    : 0;

  const monthlyDebtPayments = (debts || [])
    .reduce((sum, d) => sum + (d.minimumPayment || 0), 0);

  // Emergency fund analysis (3-6 months of expenses estimated)
  const estimatedMonthlyExpenses = monthlyDebtPayments + 3000; // Rough estimate
  const emergencyFundMonths = liquidAssets / estimatedMonthlyExpenses;

  // Debt-to-income ratio (rough estimate)
  const annualDebtPayments = monthlyDebtPayments * 12;
  const estimatedIncome = totalAssets * 0.1 + 60000; // Rough estimate
  const debtToIncomeRatio = annualDebtPayments / estimatedIncome;

  // Investment allocation
  const portfolioValue = (positions || []).reduce((sum, p) => sum + parseFloat(p.market_value || 0), 0);

  return {
    netWorth,
    totalAssets,
    totalLiabilities,
    liquidAssets,
    investedAssets,
    portfolioValue,
    highInterestDebt,
    lowInterestDebt,
    weightedAvgRate,
    monthlyDebtPayments,
    emergencyFundMonths,
    debtToIncomeRatio,
    cashRatio: totalAssets > 0 ? liquidAssets / totalAssets : 0,
    debtRatio: totalAssets > 0 ? totalLiabilities / totalAssets : 0,
    healthScore: calculateHealthScore({
      emergencyFundMonths,
      debtToIncomeRatio,
      highInterestDebt,
      netWorth,
      cashRatio: liquidAssets / totalAssets
    })
  };
}

function calculateHealthScore(metrics) {
  let score = 50; // Base score

  // Emergency fund (0-20 points)
  if (metrics.emergencyFundMonths >= 6) score += 20;
  else if (metrics.emergencyFundMonths >= 3) score += 15;
  else if (metrics.emergencyFundMonths >= 1) score += 5;

  // Debt-to-income (0-20 points)
  if (metrics.debtToIncomeRatio < 0.2) score += 20;
  else if (metrics.debtToIncomeRatio < 0.35) score += 15;
  else if (metrics.debtToIncomeRatio < 0.5) score += 5;

  // High interest debt (0-15 points, penalize if exists)
  if (metrics.highInterestDebt === 0) score += 15;
  else if (metrics.highInterestDebt < 5000) score += 10;
  else if (metrics.highInterestDebt < 20000) score += 5;

  // Net worth positive (0-10 points)
  if (metrics.netWorth > 100000) score += 10;
  else if (metrics.netWorth > 50000) score += 7;
  else if (metrics.netWorth > 0) score += 5;

  // Cash ratio balance (0-10 points) - not too high, not too low
  if (metrics.cashRatio >= 0.1 && metrics.cashRatio <= 0.3) score += 10;
  else if (metrics.cashRatio >= 0.05 && metrics.cashRatio <= 0.4) score += 5;

  return Math.min(100, Math.max(0, score));
}

function generateRecommendations(analysis, preferences) {
  const recommendations = [];
  const riskTolerance = preferences?.riskTolerance || 'moderate';

  // Emergency fund recommendations
  if (analysis.emergencyFundMonths < 3) {
    recommendations.push({
      priority: 'high',
      category: 'emergency_fund',
      title: 'Build Emergency Fund',
      description: `You have ${analysis.emergencyFundMonths.toFixed(1)} months of expenses saved. Target 3-6 months.`,
      action: `Save $${((3 - analysis.emergencyFundMonths) * (analysis.liquidAssets / Math.max(0.1, analysis.emergencyFundMonths))).toFixed(0)} more to reach 3-month target.`,
      impact: 'Protects against unexpected expenses and job loss'
    });
  }

  // High interest debt
  if (analysis.highInterestDebt > 0) {
    recommendations.push({
      priority: 'high',
      category: 'debt',
      title: 'Pay Down High-Interest Debt',
      description: `You have $${analysis.highInterestDebt.toLocaleString()} in high-interest debt (>6% APR).`,
      action: 'Prioritize paying this before investing beyond employer 401k match.',
      impact: `Guaranteed ${analysis.weightedAvgRate.toFixed(1)}% return on money used to pay debt`
    });
  }

  // Cash drag
  if (analysis.cashRatio > 0.3 && analysis.highInterestDebt === 0) {
    recommendations.push({
      priority: 'medium',
      category: 'allocation',
      title: 'Excess Cash Position',
      description: `${(analysis.cashRatio * 100).toFixed(0)}% of assets in cash may be dragging returns.`,
      action: riskTolerance === 'conservative'
        ? 'Consider high-yield savings or CDs'
        : 'Consider deploying into diversified investments',
      impact: 'Cash loses value to inflation over time'
    });
  }

  // Low cash warning
  if (analysis.cashRatio < 0.05 && analysis.emergencyFundMonths < 1) {
    recommendations.push({
      priority: 'high',
      category: 'liquidity',
      title: 'Dangerously Low Liquidity',
      description: 'Less than 1 month of expenses in liquid assets.',
      action: 'Build cash reserves before making additional investments.',
      impact: 'Risk of needing to sell investments at bad times'
    });
  }

  // Retirement contribution
  if (analysis.investedAssets < analysis.totalAssets * 0.5) {
    recommendations.push({
      priority: 'medium',
      category: 'retirement',
      title: 'Increase Retirement Savings',
      description: 'Less than 50% of assets in growth investments.',
      action: 'Max out Roth IRA ($7,000/year) before taxable accounts.',
      impact: 'Tax-free growth compounds significantly over time'
    });
  }

  // Positive feedback
  if (analysis.healthScore >= 80) {
    recommendations.push({
      priority: 'low',
      category: 'general',
      title: 'Strong Financial Position',
      description: `Your financial health score is ${analysis.healthScore}/100.`,
      action: 'Focus on optimization: tax-loss harvesting, asset location, rebalancing.',
      impact: 'Fine-tuning can add 0.5-1% annually'
    });
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

function analyzeDebtPayoff(debts, analysis) {
  if (!debts || debts.length === 0) {
    return {
      hasDebt: false,
      strategy: null,
      projections: []
    };
  }

  const sortedByRate = [...debts].sort((a, b) => b.interestRate - a.interestRate);
  const sortedByBalance = [...debts].sort((a, b) => a.balance - b.balance);

  // Calculate avalanche vs snowball
  const avalancheOrder = sortedByRate.map(d => ({
    name: d.name,
    balance: d.balance,
    rate: d.interestRate,
    priority: sortedByRate.indexOf(d) + 1
  }));

  const snowballOrder = sortedByBalance.map(d => ({
    name: d.name,
    balance: d.balance,
    rate: d.interestRate,
    priority: sortedByBalance.indexOf(d) + 1
  }));

  // Determine recommended strategy
  const highestRate = Math.max(...debts.map(d => d.interestRate));
  const strategy = highestRate > 7
    ? 'avalanche'
    : analysis.debtToIncomeRatio > 0.4
      ? 'snowball'
      : 'avalanche';

  // Calculate payoff projections
  const extraPayment = Math.max(0, analysis.liquidAssets - (analysis.monthlyDebtPayments * 3));
  const monthlyExtra = extraPayment > 0 ? extraPayment * 0.1 : 0; // 10% of excess liquid

  return {
    hasDebt: true,
    totalDebt: analysis.totalLiabilities,
    weightedRate: analysis.weightedAvgRate,
    recommendedStrategy: strategy,
    strategyReason: strategy === 'avalanche'
      ? 'Avalanche method saves the most in interest payments'
      : 'Snowball method provides psychological wins to stay motivated',
    avalancheOrder,
    snowballOrder,
    extraPaymentSuggestion: monthlyExtra,
    payoffAcceleration: monthlyExtra > 0
      ? `Adding $${monthlyExtra.toFixed(0)}/month could save months of payments`
      : 'Build emergency fund before extra debt payments'
  };
}

function analyzeInvestmentOpportunities(analysis, positions) {
  const opportunities = [];

  // Tax-advantaged space
  if (analysis.liquidAssets > analysis.monthlyDebtPayments * 6) {
    opportunities.push({
      type: 'roth_ira',
      title: 'Max Roth IRA Contribution',
      amount: 7000,
      description: 'Tax-free growth and withdrawals in retirement',
      priority: analysis.highInterestDebt === 0 ? 'high' : 'medium'
    });
  }

  // I-Bonds for inflation protection
  if (analysis.cashRatio > 0.2) {
    opportunities.push({
      type: 'i_bonds',
      title: 'Consider I-Bonds',
      amount: 10000,
      description: 'Inflation-protected savings, $10k/year limit',
      priority: 'low'
    });
  }

  // Diversification check
  if (positions && positions.length > 0) {
    const techHeavy = positions.filter(p =>
      ['AAPL', 'MSFT', 'GOOGL', 'NVDA', 'META', 'AMD', 'TSLA'].includes(p.symbol)
    );
    const techWeight = techHeavy.reduce((sum, p) => sum + parseFloat(p.market_value), 0) /
                       positions.reduce((sum, p) => sum + parseFloat(p.market_value), 0);

    if (techWeight > 0.5) {
      opportunities.push({
        type: 'diversification',
        title: 'Consider Diversifying',
        description: `${(techWeight * 100).toFixed(0)}% in tech. Consider international, bonds, or other sectors.`,
        priority: 'medium'
      });
    }
  }

  return opportunities;
}
