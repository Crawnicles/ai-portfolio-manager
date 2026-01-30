import { NextResponse } from 'next/server';

// Standard budget categories with smart subcategory mapping
const CATEGORY_MAP = {
  'Food and Drink': { icon: '🍔', color: '#F59E0B', subcategories: ['Restaurants', 'Fast Food', 'Coffee Shops', 'Groceries', 'Alcohol & Bars'] },
  'Shopping': { icon: '🛍️', color: '#EC4899', subcategories: ['Clothing', 'Electronics', 'Home', 'Sporting Goods', 'Hobbies'] },
  'Transportation': { icon: '🚗', color: '#3B82F6', subcategories: ['Gas', 'Parking', 'Public Transit', 'Rideshare', 'Auto Insurance', 'Auto Payment'] },
  'Travel': { icon: '✈️', color: '#8B5CF6', subcategories: ['Airlines', 'Hotels', 'Car Rental', 'Vacation'] },
  'Entertainment': { icon: '🎬', color: '#EF4444', subcategories: ['Movies', 'Music', 'Games', 'Sports', 'Concerts'] },
  'Bills & Utilities': { icon: '💡', color: '#6366F1', subcategories: ['Electric', 'Gas', 'Water', 'Internet', 'Phone', 'Cable'] },
  'Health': { icon: '🏥', color: '#10B981', subcategories: ['Doctor', 'Pharmacy', 'Gym', 'Vision', 'Dental'] },
  'Personal Care': { icon: '💇', color: '#F472B6', subcategories: ['Hair', 'Spa', 'Cosmetics'] },
  'Education': { icon: '📚', color: '#06B6D4', subcategories: ['Tuition', 'Books', 'Courses'] },
  'Subscriptions': { icon: '📱', color: '#A855F7', subcategories: ['Streaming', 'Software', 'Memberships', 'News'] },
  'Fees & Charges': { icon: '🏦', color: '#64748B', subcategories: ['Bank Fees', 'ATM', 'Late Fees', 'Service Charges'] },
  'Gifts & Donations': { icon: '🎁', color: '#F97316', subcategories: ['Gifts', 'Charity', 'Donations'] },
  'Home': { icon: '🏠', color: '#84CC16', subcategories: ['Rent', 'Mortgage', 'Maintenance', 'Furniture', 'Garden'] },
  'Kids': { icon: '👶', color: '#FBBF24', subcategories: ['Childcare', 'School', 'Toys', 'Activities'] },
  'Pets': { icon: '🐕', color: '#A3E635', subcategories: ['Food', 'Vet', 'Grooming', 'Supplies'] },
  'Insurance': { icon: '🛡️', color: '#0EA5E9', subcategories: ['Health', 'Life', 'Home', 'Auto'] },
  'Taxes': { icon: '📋', color: '#DC2626', subcategories: ['Federal', 'State', 'Property'] },
  'Transfer': { icon: '↔️', color: '#94A3B8', subcategories: ['Transfer', 'Payment', 'Credit Card Payment'] },
  'Income': { icon: '💰', color: '#22C55E', subcategories: ['Salary', 'Freelance', 'Interest', 'Dividends', 'Refunds'] },
  'Other': { icon: '📦', color: '#78716C', subcategories: [] },
};

