import { NextResponse } from 'next/server';

// Phase 18: Debt Payoff Optimizer
// Calculates optimal debt payoff strategies using avalanche, snowball, and hybrid methods

function calculateDebtPayoffPlan(debts, monthlyBudget, strategy = 'avalanche') {
  if (!debts || debts.length === 0 || monthlyBudget <= 0) {
    return { error: 'Invalid input', plans: [] };
  }

  // Calculate minimum required payment
  const totalMinimum = debts.reduce((sum, d) => sum + parseFloat(d.minimumPayment || 0), 0);

  if (monthlyBudget < totalMinimum) {
    return {
      error: `Monthly budget ($${monthlyBudget}) is less than minimum payments ($${totalMinimum.toFixed(2)})`,
      plans: [],
    };
  }

  const extraPayment = monthlyBudget - totalMinimum;

  // Sort debts based on strategy
  const sortedDebts = [...debts].map(d => ({
    ...d,
    balance: parseFloat(d.balance),
    interestRate: parseFloat(d.interestRate),
    minimumPayment: parseFloat(d.minimumPayment),
  }));

  if (strategy === 'avalanche') {
    // Pay highest interest first
    sortedDebts.sort((a, b) => b.interestRate - a.interestRate);
  } else if (strategy === 'snowball') {
    // Pay smallest balance first
    sortedDebts.sort((a, b) => a.balance - b.balance);
  } else if (strategy === 'hybrid') {
    // Balance between interest and quick wins
    sortedDebts.sort((a, b) => {
      const scoreA = (a.interestRate / 10) + (10000 / a.balance);
      const scoreB = (b.interestRate / 10) + (10000 / b.balance);
      return scoreB - scoreA;
    });
  }

  // Simulate payoff
  const debtsCopy = sortedDebts.map(d => ({ ...d, remainingBalance: d.balance }));
  const payoffSchedule = [];
  let month = 0;
  let totalInterestPaid = 0;
  let paidOffDebts = [];

  while (debtsCopy.some(d => d.remainingBalance > 0) && month < 360) { // Max 30 years
    month++;
    let availableExtra = extraPayment;

    // Apply interest and minimum payments
    debtsCopy.forEach(debt => {
      if (debt.remainingBalance > 0) {
        // Monthly interest
        const monthlyInterest = (debt.remainingBalance * debt.interestRate / 100) / 12;
        totalInterestPaid += monthlyInterest;
        debt.remainingBalance += monthlyInterest;

        // Minimum payment
        const payment = Math.min(debt.minimumPayment, debt.remainingBalance);
        debt.remainingBalance -= payment;

        if (debt.remainingBalance <= 0.01) {
          debt.remainingBalance = 0;
          paidOffDebts.push({ name: debt.name, month });
          availableExtra += debt.minimumPayment; // Freed up minimum goes to extra
        }
      }
    });

    // Apply extra payment to priority debt
    for (const debt of debtsCopy) {
      if (debt.remainingBalance > 0 && availableExtra > 0) {
        const extraApplied = Math.min(availableExtra, debt.remainingBalance);
        debt.remainingBalance -= extraApplied;
        availableExtra -= extraApplied;

        if (debt.remainingBalance <= 0.01) {
          debt.remainingBalance = 0;
          if (!paidOffDebts.find(p => p.name === debt.name)) {
            paidOffDebts.push({ name: debt.name, month });
          }
        }
      }
    }

    // Record monthly snapshot (every 6 months for efficiency)
    if (month % 6 === 0 || month === 1) {
      payoffSchedule.push({
        month,
        totalRemaining: debtsCopy.reduce((sum, d) => sum + d.remainingBalance, 0),
        interestPaid: totalInterestPaid,
      });
    }
  }

  const totalPaid = debts.reduce((sum, d) => sum + parseFloat(d.balance), 0) + totalInterestPaid;

  return {
    strategy,
    totalMonths: month,
    totalInterestPaid: Math.round(totalInterestPaid),
    totalPaid: Math.round(totalPaid),
    payoffOrder: paidOffDebts,
    monthlyBudget,
    extraPayment,
    schedule: payoffSchedule,
  };
}

