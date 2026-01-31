import { NextResponse } from 'next/server';

// Goal categories with typical targets and tips
const GOAL_TEMPLATES = {
  emergency_fund: {
    name: 'Emergency Fund',
    icon: '🛡️',
    description: '3-6 months of expenses for unexpected events',
    defaultTarget: null, // Calculate from expenses
    tips: [
      'Aim for 3-6 months of essential expenses',
      'Keep in a high-yield savings account for easy access',
      'Start with $1,000 as a starter fund, then build up',
    ],
  },
  vacation: {
    name: 'Vacation Fund',
    icon: '✈️',
    description: 'Save for your dream trip',
    defaultTarget: 3000,
    tips: [
      'Research average costs for your destination',
      'Book flights early for better deals',
      'Consider travel rewards credit cards',
    ],
  },
  down_payment: {
    name: 'Home Down Payment',
    icon: '🏠',
    description: 'Save for a house down payment',
    defaultTarget: 60000,
    tips: [
      'Aim for 20% to avoid PMI',
      'Look into first-time homebuyer programs',
      'Consider a high-yield savings or CD',
    ],
  },
  car: {
    name: 'New Car Fund',
    icon: '🚗',
    description: 'Save for your next vehicle',
    defaultTarget: 15000,
    tips: [
      'Larger down payment = lower monthly payments',
      'Consider certified pre-owned for value',
      'Factor in insurance and maintenance costs',
    ],
  },
  debt_payoff: {
    name: 'Debt Payoff',
    icon: '💳',
    description: 'Eliminate high-interest debt',
    defaultTarget: null,
    tips: [
      'Use avalanche method (highest interest first) or snowball (smallest balance first)',
      'Consider balance transfer for credit cards',
      'Every extra dollar helps reduce interest',
    ],
  },
  investment: {
    name: 'Investment Goal',
    icon: '📈',
    description: 'Build your investment portfolio',
    defaultTarget: 100000,
    tips: [
      'Diversify across asset classes',
      'Take advantage of employer 401k match',
      'Consider low-cost index funds',
    ],
  },
  education: {
    name: 'Education Fund',
    icon: '🎓',
    description: 'Save for education expenses',
    defaultTarget: 50000,
    tips: [
      'Consider 529 plans for tax advantages',
      'Look into scholarships and grants',
      'Start early to benefit from compounding',
    ],
  },
  wedding: {
    name: 'Wedding Fund',
    icon: '💒',
    description: 'Save for your special day',
    defaultTarget: 25000,
    tips: [
      'Set priorities early - venue, food, photography',
      'Consider off-peak seasons for savings',
      'Track all expenses to stay on budget',
    ],
  },
  custom: {
    name: 'Custom Goal',
    icon: '🎯',
    description: 'Create your own savings goal',
    defaultTarget: 5000,
    tips: [
      'Break large goals into milestones',
      'Set up automatic transfers',
      'Review and adjust regularly',
    ],
  },
};

