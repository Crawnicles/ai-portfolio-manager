import { NextResponse } from 'next/server';

// Predict cash flow for the next N months
function forecastCashFlow({
  monthlyIncome,
  recurringExpenses,
  transactions,
  budgets,
  plannedExpenses,
  forecastMonths = 6,
}) {
  const today = new Date();
  const forecasts = [];

  // Analyze historical spending patterns
  const monthlySpending = {};
  const categorySpending = {};

  transactions.forEach(tx => {
    if (!tx.isExpense) return;
    const month = tx.date.substring(0, 7); // YYYY-MM
    const cat = tx.primaryCategory || tx.standardCategory || 'Other';
    const amount = Math.abs(tx.amount);

    monthlySpending[month] = (monthlySpending[month] || 0) + amount;

    if (!categorySpending[cat]) {
      categorySpending[cat] = { total: 0, months: new Set() };
    }
    categorySpending[cat].total += amount;
    categorySpending[cat].months.add(month);
  });

  // Calculate averages
  const monthKeys = Object.keys(monthlySpending).sort();
  const recentMonths = monthKeys.slice(-3); // Last 3 months for average
  const avgMonthlySpending = recentMonths.length > 0
    ? recentMonths.reduce((sum, m) => sum + monthlySpending[m], 0) / recentMonths.length
    : 0;

  // Calculate category averages
  const categoryAverages = {};
  Object.entries(categorySpending).forEach(([cat, data]) => {
    const monthCount = data.months.size || 1;
    categoryAverages[cat] = Math.round((data.total / monthCount) * 100) / 100;
  });

  // Calculate recurring expenses total
  const totalRecurring = recurringExpenses.reduce((sum, exp) => {
    const amount = Math.abs(exp.estimatedAmount || exp.amount || 0);
    if (exp.frequency === 'weekly') return sum + amount * 4.33;
    if (exp.frequency === 'bi-weekly') return sum + amount * 2.17;
    return sum + amount; // monthly
  }, 0);

  // Generate monthly forecasts
  for (let i = 0; i < forecastMonths; i++) {
    const forecastDate = new Date(today.getFullYear(), today.getMonth() + i + 1, 1);
    const monthStr = forecastDate.toISOString().substring(0, 7);
    const monthName = forecastDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    // Base income
    let projectedIncome = monthlyIncome;

    // Check for known income variations (bonuses, etc.)
    const incomeAdjustments = [];

    // Base expenses = recurring + estimated variable
    let projectedExpenses = totalRecurring;

    // Add variable spending estimate (non-recurring)
    const variableSpending = Math.max(0, avgMonthlySpending - totalRecurring);
    projectedExpenses += variableSpending;

    // Add planned expenses for this month
    const monthPlannedExpenses = (plannedExpenses || []).filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getFullYear() === forecastDate.getFullYear() &&
             expDate.getMonth() === forecastDate.getMonth();
    });

    const plannedTotal = monthPlannedExpenses.reduce((sum, exp) => sum + Math.abs(exp.amount), 0);
    projectedExpenses += plannedTotal;

    // Calculate net and cumulative
    const netCashFlow = projectedIncome - projectedExpenses;
    const previousBalance = i > 0 ? forecasts[i - 1].endingBalance : 0;
    const endingBalance = previousBalance + netCashFlow;

    // Determine status
    let status = 'healthy';
    if (netCashFlow < 0) status = 'deficit';
    else if (netCashFlow < monthlyIncome * 0.1) status = 'tight';
    else if (netCashFlow > monthlyIncome * 0.3) status = 'surplus';

    forecasts.push({
      month: monthStr,
      monthName,
      projectedIncome: Math.round(projectedIncome * 100) / 100,
      projectedExpenses: Math.round(projectedExpenses * 100) / 100,
      recurringExpenses: Math.round(totalRecurring * 100) / 100,
      variableExpenses: Math.round(variableSpending * 100) / 100,
      plannedExpenses: Math.round(plannedTotal * 100) / 100,
      plannedItems: monthPlannedExpenses,
      netCashFlow: Math.round(netCashFlow * 100) / 100,
      endingBalance: Math.round(endingBalance * 100) / 100,
      status,
      savingsRate: projectedIncome > 0 ? Math.round((netCashFlow / projectedIncome) * 100) : 0,
    });
  }

  // Calculate summary statistics
  const avgNetCashFlow = forecasts.reduce((sum, f) => sum + f.netCashFlow, 0) / forecasts.length;
  const minNetCashFlow = Math.min(...forecasts.map(f => f.netCashFlow));
  const maxNetCashFlow = Math.max(...forecasts.map(f => f.netCashFlow));
  const totalProjectedSavings = forecasts.reduce((sum, f) => sum + Math.max(0, f.netCashFlow), 0);

  // Generate insights
  const insights = [];

  // Check for deficit months
  const deficitMonths = forecasts.filter(f => f.status === 'deficit');
  if (deficitMonths.length > 0) {
    insights.push({
      type: 'warning',
      title: 'Projected Deficits',
      message: `${deficitMonths.length} month(s) show projected deficits. Consider reducing variable spending or deferring planned expenses.`,
      months: deficitMonths.map(f => f.monthName),
    });
  }

  // Check for surplus opportunities
  const surplusMonths = forecasts.filter(f => f.status === 'surplus');
  if (surplusMonths.length > 0) {
    const surplusTotal = surplusMonths.reduce((sum, f) => sum + f.netCashFlow, 0);
    insights.push({
      type: 'opportunity',
      title: 'Savings Opportunity',
      message: `${surplusMonths.length} month(s) show strong surplus. Consider allocating $${Math.round(surplusTotal).toLocaleString()} to investments or debt paydown.`,
    });
  }

  // Check savings rate
  const avgSavingsRate = forecasts.reduce((sum, f) => sum + f.savingsRate, 0) / forecasts.length;
  if (avgSavingsRate < 10) {
    insights.push({
      type: 'alert',
      title: 'Low Savings Rate',
      message: `Average projected savings rate is ${Math.round(avgSavingsRate)}%. Aim for at least 20% for long-term financial health.`,
    });
  } else if (avgSavingsRate >= 20) {
    insights.push({
      type: 'positive',
      title: 'Strong Savings Rate',
      message: `Average projected savings rate of ${Math.round(avgSavingsRate)}% puts you on track for your financial goals.`,
    });
  }

  // High recurring expense warning
  const recurringPct = monthlyIncome > 0 ? (totalRecurring / monthlyIncome) * 100 : 0;
  if (recurringPct > 50) {
    insights.push({
      type: 'warning',
      title: 'High Fixed Expenses',
      message: `${Math.round(recurringPct)}% of income goes to recurring expenses. Consider reviewing subscriptions and fixed costs.`,
    });
  }

  return {
    forecasts,
    summary: {
      monthlyIncome,
      avgMonthlySpending: Math.round(avgMonthlySpending * 100) / 100,
      totalRecurring: Math.round(totalRecurring * 100) / 100,
      avgNetCashFlow: Math.round(avgNetCashFlow * 100) / 100,
      minNetCashFlow: Math.round(minNetCashFlow * 100) / 100,
      maxNetCashFlow: Math.round(maxNetCashFlow * 100) / 100,
      totalProjectedSavings: Math.round(totalProjectedSavings * 100) / 100,
      avgSavingsRate: Math.round(avgSavingsRate),
      healthyMonths: forecasts.filter(f => f.status === 'healthy' || f.status === 'surplus').length,
      deficitMonths: deficitMonths.length,
    },
    insights,
    categoryAverages,
  };
}