function compareStrategies(debts, monthlyBudget) {
  const strategies = ['avalanche', 'snowball', 'hybrid'];
  const results = {};

  strategies.forEach(strategy => {
    results[strategy] = calculateDebtPayoffPlan(debts, monthlyBudget, strategy);
  });

  // Find best strategy
  const validResults = Object.entries(results).filter(([_, r]) => !r.error);
  if (validResults.length === 0) {
    return { error: 'Unable to calculate any strategy', results: {} };
  }

  const bestByInterest = validResults.sort((a, b) => a[1].totalInterestPaid - b[1].totalInterestPaid)[0];
  const bestByTime = validResults.sort((a, b) => a[1].totalMonths - b[1].totalMonths)[0];

  return {
    results,
    recommendation: {
      lowestInterest: bestByInterest[0],
      interestSaved: results.snowball.totalInterestPaid - bestByInterest[1].totalInterestPaid,
      fastestPayoff: bestByTime[0],
      timeSaved: results.snowball.totalMonths - bestByTime[1].totalMonths,
    },
  };
}

function generateDebtInsights(debts) {
  if (!debts || debts.length === 0) {
    return { insights: [] };
  }

  const insights = [];
  const totalDebt = debts.reduce((sum, d) => sum + parseFloat(d.balance || 0), 0);
  const avgRate = debts.reduce((sum, d) => sum + parseFloat(d.interestRate || 0), 0) / debts.length;
  const highestRate = Math.max(...debts.map(d => parseFloat(d.interestRate || 0)));
  const lowestBalance = Math.min(...debts.map(d => parseFloat(d.balance || 0)));

  // High interest warning
  const highInterestDebts = debts.filter(d => parseFloat(d.interestRate) > 15);
  if (highInterestDebts.length > 0) {
    insights.push({
      type: 'warning',
      title: 'High Interest Alert',
      message: `${highInterestDebts.length} debt(s) have interest rates above 15%. Consider balance transfer or refinancing options.`,
      priority: 'high',
    });
  }

  // Quick win opportunity
  const quickWins = debts.filter(d => parseFloat(d.balance) < 2000);
  if (quickWins.length > 0) {
    insights.push({
      type: 'opportunity',
      title: 'Quick Win Available',
      message: `${quickWins[0].name} has a balance of $${parseFloat(quickWins[0].balance).toLocaleString()}. Paying this off quickly can boost motivation and free up $${parseFloat(quickWins[0].minimumPayment).toFixed(0)}/month.`,
      priority: 'medium',
    });
  }

  // Refinance suggestion
  if (avgRate > 10) {
    insights.push({
      type: 'suggestion',
      title: 'Consider Refinancing',
      message: `Your average interest rate is ${avgRate.toFixed(1)}%. With good credit, you might qualify for lower rates through debt consolidation.`,
      priority: 'medium',
    });
  }

  // Debt-to-income check
  const totalMinPayments = debts.reduce((sum, d) => sum + parseFloat(d.minimumPayment || 0), 0);
  insights.push({
    type: 'info',
    title: 'Monthly Obligations',
    message: `Your minimum debt payments total $${totalMinPayments.toLocaleString()}/month across ${debts.length} accounts.`,
    priority: 'low',
  });

  return {
    insights,
    summary: {
      totalDebt,
      avgRate: avgRate.toFixed(2),
      highestRate,
      lowestBalance,
      totalMinPayments,
      debtCount: debts.length,
    },
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, debts = [], monthlyBudget = 0, strategy = 'avalanche' } = body;

    if (action === 'calculate') {
      const plan = calculateDebtPayoffPlan(debts, monthlyBudget, strategy);
      return NextResponse.json({ success: true, plan });
    }

    if (action === 'compare') {
      const comparison = compareStrategies(debts, monthlyBudget);
      return NextResponse.json({ success: true, comparison });
    }

    if (action === 'insights') {
      const result = generateDebtInsights(debts);
      return NextResponse.json({ success: true, ...result });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Debt Optimizer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
