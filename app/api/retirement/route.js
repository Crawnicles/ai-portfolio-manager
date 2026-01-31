import { NextResponse } from 'next/server';

// Retirement planning calculations
function calculateRetirement({
  currentAge,
  retirementAge,
  lifeExpectancy,
  currentSavings,
  monthlyContribution,
  employerMatch,
  expectedReturn,
  inflationRate,
  currentExpenses,
  retirementExpensePct, // Percentage of current expenses in retirement
  socialSecurityMonthly,
  pensionMonthly,
  otherIncomeMonthly,
}) {
  const yearsToRetirement = retirementAge - currentAge;
  const yearsInRetirement = lifeExpectancy - retirementAge;
  const monthsToRetirement = yearsToRetirement * 12;

  // Real return (adjusted for inflation)
  const realReturn = (1 + expectedReturn / 100) / (1 + inflationRate / 100) - 1;
  const monthlyRealReturn = Math.pow(1 + realReturn, 1/12) - 1;

  // Calculate future value of current savings
  const futureValueCurrentSavings = currentSavings * Math.pow(1 + realReturn, yearsToRetirement);

  // Calculate future value of contributions (with employer match)
  const totalMonthlyContribution = monthlyContribution + (employerMatch || 0);
  let futureValueContributions = 0;
  for (let i = 0; i < monthsToRetirement; i++) {
    futureValueContributions = (futureValueContributions + totalMonthlyContribution) * (1 + monthlyRealReturn);
  }

  const totalAtRetirement = futureValueCurrentSavings + futureValueContributions;

  // Calculate retirement expenses (in today's dollars, adjusted for inflation at retirement)
  const monthlyRetirementExpenses = currentExpenses * (retirementExpensePct / 100);
  const inflationAdjustedExpenses = monthlyRetirementExpenses * Math.pow(1 + inflationRate / 100, yearsToRetirement);

  // Guaranteed income in retirement
  const guaranteedIncome = (socialSecurityMonthly || 0) + (pensionMonthly || 0) + (otherIncomeMonthly || 0);

  // Monthly shortfall to be funded from savings
  const monthlyShortfall = Math.max(0, inflationAdjustedExpenses - guaranteedIncome);

  // Calculate how much savings needed (using 4% rule and more sophisticated calculation)
  // Using present value of annuity formula
  const withdrawalRate = 0.04; // 4% safe withdrawal rate
  const neededForWithdrawals = monthlyShortfall * 12 / withdrawalRate;

  // Alternative calculation using present value of annuity
  const retirementRealReturn = Math.pow(1 + (expectedReturn - 2) / 100, 1/12) - 1; // Lower return in retirement
  let pvAnnuity = 0;
  for (let i = 0; i < yearsInRetirement * 12; i++) {
    pvAnnuity += monthlyShortfall / Math.pow(1 + retirementRealReturn, i);
  }

  // Use the higher of the two estimates for safety
  const amountNeeded = Math.max(neededForWithdrawals, pvAnnuity);

  // Calculate gap
  const gap = amountNeeded - totalAtRetirement;
  const onTrack = gap <= 0;

  // Calculate required monthly contribution to close gap
  let requiredMonthly = monthlyContribution;
  if (gap > 0 && monthsToRetirement > 0) {
    // Use annuity formula to find required payment
    const factor = (Math.pow(1 + monthlyRealReturn, monthsToRetirement) - 1) / monthlyRealReturn;
    requiredMonthly = gap / factor;
  }

  // Project savings over time
  const projections = [];
  let balance = currentSavings;
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    const isRetired = age >= retirementAge;

    if (!isRetired) {
      // Accumulation phase
      for (let m = 0; m < 12; m++) {
        balance = (balance + totalMonthlyContribution) * (1 + monthlyRealReturn);
      }
    } else {
      // Distribution phase
      for (let m = 0; m < 12; m++) {
        balance = balance * (1 + retirementRealReturn) - monthlyShortfall;
      }
    }

    projections.push({
      age,
      balance: Math.max(0, Math.round(balance)),
      phase: isRetired ? 'retirement' : 'accumulation',
    });
  }

  // Calculate when money runs out (if it does)
  const runsOutAt = projections.find(p => p.balance <= 0)?.age || null;

  // Generate insights and recommendations
  const insights = [];

  if (!onTrack) {
    const increaseNeeded = requiredMonthly - monthlyContribution;
    insights.push({
      type: 'warning',
      title: 'Savings Gap Detected',
      message: `You're projected to be $${Math.abs(Math.round(gap)).toLocaleString()} short. Increase monthly savings by $${Math.round(increaseNeeded).toLocaleString()}.`,
    });
  } else {
    insights.push({
      type: 'positive',
      title: 'On Track for Retirement',
      message: `You're projected to have $${Math.round(Math.abs(gap)).toLocaleString()} more than needed at retirement.`,
    });
  }

  if (runsOutAt && runsOutAt < lifeExpectancy) {
    insights.push({
      type: 'alert',
      title: 'Money May Run Out',
      message: `At current trajectory, savings could be depleted by age ${runsOutAt}. Consider adjusting your plan.`,
    });
  }

  if (!employerMatch || employerMatch === 0) {
    insights.push({
      type: 'opportunity',
      title: 'Employer Match',
      message: `If your employer offers a 401(k) match, make sure you're contributing enough to get the full match - it's free money!`,
    });
  }

  const savingsRate = monthlyContribution / (currentExpenses + monthlyContribution) * 100;
  if (savingsRate < 15) {
    insights.push({
      type: 'info',
      title: 'Savings Rate',
      message: `Your retirement savings rate is ${savingsRate.toFixed(1)}%. Aim for 15-20% of income for comfortable retirement.`,
    });
  }

  // Withdrawal strategy
  const withdrawalStrategies = [
    {
      name: '4% Rule',
      annualWithdrawal: totalAtRetirement * 0.04,
      monthlyWithdrawal: totalAtRetirement * 0.04 / 12,
      description: 'Traditional safe withdrawal rate',
    },
    {
      name: 'Dynamic',
      annualWithdrawal: totalAtRetirement * 0.035,
      monthlyWithdrawal: totalAtRetirement * 0.035 / 12,
      description: 'More conservative, adjusts with market',
    },
    {
      name: 'Bucket Strategy',
      description: 'Divide savings into short, medium, and long-term buckets',
      buckets: [
        { name: 'Cash (1-2 years)', amount: monthlyShortfall * 24, purpose: 'Immediate expenses' },
        { name: 'Bonds (3-7 years)', amount: monthlyShortfall * 60, purpose: 'Medium-term stability' },
        { name: 'Stocks (8+ years)', amount: Math.max(0, totalAtRetirement - monthlyShortfall * 84), purpose: 'Long-term growth' },
      ],
    },
  ];

  return {
    summary: {
      currentAge,
      retirementAge,
      yearsToRetirement,
      yearsInRetirement,
      currentSavings,
      monthlyContribution,
      totalMonthlyContribution,
      projectedAtRetirement: Math.round(totalAtRetirement),
      amountNeeded: Math.round(amountNeeded),
      gap: Math.round(gap),
      onTrack,
      requiredMonthly: Math.round(requiredMonthly),
      runsOutAt,
    },
    income: {
      monthlyExpensesInRetirement: Math.round(inflationAdjustedExpenses),
      socialSecurity: socialSecurityMonthly || 0,
      pension: pensionMonthly || 0,
      otherIncome: otherIncomeMonthly || 0,
      totalGuaranteed: Math.round(guaranteedIncome),
      monthlyFromSavings: Math.round(monthlyShortfall),
    },
    projections,
    insights,
    withdrawalStrategies,
    assumptions: {
      expectedReturn: expectedReturn,
      inflationRate: inflationRate,
      realReturn: Math.round(realReturn * 10000) / 100,
      withdrawalRate: 4,
    },
  };
}

