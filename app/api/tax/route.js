import { NextResponse } from 'next/server';

// 2024/2025 Tax brackets (single filer - can be expanded for married)
const TAX_BRACKETS_2024 = {
  single: [
    { min: 0, max: 11600, rate: 0.10 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 },
  ],
  married: [
    { min: 0, max: 23200, rate: 0.10 },
    { min: 23200, max: 94300, rate: 0.12 },
    { min: 94300, max: 201050, rate: 0.22 },
    { min: 201050, max: 383900, rate: 0.24 },
    { min: 383900, max: 487450, rate: 0.32 },
    { min: 487450, max: 731200, rate: 0.35 },
    { min: 731200, max: Infinity, rate: 0.37 },
  ],
};

const STANDARD_DEDUCTION_2024 = {
  single: 14600,
  married: 29200,
  headOfHousehold: 21900,
};

const CAPITAL_GAINS_RATES = {
  single: [
    { min: 0, max: 47025, rate: 0 },
    { min: 47025, max: 518900, rate: 0.15 },
    { min: 518900, max: Infinity, rate: 0.20 },
  ],
  married: [
    { min: 0, max: 94050, rate: 0 },
    { min: 94050, max: 583750, rate: 0.15 },
    { min: 583750, max: Infinity, rate: 0.20 },
  ],
};

// Calculate federal income tax
function calculateFederalTax(income, filingStatus = 'single') {
  const brackets = TAX_BRACKETS_2024[filingStatus] || TAX_BRACKETS_2024.single;
  let tax = 0;
  let remainingIncome = income;

  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;
    const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
    tax += taxableInBracket * bracket.rate;
    remainingIncome -= taxableInBracket;
  }

  return Math.round(tax * 100) / 100;
}

// Calculate capital gains tax
function calculateCapitalGainsTax(gains, ordinaryIncome, filingStatus = 'single') {
  const brackets = CAPITAL_GAINS_RATES[filingStatus] || CAPITAL_GAINS_RATES.single;
  const totalIncome = ordinaryIncome + gains;

  // Find applicable rate based on total income
  let rate = 0;
  for (const bracket of brackets) {
    if (totalIncome <= bracket.max) {
      rate = bracket.rate;
      break;
    }
  }

  return {
    rate,
    tax: Math.round(gains * rate * 100) / 100,
  };
}

