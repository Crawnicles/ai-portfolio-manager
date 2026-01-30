// Partnership Dashboard API - Phase 6
// Tracks investment partnership performance, quarterly reports, and distributions

export async function POST(request) {
  try {
    const { action, partnership, report } = await request.json();

    switch (action) {
      case 'analyze_report':
        return Response.json(analyzeQuarterlyReport(report, partnership));
      case 'calculate_metrics':
        return Response.json(calculatePartnershipMetrics(partnership));
      case 'project_returns':
        return Response.json(projectFutureReturns(partnership));
      default:
        return Response.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

function analyzeQuarterlyReport(report, partnership) {
  if (!report) {
    return { error: 'No report data provided' };
  }

  const {
    quarter,
    year,
    navPerUnit,
    totalNav,
    grossReturn,
    netReturn,
    distributions,
    capitalCalls,
    managementFee,
    performanceFee,
    notes
  } = report;

  const ownershipPct = partnership?.ownershipPct || 1;
  const yourShare = (totalNav || 0) * (ownershipPct / 100);

  // Calculate your portion
  const yourDistributions = (distributions || 0) * (ownershipPct / 100);
  const yourCapitalCalls = (capitalCalls || 0) * (ownershipPct / 100);

  // Analyze performance
  const analysis = {
    reportPeriod: `Q${quarter} ${year}`,
    partnershipMetrics: {
      totalNav,
      navPerUnit,
      grossReturn,
      netReturn,
      managementFee,
      performanceFee,
      distributions,
      capitalCalls
    },
    yourMetrics: {
      ownershipPct,
      yourNavValue: yourShare,
      yourDistributions,
      yourCapitalCalls,
      netCashFlow: yourDistributions - yourCapitalCalls
    },
    insights: generateReportInsights(report, ownershipPct),
    comparisonToBenchmarks: {
      sp500: calculateBenchmarkComparison(netReturn, 'sp500'),
      bonds: calculateBenchmarkComparison(netReturn, 'bonds'),
      riskFreeRate: calculateBenchmarkComparison(netReturn, 'riskFree')
    }
  };

  return analysis;
}

function generateReportInsights(report, ownershipPct) {
  const insights = [];

  // Performance insight
  if (report.netReturn > 10) {
    insights.push({
      type: 'positive',
      title: 'Strong Quarter',
      description: `The partnership returned ${report.netReturn}% this quarter, significantly outperforming typical market returns.`
    });
  } else if (report.netReturn > 0) {
    insights.push({
      type: 'neutral',
      title: 'Positive Return',
      description: `The partnership generated ${report.netReturn}% return this quarter.`
    });
  } else {
    insights.push({
      type: 'warning',
      title: 'Negative Quarter',
      description: `The partnership declined ${Math.abs(report.netReturn)}% this quarter. Review the GP letter for context.`
    });
  }

  // Fee analysis
  const totalFees = (report.managementFee || 0) + (report.performanceFee || 0);
  const feeImpact = report.grossReturn - report.netReturn;
  if (feeImpact > 3) {
    insights.push({
      type: 'info',
      title: 'Fee Impact',
      description: `Fees reduced returns by ${feeImpact.toFixed(1)}% this quarter. Your share of fees: $${((totalFees * ownershipPct / 100)).toFixed(0)}`
    });
  }

  // Distribution insight
  if (report.distributions > 0) {
    insights.push({
      type: 'positive',
      title: 'Distribution Received',
      description: `Partnership distributed $${report.distributions.toLocaleString()}. Your share: $${(report.distributions * ownershipPct / 100).toFixed(0)}`
    });
  }

  // Capital call insight
  if (report.capitalCalls > 0) {
    insights.push({
      type: 'warning',
      title: 'Capital Call',
      description: `Partnership called $${report.capitalCalls.toLocaleString()}. Your obligation: $${(report.capitalCalls * ownershipPct / 100).toFixed(0)}`
    });
  }

  return insights;
}

function calculateBenchmarkComparison(netReturn, benchmark) {
  // Simulated quarterly benchmark returns
  const benchmarks = {
    sp500: 2.5 + (Math.random() - 0.5) * 4, // ~0.5% to 4.5%
    bonds: 0.5 + (Math.random() - 0.5) * 1, // ~0% to 1%
    riskFree: 1.25 + (Math.random() - 0.5) * 0.5 // ~1% to 1.5%
  };

  const benchmarkReturn = benchmarks[benchmark] || 0;
  const alpha = netReturn - benchmarkReturn;

  return {
    benchmarkReturn: benchmarkReturn.toFixed(2),
    alpha: alpha.toFixed(2),
    outperformed: alpha > 0
  };
}

function calculatePartnershipMetrics(partnership) {
  if (!partnership || !partnership.quarterlyReports || partnership.quarterlyReports.length === 0) {
    return {
      hasData: false,
      message: 'No quarterly reports available. Add reports to see metrics.'
    };
  }

  const reports = partnership.quarterlyReports.sort((a, b) => {
    const dateA = a.year * 4 + a.quarter;
    const dateB = b.year * 4 + b.quarter;
    return dateA - dateB;
  });

  const ownershipPct = partnership.ownershipPct || 1;
  const latestReport = reports[reports.length - 1];

  // Calculate cumulative metrics
  const totalDistributions = reports.reduce((sum, r) => sum + (r.distributions || 0), 0);
  const totalCapitalCalls = reports.reduce((sum, r) => sum + (r.capitalCalls || 0), 0);
  const totalFeesPaid = reports.reduce((sum, r) => sum + (r.managementFee || 0) + (r.performanceFee || 0), 0);

  // Calculate returns
  const quarterlyReturns = reports.map(r => r.netReturn || 0);
  const avgQuarterlyReturn = quarterlyReturns.reduce((a, b) => a + b, 0) / quarterlyReturns.length;

  // Estimate annual return (compound quarterly)
  const annualizedReturn = Math.pow(1 + avgQuarterlyReturn / 100, 4) - 1;

  // Calculate volatility
  const variance = quarterlyReturns.reduce((sum, r) => sum + Math.pow(r - avgQuarterlyReturn, 2), 0) / quarterlyReturns.length;
  const volatility = Math.sqrt(variance * 4); // Annualized

  // Sharpe ratio (assuming 5% risk-free rate)
  const sharpeRatio = volatility > 0 ? (annualizedReturn * 100 - 5) / volatility : 0;

  // Track NAV over time
  const navHistory = reports.map(r => ({
    period: `Q${r.quarter} ${r.year}`,
    nav: r.totalNav,
    yourValue: r.totalNav * (ownershipPct / 100),
    return: r.netReturn
  }));

  return {
    hasData: true,
    currentValue: {
      partnershipNav: latestReport.totalNav,
      yourShare: latestReport.totalNav * (ownershipPct / 100),
      ownershipPct
    },
    cumulativeMetrics: {
      totalDistributions,
      yourDistributions: totalDistributions * (ownershipPct / 100),
      totalCapitalCalls,
      yourCapitalCalls: totalCapitalCalls * (ownershipPct / 100),
      netCashFlow: totalDistributions - totalCapitalCalls,
      yourNetCashFlow: (totalDistributions - totalCapitalCalls) * (ownershipPct / 100),
      totalFeesPaid,
      yourFeesPaid: totalFeesPaid * (ownershipPct / 100)
    },
    performanceMetrics: {
      avgQuarterlyReturn: avgQuarterlyReturn.toFixed(2),
      annualizedReturn: (annualizedReturn * 100).toFixed(2),
      volatility: volatility.toFixed(2),
      sharpeRatio: sharpeRatio.toFixed(2),
      bestQuarter: Math.max(...quarterlyReturns).toFixed(2),
      worstQuarter: Math.min(...quarterlyReturns).toFixed(2),
      positiveQuarters: quarterlyReturns.filter(r => r > 0).length,
      totalQuarters: quarterlyReturns.length
    },
    navHistory,
    lastUpdated: latestReport.reportDate || new Date().toISOString()
  };
}

function projectFutureReturns(partnership) {
  if (!partnership || !partnership.quarterlyReports || partnership.quarterlyReports.length < 2) {
    return { hasProjection: false };
  }

  const reports = partnership.quarterlyReports;
  const returns = reports.map(r => r.netReturn || 0);
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const currentNav = reports[reports.length - 1].totalNav;
  const ownershipPct = partnership.ownershipPct || 1;

  // Project forward 4 quarters
  const projections = [];
  let projectedNav = currentNav;

  for (let i = 1; i <= 4; i++) {
    projectedNav *= (1 + avgReturn / 100);
    projections.push({
      quarter: i,
      projectedNav: projectedNav,
      yourProjectedValue: projectedNav * (ownershipPct / 100),
      assumedReturn: avgReturn
    });
  }

  return {
    hasProjection: true,
    assumptions: {
      avgHistoricalReturn: avgReturn.toFixed(2),
      quartersOfData: returns.length
    },
    projections,
    disclaimer: 'Projections based on historical average returns. Actual results may vary significantly.'
  };
}
