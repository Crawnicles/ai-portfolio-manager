import { NextResponse } from 'next/server';

// Phase 16: Enhanced AI Financial Advisor
// Provides personalized wealth-building recommendations based on complete financial picture

function analyzeFinancialHealth({
  accounts = [],
  debts = [],
  monthlyIncome = 0,
  monthlyExpenses = 0,
  budgets = [],
  goals = [],
  taxProfile = {},
  retirementProfile = {},
  positions = [],
  transactions = [],
  trackedItems = [],
}) {
  // Calculate total assets
  const accountsTotal = accounts.reduce((sum, a) => sum + (parseFloat(a.balance) || 0), 0);
  const investmentsTotal = positions.reduce((sum, p) => sum + (parseFloat(p.market_value) || 0), 0);
  const totalAssets = accountsTotal + investmentsTotal;

  // Calculate total liabilities
  const totalDebts = debts.reduce((sum, d) => sum + (parseFloat(d.balance) || 0), 0);
  const netWorth = totalAssets - totalDebts;

  // Calculate monthly metrics
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome * 100) : 0;
  const debtToIncomeRatio = monthlyIncome > 0 ? (debts.reduce((sum, d) => sum + (parseFloat(d.minimumPayment) || 0), 0) / monthlyIncome * 100) : 0;

  // Find liquid savings (checking, savings, money market)
  const liquidAccounts = accounts.filter(a => ['checking', 'savings', 'money_market'].includes(a.type));
  const liquidSavings = liquidAccounts.reduce((sum, a) => sum + (parseFloat(a.balance) || 0), 0);
  const emergencyFundMonths = monthlyExpenses > 0 ? (liquidSavings / monthlyExpenses) : 0;

  // Calculate scores (0-100)
  const scores = {
    emergencyFund: Math.min(100, Math.round((emergencyFundMonths / 6) * 100)),
    debtManagement: Math.max(0, Math.round(100 - debtToIncomeRatio * 2)),
    savingsRate: Math.min(100, Math.round(savingsRate * 5)),
    investing: Math.min(100, Math.round((investmentsTotal / (totalAssets || 1)) * 100)),
  };

  const overallScore = Math.round((scores.emergencyFund + scores.debtManagement + scores.savingsRate + scores.investing) / 4);

  // Generate recommendations
  const recommendations = [];
  const actionPlan = { thisWeek: [], thisMonth: [], thisQuarter: [], thisYear: [] };

  // Emergency Fund Recommendations
  if (emergencyFundMonths < 3) {
    recommendations.push({
      category: 'Emergency Fund',
      priority: 'HIGH',
      title: 'Build Emergency Fund',
      description: `You have ${emergencyFundMonths.toFixed(1)} months of expenses saved. Aim for 3-6 months.`,
      impact: `Protect against unexpected expenses and job loss`,
      potentialSavings: monthlyExpenses * (3 - emergencyFundMonths),
      actionable: `Save $${Math.round(monthlyExpenses * 0.2).toLocaleString()} per month to reach 3 months in ${Math.ceil((3 - emergencyFundMonths) * monthlyExpenses / (monthlyExpenses * 0.2))} months`,
    });
    actionPlan.thisMonth.push('Set up automatic transfer to savings account');
  }

  // High Interest Debt Recommendations
  const highInterestDebts = debts.filter(d => parseFloat(d.interestRate) > 7);
  if (highInterestDebts.length > 0) {
    const highestRate = highInterestDebts.sort((a, b) => b.interestRate - a.interestRate)[0];
    recommendations.push({
      category: 'Debt Payoff',
      priority: 'HIGH',
      title: `Pay Off High-Interest Debt`,
      description: `Your ${highestRate.name} has ${highestRate.interestRate}% interest rate`,
      impact: `Save on interest and free up cash flow`,
      potentialSavings: Math.round(highestRate.balance * highestRate.interestRate / 100),
      actionable: `Pay extra $${Math.round(highestRate.balance * 0.05).toLocaleString()}/month to pay off ${Math.round(highestRate.balance / (parseFloat(highestRate.minimumPayment) * 2))} months faster`,
    });
    actionPlan.thisWeek.push(`Review ${highestRate.name} payoff options`);
  }

  // Savings Rate Recommendations
  if (savingsRate < 20) {
    recommendations.push({
      category: 'Savings',
      priority: savingsRate < 10 ? 'HIGH' : 'MEDIUM',
      title: 'Increase Savings Rate',
      description: `Your current savings rate is ${savingsRate.toFixed(1)}%. Aim for 20%+.`,
      impact: `Build wealth faster and reach financial independence sooner`,
      potentialSavings: monthlyIncome * 0.2 * 12 - (monthlyIncome - monthlyExpenses) * 12,
      actionable: `Find $${Math.round(monthlyIncome * 0.05).toLocaleString()} in monthly expenses to cut`,
    });
    actionPlan.thisMonth.push('Review subscriptions and recurring expenses');
  }

  // Investment Recommendations
  const retirementAccounts = accounts.filter(a => ['401k', 'ira', 'roth_ira', 'retirement'].includes(a.type?.toLowerCase()));
  const retirementTotal = retirementAccounts.reduce((sum, a) => sum + (parseFloat(a.balance) || 0), 0);

  if (investmentsTotal < totalAssets * 0.3) {
    recommendations.push({
      category: 'Investing',
      priority: 'MEDIUM',
      title: 'Increase Investment Allocation',
      description: `Only ${((investmentsTotal / totalAssets) * 100).toFixed(1)}% of assets are invested`,
      impact: `Grow wealth through compound returns over time`,
      potentialSavings: investmentsTotal * 0.07, // Assume 7% annual return
      actionable: `Consider investing additional cash beyond emergency fund`,
    });
    actionPlan.thisQuarter.push('Research low-cost index funds');
  }

  // Tax Optimization
  if (taxProfile.effectiveRate > 22) {
    recommendations.push({
      category: 'Tax Optimization',
      priority: 'MEDIUM',
      title: 'Reduce Tax Burden',
      description: `Your effective tax rate is ${taxProfile.effectiveRate}%`,
      impact: `Keep more of what you earn`,
      potentialSavings: monthlyIncome * 12 * 0.03,
      actionable: `Max out 401(k) and HSA contributions`,
    });
    actionPlan.thisYear.push('Review tax-advantaged account contributions');
  }

  // Retirement Planning
  if (retirementProfile.currentAge && retirementProfile.targetAge) {
    const yearsToRetirement = retirementProfile.targetAge - retirementProfile.currentAge;
    const neededForRetirement = retirementProfile.monthlyExpenses * 12 * 25; // 4% rule
    const projectedRetirement = retirementTotal * Math.pow(1.07, yearsToRetirement);

    if (projectedRetirement < neededForRetirement * 0.8) {
      recommendations.push({
        category: 'Retirement',
        priority: 'MEDIUM',
        title: 'Boost Retirement Savings',
        description: `On track for ${((projectedRetirement / neededForRetirement) * 100).toFixed(0)}% of retirement goal`,
        impact: `Ensure comfortable retirement`,
        potentialSavings: neededForRetirement - projectedRetirement,
        actionable: `Increase 401(k) contribution by 1% of salary`,
      });
      actionPlan.thisYear.push('Review retirement contribution limits');
    }
  }

  // Diversification
  if (positions.length > 0) {
    const techStocks = positions.filter(p => ['AAPL', 'MSFT', 'GOOGL', 'META', 'NVDA', 'AMD', 'AMZN'].includes(p.symbol));
    const techWeight = techStocks.reduce((sum, p) => sum + parseFloat(p.market_value || 0), 0) / investmentsTotal;

    if (techWeight > 0.5) {
      recommendations.push({
        category: 'Diversification',
        priority: 'LOW',
        title: 'Diversify Portfolio',
        description: `${(techWeight * 100).toFixed(0)}% of portfolio in tech stocks`,
        impact: `Reduce concentration risk`,
        potentialSavings: 0,
        actionable: `Consider adding healthcare, financial, or international stocks`,
      });
      actionPlan.thisQuarter.push('Rebalance portfolio allocation');
    }
  }

  // Goal Progress
  goals.forEach(goal => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const monthsRemaining = goal.deadline ? Math.max(0, Math.ceil((new Date(goal.deadline) - new Date()) / (30 * 24 * 60 * 60 * 1000))) : 12;
    const monthlyNeeded = monthsRemaining > 0 ? (goal.targetAmount - goal.currentAmount) / monthsRemaining : 0;

    if (progress < 50 && monthlyNeeded > 0) {
      recommendations.push({
        category: 'Goals',
        priority: 'LOW',
        title: `Accelerate "${goal.name}" Goal`,
        description: `${progress.toFixed(0)}% complete, need $${monthlyNeeded.toFixed(0)}/month`,
        impact: `Reach your goal on time`,
        potentialSavings: 0,
        actionable: `Set up automatic monthly contribution of $${Math.round(monthlyNeeded).toLocaleString()}`,
      });
    }
  });

  // Calculate wealth projection
  const wealthProjection = [];
  let projectedWealth = netWorth;
  const monthlyContribution = monthlyIncome - monthlyExpenses;
  const annualReturn = 0.07;

  for (let year = 0; year <= 10; year++) {
    wealthProjection.push({
      year: new Date().getFullYear() + year,
      wealth: Math.round(projectedWealth),
      invested: Math.round(investmentsTotal * Math.pow(1 + annualReturn, year)),
    });
    projectedWealth = projectedWealth * (1 + annualReturn) + monthlyContribution * 12;
  }

  return {
    netWorth,
    totalAssets,
    totalDebts,
    liquidSavings,
    emergencyFundMonths,
    savingsRate,
    debtToIncomeRatio,
    scores,
    overallScore,
    recommendations: recommendations.sort((a, b) => {
      const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }),
    actionPlan,
    wealthProjection,
  };
}