// Social Security estimate (simplified)
function estimateSocialSecurity(currentAge, currentIncome, retirementAge) {
  // Simplified calculation - actual SS is much more complex
  const maxBenefit = 4555; // 2024 max at FRA
  const avgBenefit = 1907; // 2024 average

  // Estimate based on income (very rough)
  const incomeRatio = Math.min(currentIncome / 168600, 1); // SS wage base
  const estimatedBenefit = avgBenefit + (maxBenefit - avgBenefit) * incomeRatio * 0.5;

  // Adjust for early/late retirement
  let adjustment = 1.0;
  const fra = 67; // Full retirement age for most
  if (retirementAge < fra) {
    adjustment = 1 - (fra - retirementAge) * 0.0567; // ~5.67% reduction per year early
  } else if (retirementAge > fra) {
    adjustment = 1 + Math.min(retirementAge - fra, 3) * 0.08; // 8% increase per year delayed, up to 70
  }

  return Math.round(estimatedBenefit * adjustment);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'calculate':
        const result = calculateRetirement({
          currentAge: body.currentAge || 30,
          retirementAge: body.retirementAge || 65,
          lifeExpectancy: body.lifeExpectancy || 90,
          currentSavings: body.currentSavings || 0,
          monthlyContribution: body.monthlyContribution || 0,
          employerMatch: body.employerMatch || 0,
          expectedReturn: body.expectedReturn || 7,
          inflationRate: body.inflationRate || 3,
          currentExpenses: body.currentExpenses || 5000,
          retirementExpensePct: body.retirementExpensePct || 80,
          socialSecurityMonthly: body.socialSecurityMonthly || 0,
          pensionMonthly: body.pensionMonthly || 0,
          otherIncomeMonthly: body.otherIncomeMonthly || 0,
        });
        return NextResponse.json(result);

      case 'estimateSS':
        const ssEstimate = estimateSocialSecurity(
          body.currentAge || 30,
          body.currentIncome || 75000,
          body.retirementAge || 67
        );
        return NextResponse.json({ estimated: ssEstimate });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Retirement API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
