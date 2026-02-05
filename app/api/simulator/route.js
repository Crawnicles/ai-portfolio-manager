// Phase 23: "What If" Financial Simulator API
// Model financial decisions before making them

export async function POST(request) {
  const body = await request.json();
  const { scenario, currentState } = body;

  // Current financial state
  const {
    netWorth = 100000,
    monthlyIncome = 8000,
    monthlyExpenses = 5000,
    investmentBalance = 50000,
    cashBalance = 20000,
    debtBalance = 0,
    monthlyInvestment = 500,
    expectedReturn = 7,
    age = 30,
  } = currentState || {};

  const monthlySavings = monthlyIncome - monthlyExpenses;

  let result = {
    scenario: scenario.type,
    title: '',
    summary: '',
    impact: {},
    timeline: [],
    recommendation: '',
    tradeoffs: [],
  };

  switch (scenario.type) {
    case 'buy_house': {
      const { homePrice = 500000, downPaymentPct = 20, interestRate = 6.5, propertyTax = 1.2, insurance = 200 } = scenario;
      const downPayment = homePrice * (downPaymentPct / 100);
      const loanAmount = homePrice - downPayment;
      const monthlyRate = interestRate / 100 / 12;
      const numPayments = 360; // 30 years
      const monthlyPrincipalInterest = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
      const monthlyPropertyTax = (homePrice * (propertyTax / 100)) / 12;
      const totalMonthlyPayment = monthlyPrincipalInterest + monthlyPropertyTax + insurance;
      const totalInterestPaid = (monthlyPrincipalInterest * numPayments) - loanAmount;

      const newMonthlySavings = monthlySavings - totalMonthlyPayment + (scenario.currentRent || 2000);
      const liquidityAfter = cashBalance - downPayment - (scenario.closingCosts || homePrice * 0.03);

      result.title = `Buy a $${(homePrice/1000).toFixed(0)}K Home`;
      result.summary = `Monthly payment of $${Math.round(totalMonthlyPayment).toLocaleString()} (P&I: $${Math.round(monthlyPrincipalInterest).toLocaleString()}, Tax: $${Math.round(monthlyPropertyTax).toLocaleString()}, Insurance: $${insurance})`;
      result.impact = {
        downPayment: -downPayment,
        closingCosts: -(scenario.closingCosts || homePrice * 0.03),
        monthlyChange: -(totalMonthlyPayment - (scenario.currentRent || 2000)),
        newMonthlySavings,
        liquidityAfter,
        totalInterestOver30Years: totalInterestPaid,
        equityYear5: homePrice * 0.15 + (monthlyPrincipalInterest * 60 * 0.3), // rough equity estimate
      };
      result.tradeoffs = [
        { pro: true, text: `Build equity instead of paying rent (~$${Math.round(monthlyPrincipalInterest * 0.3).toLocaleString()}/mo to principal initially)` },
        { pro: true, text: `Potential appreciation (historically 3-5%/year)` },
        { pro: true, text: `Tax deductions on mortgage interest` },
        { pro: false, text: `$${downPayment.toLocaleString()} down payment could earn ${expectedReturn}% invested` },
        { pro: false, text: `Less flexibility - harder to relocate` },
        { pro: false, text: `Maintenance costs (~1% of home value/year = $${Math.round(homePrice * 0.01).toLocaleString()})` },
        liquidityAfter < 10000 ? { pro: false, text: `⚠️ Emergency fund drops to $${liquidityAfter.toLocaleString()} - dangerously low` } : null,
      ].filter(Boolean);
      result.recommendation = liquidityAfter < monthlyExpenses * 3
        ? "Consider saving more before buying - your emergency fund would be too low"
        : newMonthlySavings < 500
        ? "This stretches your budget thin. Consider a less expensive home."
        : "Financially feasible, but ensure you're ready for the commitment.";

      // 10 year projection
      for (let year = 0; year <= 10; year++) {
        const appreciation = homePrice * Math.pow(1.04, year);
        const remainingLoan = loanAmount * (1 - (year * 0.02)); // rough estimate
        result.timeline.push({
          year: new Date().getFullYear() + year,
          homeValue: Math.round(appreciation),
          equity: Math.round(appreciation - remainingLoan + downPayment),
          netWorthImpact: Math.round(appreciation - remainingLoan + downPayment - downPayment),
        });
      }
      break;
    }

    case 'change_job': {
      const { newSalary = monthlyIncome * 12, currentSalary = monthlyIncome * 12, has401kMatch = true, newHas401kMatch = true, newMatchPct = 4 } = scenario;
      const salaryDiff = newSalary - currentSalary;
      const monthlyDiff = salaryDiff / 12;
      const taxRate = newSalary > 150000 ? 0.32 : newSalary > 90000 ? 0.24 : 0.22;
      const afterTaxMonthlyDiff = monthlyDiff * (1 - taxRate);

      const lost401kMatch = has401kMatch && !newHas401kMatch ? (currentSalary * 0.04) : 0;
      const new401kMatch = newHas401kMatch ? (newSalary * (newMatchPct / 100)) : 0;

      result.title = `Change Jobs: $${(currentSalary/1000).toFixed(0)}K → $${(newSalary/1000).toFixed(0)}K`;
      result.summary = salaryDiff > 0
        ? `${((salaryDiff/currentSalary)*100).toFixed(0)}% raise = +$${Math.round(afterTaxMonthlyDiff).toLocaleString()}/mo after tax`
        : `${((salaryDiff/currentSalary)*100).toFixed(0)}% pay cut = -$${Math.round(Math.abs(afterTaxMonthlyDiff)).toLocaleString()}/mo after tax`;

      result.impact = {
        annualSalaryChange: salaryDiff,
        monthlyAfterTax: afterTaxMonthlyDiff,
        annual401kMatchChange: new401kMatch - (has401kMatch ? currentSalary * 0.04 : 0),
        tenYearImpact: (afterTaxMonthlyDiff * 12 + new401kMatch - lost401kMatch) * 10,
      };

      result.tradeoffs = [
        salaryDiff > 0 ? { pro: true, text: `+$${salaryDiff.toLocaleString()}/year gross income` } : { pro: false, text: `-$${Math.abs(salaryDiff).toLocaleString()}/year gross income` },
        newHas401kMatch ? { pro: true, text: `401k match: ${newMatchPct}% = $${new401kMatch.toLocaleString()}/year free money` } : { pro: false, text: `No 401k match - losing free money` },
        { pro: null, text: `Consider: commute, growth potential, work-life balance, benefits` },
      ];

      result.recommendation = salaryDiff < -20000
        ? "Significant pay cut. Only worth it for major quality of life improvement."
        : salaryDiff > 20000
        ? "Strong financial move if the role is a good fit."
        : "Marginal financial difference - focus on career growth and happiness.";

      for (let year = 0; year <= 10; year++) {
        const raises = Math.pow(1.03, year); // 3% annual raises
        result.timeline.push({
          year: new Date().getFullYear() + year,
          currentPathSalary: Math.round(currentSalary * raises),
          newPathSalary: Math.round(newSalary * raises),
          cumulativeDifference: Math.round(salaryDiff * ((Math.pow(1.03, year + 1) - 1) / 0.03)),
        });
      }
      break;
    }

    case 'have_child': {
      const { childcareMonthly = 1500, yearsOfChildcare = 5 } = scenario;
      const firstYearCosts = 15000; // diapers, gear, medical
      const annualCosts = childcareMonthly * 12 + 5000; // childcare + other
      const collegeFund = 300; // monthly 529 contribution

      result.title = 'Have a Child';
      result.summary = `First year: ~$${firstYearCosts.toLocaleString()}, then ~$${annualCosts.toLocaleString()}/year for ${yearsOfChildcare} years of childcare`;

      result.impact = {
        firstYearCost: firstYearCosts,
        monthlyBudgetImpact: -(childcareMonthly + 400 + collegeFund),
        totalChildcareCost: childcareMonthly * 12 * yearsOfChildcare,
        collegeAt18: collegeFund * 12 * 18 * 1.5, // with growth
        newMonthlySavings: monthlySavings - childcareMonthly - 400 - collegeFund,
      };

      result.tradeoffs = [
        { pro: true, text: `Life enrichment (priceless)` },
        { pro: true, text: `Tax credits: ~$2,000-3,000/year child tax credit` },
        { pro: true, text: `Dependent care FSA: $5,000 pre-tax savings` },
        { pro: false, text: `$${childcareMonthly.toLocaleString()}/mo childcare for ${yearsOfChildcare} years` },
        { pro: false, text: `Career impact possible (reduced hours, opportunities)` },
        { pro: false, text: `College: $100K-300K in 18 years` },
        monthlySavings - childcareMonthly - 400 < 500 ? { pro: false, text: `⚠️ Budget will be tight - savings drop significantly` } : null,
      ].filter(Boolean);

      result.recommendation = monthlySavings > childcareMonthly + 1000
        ? "Financially prepared. Focus on building emergency fund before arrival."
        : "Consider building more financial cushion first - aim for 6+ months expenses saved.";

      for (let year = 0; year <= 18; year++) {
        result.timeline.push({
          year: new Date().getFullYear() + year,
          childAge: year,
          annualCost: year === 0 ? firstYearCosts : year <= yearsOfChildcare ? annualCosts : 8000,
          collegeFundValue: Math.round(collegeFund * 12 * year * (1 + 0.07 * year / 2)),
        });
      }
      break;
    }

    case 'max_401k': {
      const currentContribution = scenario.currentMonthly || 500;
      const maxContribution = 23000 / 12; // 2024 limit
      const increase = maxContribution - currentContribution;
      const taxBracket = scenario.taxBracket || 0.24;
      const taxSavings = increase * 12 * taxBracket;
      const employerMatch = scenario.employerMatchPct ? Math.min(increase * 12, monthlyIncome * 12 * (scenario.employerMatchPct / 100)) : 0;

      result.title = 'Max Out 401(k)';
      result.summary = `Increase contribution by $${Math.round(increase).toLocaleString()}/mo to reach $23,000/year limit`;

      const futureValue = (contribution, years, rate) => {
        const monthly = contribution;
        const r = rate / 12;
        const n = years * 12;
        return monthly * ((Math.pow(1 + r, n) - 1) / r);
      };

      result.impact = {
        monthlyIncrease: increase,
        annualTaxSavings: taxSavings,
        takeHomeReduction: increase * (1 - taxBracket),
        valueIn10Years: Math.round(futureValue(maxContribution, 10, 0.07)),
        valueIn20Years: Math.round(futureValue(maxContribution, 20, 0.07)),
        valueIn30Years: Math.round(futureValue(maxContribution, 30, 0.07)),
        additionalEmployerMatch: employerMatch,
      };

      result.tradeoffs = [
        { pro: true, text: `Tax savings: $${Math.round(taxSavings).toLocaleString()}/year` },
        { pro: true, text: `30-year growth: $${Math.round(futureValue(maxContribution, 30, 0.07)).toLocaleString()}` },
        { pro: true, text: `Compound interest is powerful - earlier is better` },
        { pro: false, text: `Reduces take-home by $${Math.round(increase * (1 - taxBracket)).toLocaleString()}/mo` },
        { pro: false, text: `Money locked until 59½ (with exceptions)` },
        monthlySavings - increase < 500 ? { pro: false, text: `⚠️ May strain monthly budget` } : null,
      ].filter(Boolean);

      result.recommendation = monthlySavings > increase + 500
        ? "Strongly recommended - tax savings + employer match + compound growth."
        : "Good goal, but ensure emergency fund is solid first.";

      for (let year = 0; year <= 30; year += 5) {
        result.timeline.push({
          year: new Date().getFullYear() + year,
          age: age + year,
          balanceCurrent: Math.round(futureValue(currentContribution, year, 0.07)),
          balanceMaxed: Math.round(futureValue(maxContribution, year, 0.07)),
          difference: Math.round(futureValue(maxContribution, year, 0.07) - futureValue(currentContribution, year, 0.07)),
        });
      }
      break;
    }

    case 'market_crash': {
      const { dropPercent = 40 } = scenario;
      const portfolioLoss = investmentBalance * (dropPercent / 100);
      const recoveryYears = dropPercent > 30 ? 4 : dropPercent > 20 ? 2.5 : 1.5;

      result.title = `Market Drops ${dropPercent}%`;
      result.summary = `Portfolio drops from $${investmentBalance.toLocaleString()} to $${Math.round(investmentBalance * (1 - dropPercent/100)).toLocaleString()}`;

      result.impact = {
        portfolioLoss: -portfolioLoss,
        newBalance: investmentBalance * (1 - dropPercent / 100),
        estimatedRecoveryYears: recoveryYears,
        opportunityCost: monthlyInvestment * 12 * recoveryYears * 0.1, // what you could buy cheap
      };

      result.tradeoffs = [
        { pro: false, text: `Paper loss of $${portfolioLoss.toLocaleString()}` },
        { pro: false, text: `Emotional stress - don't panic sell!` },
        { pro: true, text: `Buying opportunity - stocks on sale` },
        { pro: true, text: `Historical recovery: S&P always recovered eventually` },
        { pro: true, text: `If you keep investing, you buy low` },
        cashBalance < monthlyExpenses * 6 ? { pro: false, text: `⚠️ Without 6mo expenses in cash, you might be forced to sell low` } : null,
      ].filter(Boolean);

      result.recommendation = cashBalance > monthlyExpenses * 6
        ? "You're prepared. Stay the course, keep investing, don't sell."
        : "Build cash reserves so you're not forced to sell during downturns.";

      for (let year = 0; year <= 10; year++) {
        const recovered = year >= recoveryYears;
        const growthRate = recovered ? 0.08 : 0.15; // faster recovery, then normal
        result.timeline.push({
          year: new Date().getFullYear() + year,
          portfolioValue: Math.round(investmentBalance * (1 - dropPercent/100) * Math.pow(1 + growthRate, year)),
          vsNoCrash: Math.round(investmentBalance * Math.pow(1.08, year)),
          recovered: recovered ? 'Yes' : 'No',
        });
      }
      break;
    }

    case 'retire_early': {
      const { targetAge = 50, annualSpending = monthlyExpenses * 12 } = scenario;
      const yearsToRetirement = targetAge - age;
      const yearsInRetirement = 90 - targetAge;
      const neededAt4Pct = annualSpending * 25; // 4% rule
      const neededAt3Pct = annualSpending * 33; // safer 3% rule

      const futureValue = (current, monthly, years, rate) => {
        const r = rate / 12;
        const n = years * 12;
        const fvCurrent = current * Math.pow(1 + r, n);
        const fvContributions = monthly * ((Math.pow(1 + r, n) - 1) / r);
        return fvCurrent + fvContributions;
      };

      const projectedAtRetirement = futureValue(investmentBalance, monthlyInvestment, yearsToRetirement, 0.07);
      const gap = neededAt4Pct - projectedAtRetirement;
      const requiredMonthly = gap > 0 ? gap / (yearsToRetirement * 12) / 1.5 : 0; // rough estimate

      result.title = `Retire at ${targetAge}`;
      result.summary = `Need $${Math.round(neededAt4Pct).toLocaleString()} (4% rule) or $${Math.round(neededAt3Pct).toLocaleString()} (3% rule) to support $${annualSpending.toLocaleString()}/year`;

      result.impact = {
        yearsToRetirement,
        targetAmount4Pct: neededAt4Pct,
        targetAmount3Pct: neededAt3Pct,
        projectedAtRetirement: Math.round(projectedAtRetirement),
        gap: Math.round(gap),
        additionalMonthlyNeeded: Math.round(requiredMonthly),
      };

      result.tradeoffs = [
        projectedAtRetirement >= neededAt4Pct ? { pro: true, text: `On track! Projected: $${Math.round(projectedAtRetirement).toLocaleString()}` } : { pro: false, text: `Gap of $${Math.round(gap).toLocaleString()} to close` },
        { pro: true, text: `${yearsInRetirement} years of freedom` },
        { pro: false, text: `No Social Security until 62-67` },
        { pro: false, text: `Healthcare costs before Medicare (65)` },
        yearsToRetirement < 15 ? { pro: false, text: `Short timeline - need aggressive saving` } : null,
      ].filter(Boolean);

      result.recommendation = projectedAtRetirement >= neededAt4Pct
        ? `You're on track! Keep saving $${monthlyInvestment}/month and stay invested.`
        : `Increase monthly investment by $${Math.round(requiredMonthly).toLocaleString()} or adjust retirement age to ${Math.round(targetAge + gap / (monthlyInvestment * 12 * 5))}.`;

      for (let year = 0; year <= yearsToRetirement; year += Math.max(1, Math.floor(yearsToRetirement / 8))) {
        result.timeline.push({
          year: new Date().getFullYear() + year,
          age: age + year,
          projected: Math.round(futureValue(investmentBalance, monthlyInvestment, year, 0.07)),
          target: Math.round(neededAt4Pct),
          onTrack: futureValue(investmentBalance, monthlyInvestment, year, 0.07) >= neededAt4Pct * (year / yearsToRetirement) ? 'Yes' : 'Behind',
        });
      }
      break;
    }

    default:
      result.title = 'Unknown Scenario';
      result.summary = 'Please select a valid scenario type';
  }

  return Response.json({ success: true, result });
}