function answerFinancialQuestion(question, financialData) {
  const q = question.toLowerCase();

  if (q.includes('emergency') || q.includes('rainy day')) {
    const months = financialData.emergencyFundMonths || 0;
    return {
      answer: `You have ${months.toFixed(1)} months of expenses saved as an emergency fund. Financial experts recommend 3-6 months. ${months < 3 ? 'Consider prioritizing building this up for financial security.' : 'You\'re in good shape!'}`,
      confidence: 95,
    };
  }

  if (q.includes('debt') || q.includes('pay off') || q.includes('loan')) {
    const totalDebts = financialData.totalDebts || 0;
    const dti = financialData.debtToIncomeRatio || 0;
    return {
      answer: `Your total debt is $${totalDebts.toLocaleString()} with a debt-to-income ratio of ${dti.toFixed(1)}%. ${dti > 36 ? 'This is above the recommended 36%. Focus on paying down high-interest debt first.' : 'This is within healthy limits.'}`,
      confidence: 90,
    };
  }

  if (q.includes('save') || q.includes('saving')) {
    const rate = financialData.savingsRate || 0;
    return {
      answer: `Your current savings rate is ${rate.toFixed(1)}%. ${rate < 20 ? 'Aim for at least 20% to build wealth over time. Look for subscriptions or expenses you can reduce.' : 'Great job! You\'re saving a healthy amount.'}`,
      confidence: 92,
    };
  }

  if (q.includes('retire') || q.includes('retirement')) {
    return {
      answer: `Based on your current savings and the 4% rule, focus on maximizing tax-advantaged accounts like 401(k) and IRA. Consider increasing contributions by 1% each year.`,
      confidence: 85,
    };
  }

  if (q.includes('invest') || q.includes('stock') || q.includes('market')) {
    return {
      answer: `For long-term wealth building, consider a diversified portfolio of low-cost index funds. Your current portfolio shows ${financialData.scores?.investing || 0}/100 for investment allocation. Aim for consistent monthly contributions regardless of market conditions.`,
      confidence: 88,
    };
  }

  if (q.includes('net worth') || q.includes('worth')) {
    return {
      answer: `Your current net worth is $${(financialData.netWorth || 0).toLocaleString()}. This includes $${(financialData.totalAssets || 0).toLocaleString()} in assets minus $${(financialData.totalDebts || 0).toLocaleString()} in debts.`,
      confidence: 98,
    };
  }

  if (q.includes('tax') || q.includes('taxes')) {
    return {
      answer: `Consider tax optimization strategies: maximize pre-tax 401(k) contributions, use HSA if eligible, harvest tax losses in taxable accounts, and consider Roth conversions in low-income years.`,
      confidence: 82,
    };
  }

  return {
    answer: `Based on your financial profile, I'd recommend focusing on: ${financialData.recommendations?.[0]?.title || 'building an emergency fund'}. Your overall financial health score is ${financialData.overallScore || 0}/100.`,
    confidence: 75,
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, data } = body;

    if (action === 'analyze') {
      const analysis = analyzeFinancialHealth(data);
      return NextResponse.json({ success: true, analysis });
    }

    if (action === 'ask') {
      const { question, financialData } = data;
      const response = answerFinancialQuestion(question, financialData);
      return NextResponse.json({ success: true, response });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('AI Advisor error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