// What-if scenario analysis
function runScenario({
  baselineData,
  scenario,
}) {
  const modifiedData = { ...baselineData };

  switch (scenario.type) {
    case 'income_change':
      modifiedData.monthlyIncome = baselineData.monthlyIncome * (1 + scenario.percentChange / 100);
      break;

    case 'expense_reduction':
      // Reduce variable spending by percentage
      modifiedData.recurringExpenses = baselineData.recurringExpenses.map(exp => ({
        ...exp,
        estimatedAmount: (exp.estimatedAmount || exp.amount) * (1 - scenario.percentChange / 100),
      }));
      break;

    case 'add_expense':
      modifiedData.plannedExpenses = [
        ...(baselineData.plannedExpenses || []),
        { date: scenario.date, amount: scenario.amount, description: scenario.description },
      ];
      break;

    case 'remove_recurring':
      modifiedData.recurringExpenses = baselineData.recurringExpenses.filter(
        exp => exp.id !== scenario.expenseId
      );
      break;

    case 'emergency':
      // Add a large unexpected expense
      modifiedData.plannedExpenses = [
        ...(baselineData.plannedExpenses || []),
        { date: new Date().toISOString().split('T')[0], amount: scenario.amount, description: 'Emergency expense' },
      ];
      break;
  }

  const scenarioForecast = forecastCashFlow(modifiedData);

  return {
    scenario: scenario.type,
    description: scenario.description || scenario.type,
    baseline: baselineData,
    modified: scenarioForecast,
    impact: {
      netCashFlowChange: scenarioForecast.summary.avgNetCashFlow - baselineData.summary?.avgNetCashFlow || 0,
      savingsRateChange: scenarioForecast.summary.avgSavingsRate - baselineData.summary?.avgSavingsRate || 0,
    },
  };
}

// Calculate financial runway (how long until you run out of money)
function calculateRunway({
  currentBalance,
  monthlyIncome,
  avgMonthlyExpenses,
}) {
  if (monthlyIncome >= avgMonthlyExpenses) {
    return {
      hasRunway: true,
      months: Infinity,
      message: 'Your income exceeds expenses - you have unlimited runway!',
      monthlyBuffer: monthlyIncome - avgMonthlyExpenses,
    };
  }

  const monthlyBurn = avgMonthlyExpenses - monthlyIncome;
  const months = currentBalance / monthlyBurn;

  return {
    hasRunway: false,
    months: Math.floor(months),
    message: `At current spending, savings will last ${Math.floor(months)} months.`,
    monthlyBurn: Math.round(monthlyBurn * 100) / 100,
    recommendation: monthlyBurn > 500
      ? 'Consider significant expense reductions or increasing income.'
      : 'Minor adjustments could balance your budget.',
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'forecast':
        const forecast = forecastCashFlow({
          monthlyIncome: body.monthlyIncome || 0,
          recurringExpenses: body.recurringExpenses || [],
          transactions: body.transactions || [],
          budgets: body.budgets || {},
          plannedExpenses: body.plannedExpenses || [],
          forecastMonths: body.forecastMonths || 6,
        });
        return NextResponse.json(forecast);

      case 'scenario':
        const scenarioResult = runScenario({
          baselineData: body.baselineData,
          scenario: body.scenario,
        });
        return NextResponse.json(scenarioResult);

      case 'runway':
        const runway = calculateRunway({
          currentBalance: body.currentBalance || 0,
          monthlyIncome: body.monthlyIncome || 0,
          avgMonthlyExpenses: body.avgMonthlyExpenses || 0,
        });
        return NextResponse.json(runway);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Cash flow forecast error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