// Analyze tax situation and provide recommendations
function analyzeTaxSituation({
  annualIncome,
  filingStatus,
  w2Withholding,
  estimatedPayments,
  deductions,
  retirementContributions,
  positions,
  realizedGains,
  unrealizedGains,
  state,
}) {
  const standardDeduction = STANDARD_DEDUCTION_2024[filingStatus] || STANDARD_DEDUCTION_2024.single;
  const totalItemized = Object.values(deductions || {}).reduce((sum, d) => sum + (d || 0), 0);
  const useItemized = totalItemized > standardDeduction;
  const actualDeduction = useItemized ? totalItemized : standardDeduction;

  // Calculate taxable income
  const retirementDeduction = Math.min(retirementContributions?.traditional401k || 0, 23000) +
                              Math.min(retirementContributions?.traditionalIRA || 0, 7000);
  const taxableIncome = Math.max(0, annualIncome - actualDeduction - retirementDeduction);

  // Calculate taxes
  const federalTax = calculateFederalTax(taxableIncome, filingStatus);
  const capitalGains = calculateCapitalGainsTax(realizedGains || 0, taxableIncome, filingStatus);
  const totalFederalTax = federalTax + capitalGains.tax;

  // Estimate state tax (simplified - 5% average)
  const stateTaxRate = getStateTaxRate(state);
  const stateTax = Math.round(taxableIncome * stateTaxRate * 100) / 100;

  // FICA (Social Security + Medicare)
  const socialSecurityTax = Math.min(annualIncome, 168600) * 0.062;
  const medicareTax = annualIncome * 0.0145;
  const additionalMedicare = annualIncome > 200000 ? (annualIncome - 200000) * 0.009 : 0;
  const ficaTax = Math.round((socialSecurityTax + medicareTax + additionalMedicare) * 100) / 100;

  const totalTax = totalFederalTax + stateTax + ficaTax;
  const totalPaid = (w2Withholding || 0) + (estimatedPayments || 0);
  const balance = totalPaid - totalTax;

  // Calculate effective tax rate
  const effectiveRate = annualIncome > 0 ? Math.round((totalTax / annualIncome) * 10000) / 100 : 0;
  const marginalRate = getMarginalRate(taxableIncome, filingStatus);

  // Generate optimization opportunities
  const opportunities = [];

  // 401k optimization
  const current401k = retirementContributions?.traditional401k || 0;
  if (current401k < 23000) {
    const additional = 23000 - current401k;
    const taxSavings = Math.round(additional * marginalRate * 100) / 100;
    opportunities.push({
      type: '401k',
      priority: 'high',
      title: 'Maximize 401(k) Contributions',
      description: `You can contribute $${additional.toLocaleString()} more to your 401(k) this year.`,
      potentialSavings: taxSavings,
      action: `Increase 401(k) contribution to save $${taxSavings.toLocaleString()} in taxes.`,
    });
  }

  // IRA contribution
  const currentIRA = (retirementContributions?.traditionalIRA || 0) + (retirementContributions?.rothIRA || 0);
  if (currentIRA < 7000) {
    const additional = 7000 - currentIRA;
    // Recommend Roth vs Traditional based on income
    const recommendRoth = taxableIncome < 100000;
    opportunities.push({
      type: 'ira',
      priority: 'medium',
      title: recommendRoth ? 'Contribute to Roth IRA' : 'Contribute to Traditional IRA',
      description: `You can contribute $${additional.toLocaleString()} more to an IRA.`,
      potentialSavings: recommendRoth ? 0 : Math.round(additional * marginalRate * 100) / 100,
      action: recommendRoth
        ? 'Roth contributions grow tax-free - great for your income level.'
        : `Traditional IRA could save $${Math.round(additional * marginalRate).toLocaleString()} in taxes now.`,
    });
  }

  // HSA contribution (if eligible)
  if (deductions?.healthInsurance === 'hdhp') {
    const hsaLimit = filingStatus === 'married' ? 8300 : 4150;
    const currentHSA = retirementContributions?.hsa || 0;
    if (currentHSA < hsaLimit) {
      const additional = hsaLimit - currentHSA;
      opportunities.push({
        type: 'hsa',
        priority: 'high',
        title: 'Maximize HSA Contributions',
        description: `HSA offers triple tax advantage. You can contribute $${additional.toLocaleString()} more.`,
        potentialSavings: Math.round(additional * marginalRate * 100) / 100,
        action: 'HSA contributions are tax-deductible, grow tax-free, and withdrawals for medical expenses are tax-free.',
      });
    }
  }

  // Tax-loss harvesting
  if (unrealizedGains) {
    const losses = Object.values(unrealizedGains).filter(g => g < 0);
    const gains = Object.values(unrealizedGains).filter(g => g > 0);
    const totalLosses = losses.reduce((sum, l) => sum + Math.abs(l), 0);
    const totalGains = gains.reduce((sum, g) => sum + g, 0);

    if (totalLosses > 0 && totalGains > 0) {
      const harvestable = Math.min(totalLosses, totalGains);
      const taxSavings = Math.round(harvestable * capitalGains.rate * 100) / 100;
      opportunities.push({
        type: 'taxLossHarvesting',
        priority: 'medium',
        title: 'Tax-Loss Harvesting Opportunity',
        description: `You have $${totalLosses.toLocaleString()} in unrealized losses to offset $${totalGains.toLocaleString()} in gains.`,
        potentialSavings: taxSavings,
        action: 'Sell losing positions to offset capital gains and reduce taxes.',
      });
    }
  }

  // Charitable giving (if itemizing)
  if (useItemized && (deductions?.charitable || 0) < annualIncome * 0.1) {
    opportunities.push({
      type: 'charitable',
      priority: 'low',
      title: 'Consider Charitable Giving',
      description: 'Charitable donations can reduce your taxable income.',
      potentialSavings: null,
      action: 'Consider donating appreciated stock to avoid capital gains and get a deduction.',
    });
  }

  // Estimated payment warning
  if (balance < -1000) {
    opportunities.push({
      type: 'estimatedPayments',
      priority: 'urgent',
      title: 'Underpayment Warning',
      description: `You may owe approximately $${Math.abs(Math.round(balance)).toLocaleString()} at tax time.`,
      potentialSavings: null,
      action: 'Consider making an estimated tax payment to avoid penalties.',
    });
  }

  return {
    summary: {
      grossIncome: annualIncome,
      adjustments: retirementDeduction,
      deduction: actualDeduction,
      deductionType: useItemized ? 'itemized' : 'standard',
      taxableIncome,
      federalTax,
      capitalGainsTax: capitalGains.tax,
      capitalGainsRate: capitalGains.rate,
      stateTax,
      ficaTax,
      totalTax,
      totalPaid,
      balance,
      effectiveRate,
      marginalRate,
    },
    breakdown: {
      federal: {
        ordinaryIncome: federalTax,
        capitalGains: capitalGains.tax,
        total: totalFederalTax,
      },
      state: {
        rate: stateTaxRate,
        tax: stateTax,
      },
      fica: {
        socialSecurity: Math.round(socialSecurityTax * 100) / 100,
        medicare: Math.round((medicareTax + additionalMedicare) * 100) / 100,
        total: ficaTax,
      },
    },
    opportunities: opportunities.sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }),
    projections: {
      monthlyTaxBurden: Math.round(totalTax / 12 * 100) / 100,
      takeHomePay: Math.round((annualIncome - totalTax) / 12 * 100) / 100,
      savingsFromDeductions: Math.round(actualDeduction * marginalRate * 100) / 100,
    },
  };
}