// Smart category mapping from Plaid categories
function mapToStandardCategory(plaidCategory) {
  const categoryLower = (plaidCategory || '').toLowerCase();

  if (categoryLower.includes('food') || categoryLower.includes('restaurant') || categoryLower.includes('grocery') || categoryLower.includes('coffee')) return 'Food and Drink';
  if (categoryLower.includes('shop') || categoryLower.includes('merchandise') || categoryLower.includes('clothing') || categoryLower.includes('department')) return 'Shopping';
  if (categoryLower.includes('travel') || categoryLower.includes('airline') || categoryLower.includes('hotel') || categoryLower.includes('lodging')) return 'Travel';
  if (categoryLower.includes('transport') || categoryLower.includes('gas') || categoryLower.includes('uber') || categoryLower.includes('lyft') || categoryLower.includes('parking')) return 'Transportation';
  if (categoryLower.includes('entertainment') || categoryLower.includes('recreation') || categoryLower.includes('movie') || categoryLower.includes('music')) return 'Entertainment';
  if (categoryLower.includes('bill') || categoryLower.includes('utility') || categoryLower.includes('electric') || categoryLower.includes('phone') || categoryLower.includes('internet')) return 'Bills & Utilities';
  if (categoryLower.includes('health') || categoryLower.includes('medical') || categoryLower.includes('pharmacy') || categoryLower.includes('doctor') || categoryLower.includes('gym') || categoryLower.includes('fitness')) return 'Health';
  if (categoryLower.includes('subscription') || categoryLower.includes('streaming')) return 'Subscriptions';
  if (categoryLower.includes('fee') || categoryLower.includes('charge') || categoryLower.includes('atm') || categoryLower.includes('bank')) return 'Fees & Charges';
  if (categoryLower.includes('gift') || categoryLower.includes('donation') || categoryLower.includes('charity')) return 'Gifts & Donations';
  if (categoryLower.includes('home') || categoryLower.includes('rent') || categoryLower.includes('mortgage') || categoryLower.includes('furniture')) return 'Home';
  if (categoryLower.includes('kid') || categoryLower.includes('child') || categoryLower.includes('school') || categoryLower.includes('daycare')) return 'Kids';
  if (categoryLower.includes('pet') || categoryLower.includes('vet')) return 'Pets';
  if (categoryLower.includes('insurance')) return 'Insurance';
  if (categoryLower.includes('tax')) return 'Taxes';
  if (categoryLower.includes('transfer') || categoryLower.includes('payment')) return 'Transfer';
  if (categoryLower.includes('income') || categoryLower.includes('payroll') || categoryLower.includes('deposit') || categoryLower.includes('salary')) return 'Income';
  if (categoryLower.includes('personal') || categoryLower.includes('hair') || categoryLower.includes('spa')) return 'Personal Care';
  if (categoryLower.includes('education') || categoryLower.includes('book') || categoryLower.includes('tuition')) return 'Education';

  return 'Other';
}

// Detect spending anomalies
function detectAnomalies(currentPeriod, previousPeriods) {
  const anomalies = [];

  Object.entries(currentPeriod).forEach(([category, currentAmount]) => {
    if (category === 'Income' || category === 'Transfer') return;

    const previousAmounts = previousPeriods.map(p => p[category] || 0).filter(a => a > 0);
    if (previousAmounts.length < 2) return;

    const avgPrevious = previousAmounts.reduce((a, b) => a + b, 0) / previousAmounts.length;
    const stdDev = Math.sqrt(previousAmounts.reduce((sq, n) => sq + Math.pow(n - avgPrevious, 2), 0) / previousAmounts.length);

    if (currentAmount > avgPrevious + (stdDev * 1.5) && currentAmount > avgPrevious * 1.3) {
      const pctIncrease = ((currentAmount - avgPrevious) / avgPrevious * 100).toFixed(0);
      anomalies.push({
        category,
        type: 'spike',
        severity: currentAmount > avgPrevious * 2 ? 'high' : 'medium',
        currentAmount,
        averageAmount: avgPrevious,
        percentChange: parseFloat(pctIncrease),
        message: `${category} spending is ${pctIncrease}% higher than usual ($${currentAmount.toFixed(0)} vs avg $${avgPrevious.toFixed(0)})`,
      });
    } else if (currentAmount < avgPrevious * 0.5 && avgPrevious > 50) {
      const pctDecrease = ((avgPrevious - currentAmount) / avgPrevious * 100).toFixed(0);
      anomalies.push({
        category,
        type: 'drop',
        severity: 'low',
        currentAmount,
        averageAmount: avgPrevious,
        percentChange: -parseFloat(pctDecrease),
        message: `${category} spending is ${pctDecrease}% lower than usual - nice savings!`,
      });
    }
  });

  return anomalies.sort((a, b) => Math.abs(b.percentChange) - Math.abs(a.percentChange));
}