// Analyze goal progress and provide insights
function analyzeGoal(goal, monthlyContribution, monthlyIncome) {
  const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
  const remaining = goal.targetAmount - goal.currentAmount;

  // Calculate time to goal
  let monthsToGoal = Infinity;
  let projectedDate = null;

  if (monthlyContribution > 0 && remaining > 0) {
    monthsToGoal = Math.ceil(remaining / monthlyContribution);
    projectedDate = new Date();
    projectedDate.setMonth(projectedDate.getMonth() + monthsToGoal);
  } else if (remaining <= 0) {
    monthsToGoal = 0;
    projectedDate = new Date();
  }

  // Check if on track for deadline
  let onTrack = true;
  let monthsUntilDeadline = null;
  let requiredMonthly = null;

  if (goal.deadline) {
    const deadline = new Date(goal.deadline);
    const now = new Date();
    monthsUntilDeadline = Math.max(0, Math.ceil((deadline - now) / (1000 * 60 * 60 * 24 * 30)));

    if (monthsUntilDeadline > 0 && remaining > 0) {
      requiredMonthly = Math.ceil(remaining / monthsUntilDeadline);
      onTrack = monthlyContribution >= requiredMonthly;
    }
  }

  // Generate status
  let status = 'on_track';
  if (progress >= 100) {
    status = 'completed';
  } else if (!onTrack) {
    status = 'behind';
  } else if (progress >= 75) {
    status = 'almost_there';
  } else if (progress >= 50) {
    status = 'halfway';
  } else if (progress >= 25) {
    status = 'making_progress';
  } else {
    status = 'just_started';
  }

  // Generate recommendations
  const recommendations = [];

  if (status === 'behind' && requiredMonthly) {
    const increaseNeeded = requiredMonthly - monthlyContribution;
    recommendations.push({
      type: 'increase_contribution',
      message: `Increase monthly contribution by $${increaseNeeded.toLocaleString()} to meet your deadline.`,
      priority: 'high',
    });
  }

  if (monthlyContribution > 0 && monthlyIncome > 0) {
    const savingsRate = (monthlyContribution / monthlyIncome) * 100;
    if (savingsRate < 10 && status !== 'completed') {
      recommendations.push({
        type: 'boost_savings',
        message: `You're saving ${savingsRate.toFixed(1)}% of income toward this goal. Consider automating higher contributions.`,
        priority: 'medium',
      });
    }
  }

  if (progress >= 90 && progress < 100) {
    recommendations.push({
      type: 'final_push',
      message: `You're so close! Just $${remaining.toLocaleString()} to go. Consider a one-time boost to finish.`,
      priority: 'low',
    });
  }

  // Milestone tracking
  const milestones = [
    { percent: 25, label: '25% milestone', reached: progress >= 25 },
    { percent: 50, label: 'Halfway there!', reached: progress >= 50 },
    { percent: 75, label: '75% milestone', reached: progress >= 75 },
    { percent: 100, label: 'Goal achieved! 🎉', reached: progress >= 100 },
  ];

  return {
    goalId: goal.id,
    name: goal.name,
    category: goal.category,
    targetAmount: goal.targetAmount,
    currentAmount: goal.currentAmount,
    remaining: Math.max(0, remaining),
    progress: Math.min(100, Math.round(progress * 10) / 10),
    monthlyContribution,
    monthsToGoal: monthsToGoal === Infinity ? null : monthsToGoal,
    projectedDate: projectedDate?.toISOString().split('T')[0],
    deadline: goal.deadline,
    monthsUntilDeadline,
    requiredMonthly,
    onTrack,
    status,
    milestones,
    recommendations,
    tips: GOAL_TEMPLATES[goal.category]?.tips || [],
  };
}

// Generate overall goals report
function generateGoalsReport(goals, monthlyContributions, monthlyIncome, totalSavings) {
  const analyses = goals.map(goal =>
    analyzeGoal(goal, monthlyContributions[goal.id] || 0, monthlyIncome)
  );

  const totalTargeted = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalProgress = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const overallProgress = totalTargeted > 0 ? (totalProgress / totalTargeted) * 100 : 0;

  const completedGoals = analyses.filter(a => a.status === 'completed').length;
  const behindGoals = analyses.filter(a => a.status === 'behind').length;
  const onTrackGoals = analyses.filter(a => a.onTrack && a.status !== 'completed').length;

  // Priority recommendations
  const allRecommendations = analyses
    .flatMap(a => a.recommendations.map(r => ({ ...r, goalName: a.name })))
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  // Suggested allocation based on priorities
  const suggestedAllocations = goals.map(goal => {
    const analysis = analyses.find(a => a.goalId === goal.id);
    let weight = 1;

    // Prioritize goals that are behind
    if (analysis?.status === 'behind') weight = 2;
    // De-prioritize completed goals
    if (analysis?.status === 'completed') weight = 0;
    // Prioritize goals with deadlines
    if (goal.deadline && analysis?.monthsUntilDeadline < 6) weight *= 1.5;

    return { goalId: goal.id, name: goal.name, weight };
  });

  const totalWeight = suggestedAllocations.reduce((sum, a) => sum + a.weight, 0);
  const allocations = suggestedAllocations.map(a => ({
    ...a,
    percent: totalWeight > 0 ? Math.round((a.weight / totalWeight) * 100) : 0,
    suggested: totalWeight > 0 ? Math.round((a.weight / totalWeight) * (monthlyIncome * 0.2)) : 0, // Assume 20% savings
  }));

  return {
    analyses,
    summary: {
      totalGoals: goals.length,
      completedGoals,
      onTrackGoals,
      behindGoals,
      totalTargeted,
      totalProgress,
      overallProgress: Math.round(overallProgress * 10) / 10,
      totalRemaining: totalTargeted - totalProgress,
    },
    recommendations: allRecommendations.slice(0, 5),
    suggestedAllocations: allocations.filter(a => a.weight > 0),
    templates: GOAL_TEMPLATES,
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'analyze':
        const analysis = analyzeGoal(
          body.goal,
          body.monthlyContribution || 0,
          body.monthlyIncome || 0
        );
        return NextResponse.json(analysis);

      case 'report':
        const report = generateGoalsReport(
          body.goals || [],
          body.monthlyContributions || {},
          body.monthlyIncome || 0,
          body.totalSavings || 0
        );
        return NextResponse.json(report);

      case 'templates':
        return NextResponse.json({ templates: GOAL_TEMPLATES });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Goals API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
