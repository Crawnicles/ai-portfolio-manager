// Phase 22: Insurance Dashboard API
// Track all insurance policies, premiums, coverage, and predict costs

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'summary';

  // This would normally come from a database
  // For now, return analysis structure that the frontend will populate

  if (action === 'analysis') {
    return Response.json({
      success: true,
      analysis: {
        // Will be calculated from user's policies
        totalAnnualPremiums: 0,
        totalMonthlyPremiums: 0,
        coverageGaps: [],
        recommendations: [],
        projectedCosts: [],
      }
    });
  }

  return Response.json({ success: true, message: 'Insurance API ready' });
}

export async function POST(request) {
  const body = await request.json();
  const { action, policies } = body;

  if (action === 'analyze') {
    // Analyze the user's insurance portfolio
    const analysis = analyzeInsurancePortfolio(policies || []);
    return Response.json({ success: true, analysis });
  }

  return Response.json({ success: false, error: 'Unknown action' });
}

function analyzeInsurancePortfolio(policies) {
  // Calculate totals
  const totalAnnual = policies.reduce((sum, p) => {
    const annual = p.paymentFrequency === 'monthly' ? p.premium * 12 :
                   p.paymentFrequency === 'quarterly' ? p.premium * 4 :
                   p.paymentFrequency === 'semi-annual' ? p.premium * 2 :
                   p.premium;
    return sum + annual;
  }, 0);

  const totalMonthly = totalAnnual / 12;

  // Check for coverage gaps
  const coverageGaps = [];
  const policyTypes = policies.map(p => p.type);

  if (!policyTypes.includes('life') && !policyTypes.includes('term-life')) {
    coverageGaps.push({
      type: 'life',
      severity: 'high',
      recommendation: 'Consider term life insurance to protect your family\'s income',
      estimatedCost: '$30-50/month for $500K coverage'
    });
  }

  if (!policyTypes.includes('disability')) {
    coverageGaps.push({
      type: 'disability',
      severity: 'high',
      recommendation: 'Long-term disability insurance protects your income if you can\'t work',
      estimatedCost: '1-3% of annual income'
    });
  }

  if (!policyTypes.includes('umbrella')) {
    coverageGaps.push({
      type: 'umbrella',
      severity: 'medium',
      recommendation: 'Umbrella policy provides extra liability coverage beyond home/auto limits',
      estimatedCost: '$150-300/year for $1M coverage'
    });
  }

  if (!policyTypes.includes('renters') && !policyTypes.includes('home')) {
    coverageGaps.push({
      type: 'property',
      severity: 'medium',
      recommendation: 'Renters or homeowners insurance protects your belongings',
      estimatedCost: '$15-30/month for renters, varies for homeowners'
    });
  }

  // Generate recommendations
  const recommendations = [];

  // Check for high deductibles relative to emergency fund
  policies.forEach(p => {
    if (p.deductible > 5000) {
      recommendations.push({
        policy: p.name,
        type: 'deductible',
        message: `High deductible of $${p.deductible.toLocaleString()}. Ensure you have this in emergency fund.`
      });
    }
  });

  // Check for policies expiring soon
  const now = new Date();
  policies.forEach(p => {
    if (p.renewalDate) {
      const renewal = new Date(p.renewalDate);
      const daysUntilRenewal = Math.ceil((renewal - now) / (1000 * 60 * 60 * 24));
      if (daysUntilRenewal > 0 && daysUntilRenewal <= 30) {
        recommendations.push({
          policy: p.name,
          type: 'renewal',
          message: `Renews in ${daysUntilRenewal} days. Shop around for better rates!`
        });
      }
    }
  });

  // Bundle savings check
  const hasAuto = policyTypes.includes('auto');
  const hasHome = policyTypes.includes('home') || policyTypes.includes('renters');
  if (hasAuto && hasHome) {
    const autoProvider = policies.find(p => p.type === 'auto')?.provider;
    const homeProvider = policies.find(p => p.type === 'home' || p.type === 'renters')?.provider;
    if (autoProvider !== homeProvider) {
      recommendations.push({
        policy: 'Multiple',
        type: 'bundle',
        message: 'Consider bundling auto & home with same provider for 10-25% discount'
      });
    }
  }

  // Project future costs (assume 3-5% annual increase)
  const projectedCosts = [];
  for (let year = 0; year <= 5; year++) {
    const inflationFactor = Math.pow(1.04, year); // 4% average insurance inflation
    projectedCosts.push({
      year: new Date().getFullYear() + year,
      annual: Math.round(totalAnnual * inflationFactor),
      monthly: Math.round((totalAnnual * inflationFactor) / 12),
    });
  }

  // Calculate by category
  const byCategory = {};
  policies.forEach(p => {
    const category = getCategoryForType(p.type);
    const annual = p.paymentFrequency === 'monthly' ? p.premium * 12 :
                   p.paymentFrequency === 'quarterly' ? p.premium * 4 :
                   p.paymentFrequency === 'semi-annual' ? p.premium * 2 :
                   p.premium;
    byCategory[category] = (byCategory[category] || 0) + annual;
  });

  return {
    totalAnnualPremiums: totalAnnual,
    totalMonthlyPremiums: totalMonthly,
    byCategory,
    coverageGaps,
    recommendations,
    projectedCosts,
    policyCount: policies.length,
  };
}

function getCategoryForType(type) {
  const categories = {
    'auto': 'Vehicle',
    'motorcycle': 'Vehicle',
    'boat': 'Vehicle',
    'rv': 'Vehicle',
    'home': 'Property',
    'renters': 'Property',
    'condo': 'Property',
    'flood': 'Property',
    'earthquake': 'Property',
    'life': 'Life & Income',
    'term-life': 'Life & Income',
    'whole-life': 'Life & Income',
    'disability': 'Life & Income',
    'health': 'Health',
    'dental': 'Health',
    'vision': 'Health',
    'hsa': 'Health',
    'umbrella': 'Liability',
    'pet': 'Other',
    'travel': 'Other',
    'jewelry': 'Other',
    'business': 'Business',
  };
  return categories[type] || 'Other';
}