// Generate smart budget suggestions
function suggestBudgets(monthlyAverages, income) {
  const suggestions = [];
  const totalExpenses = Object.entries(monthlyAverages)
    .filter(([cat]) => cat !== 'Income' && cat !== 'Transfer')
    .reduce((sum, [, amt]) => sum + amt, 0);

  // 50/30/20 rule targets
  const needsTarget = income * 0.5;
  const wantsTarget = income * 0.3;
  const savingsTarget = income * 0.2;

  const needs = ['Home', 'Bills & Utilities', 'Transportation', 'Health', 'Insurance', 'Groceries'];
  const wants = ['Food and Drink', 'Shopping', 'Entertainment', 'Travel', 'Subscriptions', 'Personal Care'];

  Object.entries(monthlyAverages).forEach(([category, avgAmount]) => {
    if (category === 'Income' || category === 'Transfer' || avgAmount < 10) return;

    const catInfo = CATEGORY_MAP[category] || CATEGORY_MAP['Other'];
    const isNeed = needs.some(n => category.includes(n));

    // Suggest budget slightly above average with 10% buffer
    let suggestedBudget = Math.ceil(avgAmount * 1.1 / 10) * 10;

    // For discretionary categories, suggest more aggressive budgets
    if (wants.includes(category) && avgAmount > income * 0.1) {
      suggestedBudget = Math.ceil(avgAmount * 0.9 / 10) * 10;
    }

    suggestions.push({
      category,
      icon: catInfo.icon,
      color: catInfo.color,
      averageSpending: avgAmount,
      suggestedBudget,
      isEssential: isNeed,
      reasoning: isNeed
        ? `Essential expense - budget based on historical average plus 10% buffer`
        : avgAmount > income * 0.1
          ? `Discretionary spending is ${((avgAmount / income) * 100).toFixed(0)}% of income - consider reducing`
          : `Budget based on your typical spending pattern`,
    });
  });

  return suggestions.sort((a, b) => b.averageSpending - a.averageSpending);
}

// Generate insights
function generateInsights(transactions, budgets, categorySpending, income) {
  const insights = [];

  // Budget status insights
  Object.entries(budgets).forEach(([category, budget]) => {
    const spent = categorySpending[category] || 0;
    const pctUsed = (spent / budget) * 100;

    if (pctUsed >= 100) {
      insights.push({
        type: 'warning',
        priority: 1,
        category,
        message: `Over budget on ${category}: $${spent.toFixed(0)} spent vs $${budget} budget (${pctUsed.toFixed(0)}%)`,
        action: `Consider reducing ${category} spending for the rest of the month`,
      });
    } else if (pctUsed >= 80) {
      insights.push({
        type: 'caution',
        priority: 2,
        category,
        message: `Approaching ${category} budget: ${pctUsed.toFixed(0)}% used ($${(budget - spent).toFixed(0)} remaining)`,
        action: `You have $${(budget - spent).toFixed(0)} left for ${category} this month`,
      });
    }
  });

  // Savings rate insight
  const totalExpenses = Object.entries(categorySpending)
    .filter(([cat]) => cat !== 'Income' && cat !== 'Transfer')
    .reduce((sum, [, amt]) => sum + amt, 0);

  if (income > 0) {
    const savingsRate = ((income - totalExpenses) / income * 100);
    if (savingsRate >= 20) {
      insights.push({
        type: 'success',
        priority: 3,
        message: `Great job! You're saving ${savingsRate.toFixed(0)}% of your income this month`,
        action: 'Consider investing your surplus in index funds or paying down debt',
      });
    } else if (savingsRate < 10 && savingsRate >= 0) {
      insights.push({
        type: 'warning',
        priority: 2,
        message: `Low savings rate: ${savingsRate.toFixed(0)}% - aim for at least 20%`,
        action: 'Review discretionary spending to find areas to cut back',
      });
    } else if (savingsRate < 0) {
      insights.push({
        type: 'alert',
        priority: 1,
        message: `Spending exceeds income by $${Math.abs(income - totalExpenses).toFixed(0)}`,
        action: 'Review and reduce non-essential expenses immediately',
      });
    }
  }

  // Top spending category insight
  const topCategory = Object.entries(categorySpending)
    .filter(([cat]) => cat !== 'Income' && cat !== 'Transfer')
    .sort((a, b) => b[1] - a[1])[0];

  if (topCategory && income > 0) {
    const pctOfIncome = (topCategory[1] / income * 100);
    if (pctOfIncome > 30) {
      insights.push({
        type: 'info',
        priority: 3,
        message: `${topCategory[0]} is your biggest expense at ${pctOfIncome.toFixed(0)}% of income ($${topCategory[1].toFixed(0)})`,
        action: topCategory[0] === 'Home' || topCategory[0] === 'Transportation'
          ? 'This is typical for essential expenses'
          : 'Consider if this aligns with your financial goals',
      });
    }
  }

  return insights.sort((a, b) => a.priority - b.priority);
}