function getMarginalRate(taxableIncome, filingStatus) {
  const brackets = TAX_BRACKETS_2024[filingStatus] || TAX_BRACKETS_2024.single;
  for (const bracket of brackets) {
    if (taxableIncome <= bracket.max) {
      return bracket.rate;
    }
  }
  return 0.37;
}

function getStateTaxRate(state) {
  const stateTaxRates = {
    'CA': 0.0930, 'NY': 0.0685, 'TX': 0, 'FL': 0, 'WA': 0, 'NV': 0,
    'IL': 0.0495, 'PA': 0.0307, 'OH': 0.0399, 'GA': 0.0549,
    'NC': 0.0525, 'NJ': 0.0637, 'VA': 0.0575, 'MA': 0.05,
    'AZ': 0.025, 'CO': 0.044, 'TN': 0, 'WY': 0, 'SD': 0, 'AK': 0, 'NH': 0,
  };
  return stateTaxRates[state] || 0.05; // Default 5%
}

// Calculate quarterly estimated payments
function calculateEstimatedPayments({
  annualIncome,
  filingStatus,
  currentQuarter,
  yearToDateWithholding,
  yearToDateEstimated,
}) {
  const analysis = analyzeTaxSituation({
    annualIncome,
    filingStatus,
    w2Withholding: yearToDateWithholding,
    estimatedPayments: yearToDateEstimated,
    deductions: {},
    retirementContributions: {},
  });

  const totalOwed = analysis.summary.totalTax;
  const safeHarbor = totalOwed * 0.9; // 90% of current year or 100% of prior year
  const totalPaid = yearToDateWithholding + yearToDateEstimated;
  const remaining = Math.max(0, safeHarbor - totalPaid);

  const quartersRemaining = 4 - currentQuarter + 1;
  const quarterlyPayment = Math.ceil(remaining / quartersRemaining);

  return {
    totalEstimatedTax: totalOwed,
    safeHarborAmount: Math.round(safeHarbor),
    totalPaid,
    remaining: Math.round(remaining),
    quarterlyPayment,
    dueDates: [
      { quarter: 1, due: 'April 15', amount: quarterlyPayment },
      { quarter: 2, due: 'June 15', amount: quarterlyPayment },
      { quarter: 3, due: 'September 15', amount: quarterlyPayment },
      { quarter: 4, due: 'January 15', amount: quarterlyPayment },
    ].filter(q => q.quarter >= currentQuarter),
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'analyze':
        const analysis = analyzeTaxSituation({
          annualIncome: body.annualIncome || 0,
          filingStatus: body.filingStatus || 'single',
          w2Withholding: body.w2Withholding || 0,
          estimatedPayments: body.estimatedPayments || 0,
          deductions: body.deductions || {},
          retirementContributions: body.retirementContributions || {},
          positions: body.positions || [],
          realizedGains: body.realizedGains || 0,
          unrealizedGains: body.unrealizedGains || {},
          state: body.state || null,
        });
        return NextResponse.json(analysis);

      case 'estimatedPayments':
        const payments = calculateEstimatedPayments({
          annualIncome: body.annualIncome || 0,
          filingStatus: body.filingStatus || 'single',
          currentQuarter: body.currentQuarter || 1,
          yearToDateWithholding: body.yearToDateWithholding || 0,
          yearToDateEstimated: body.yearToDateEstimated || 0,
        });
        return NextResponse.json(payments);

      case 'brackets':
        return NextResponse.json({
          brackets: TAX_BRACKETS_2024,
          standardDeduction: STANDARD_DEDUCTION_2024,
          capitalGains: CAPITAL_GAINS_RATES,
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Tax API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