export async function POST(request) {
  try {
    const { transactions, budgets = {}, previousTransactions = [], monthlyIncome = 0 } = await request.json();

    if (!transactions || !Array.isArray(transactions)) {
      return NextResponse.json({ error: 'Transactions array required' }, { status: 400 });
    }

    // Map and categorize transactions
    const categorizedTransactions = transactions.map(tx => ({
      ...tx,
      standardCategory: mapToStandardCategory(tx.primaryCategory || tx.category?.[0]),
      categoryInfo: CATEGORY_MAP[mapToStandardCategory(tx.primaryCategory || tx.category?.[0])] || CATEGORY_MAP['Other'],
    }));

    // Calculate spending by standard category
    const categorySpending = {};
    categorizedTransactions.forEach(tx => {
      if (tx.isExpense && !tx.pending) {
        const cat = tx.standardCategory;
        categorySpending[cat] = (categorySpending[cat] || 0) + tx.amount;
      }
    });

    // Calculate income
    const totalIncome = monthlyIncome || categorizedTransactions
      .filter(tx => !tx.isExpense && !tx.pending)
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    // Calculate budget vs actual
    const budgetStatus = {};
    Object.entries(budgets).forEach(([category, budget]) => {
      const spent = categorySpending[category] || 0;
      budgetStatus[category] = {
        budget,
        spent: Math.round(spent * 100) / 100,
        remaining: Math.round((budget - spent) * 100) / 100,
        percentUsed: Math.round((spent / budget) * 100),
        status: spent > budget ? 'over' : spent > budget * 0.8 ? 'warning' : 'good',
      };
    });

    // Process previous periods for anomaly detection
    const previousPeriodSpending = previousTransactions.map(periodTxs => {
      const spending = {};
      periodTxs.forEach(tx => {
        if (tx.isExpense || tx.amount > 0) {
          const cat = mapToStandardCategory(tx.primaryCategory || tx.category?.[0]);
          spending[cat] = (spending[cat] || 0) + Math.abs(tx.amount);
        }
      });
      return spending;
    });

    // Calculate monthly averages from previous periods
    const monthlyAverages = {};
    const allCategories = new Set([
      ...Object.keys(categorySpending),
      ...previousPeriodSpending.flatMap(p => Object.keys(p)),
    ]);

    allCategories.forEach(cat => {
      const amounts = [
        categorySpending[cat] || 0,
        ...previousPeriodSpending.map(p => p[cat] || 0),
      ].filter(a => a > 0);

      if (amounts.length > 0) {
        monthlyAverages[cat] = amounts.reduce((a, b) => a + b, 0) / amounts.length;
      }
    });

    // Detect anomalies
    const anomalies = detectAnomalies(categorySpending, previousPeriodSpending);

    // Generate budget suggestions
    const budgetSuggestions = suggestBudgets(monthlyAverages, totalIncome);

    // Generate insights
    const insights = generateInsights(categorizedTransactions, budgets, categorySpending, totalIncome);

    // Build category summary with enriched data
    const categorySummary = Object.entries(categorySpending)
      .filter(([cat]) => cat !== 'Transfer')
      .map(([category, amount]) => {
        const catInfo = CATEGORY_MAP[category] || CATEGORY_MAP['Other'];
        const budget = budgets[category];
        return {
          category,
          icon: catInfo.icon,
          color: catInfo.color,
          amount: Math.round(amount * 100) / 100,
          budget: budget || null,
          percentOfBudget: budget ? Math.round((amount / budget) * 100) : null,
          percentOfTotal: Math.round((amount / Object.values(categorySpending).reduce((a, b) => a + b, 0)) * 100),
          monthlyAverage: monthlyAverages[category] ? Math.round(monthlyAverages[category] * 100) / 100 : null,
          trend: monthlyAverages[category]
            ? amount > monthlyAverages[category] * 1.1 ? 'up'
              : amount < monthlyAverages[category] * 0.9 ? 'down'
              : 'stable'
            : null,
        };
      })
      .sort((a, b) => b.amount - a.amount);

    return NextResponse.json({
      categorizedTransactions,
      categorySummary,
      budgetStatus,
      anomalies,
      insights,
      budgetSuggestions,
      totals: {
        income: Math.round(totalIncome * 100) / 100,
        expenses: Math.round(Object.entries(categorySpending)
          .filter(([cat]) => cat !== 'Income' && cat !== 'Transfer')
          .reduce((sum, [, amt]) => sum + amt, 0) * 100) / 100,
        netCashFlow: Math.round((totalIncome - Object.entries(categorySpending)
          .filter(([cat]) => cat !== 'Income' && cat !== 'Transfer')
          .reduce((sum, [, amt]) => sum + amt, 0)) * 100) / 100,
      },
      categoryMap: CATEGORY_MAP,
    });
  } catch (error) {
    console.error('Budget analysis error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
