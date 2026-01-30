import { NextResponse } from 'next/server';

// Trip analysis functions
function analyzeTripExpenses(trip, transactions) {
  const tripTransactions = transactions.filter(tx =>
    trip.transactionIds?.includes(tx.id) ||
    (tx.tripId === trip.id)
  );

  // Calculate totals
  const totalSpent = tripTransactions
    .filter(tx => tx.isExpense)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  // Category breakdown
  const categoryBreakdown = {};
  tripTransactions.forEach(tx => {
    if (tx.isExpense) {
      const cat = tx.primaryCategory || tx.standardCategory || 'Other';
      categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + Math.abs(tx.amount);
    }
  });

  // Daily breakdown
  const dailySpending = {};
  tripTransactions.forEach(tx => {
    if (tx.isExpense) {
      const date = tx.date;
      dailySpending[date] = (dailySpending[date] || 0) + Math.abs(tx.amount);
    }
  });

  // Calculate trip duration
  const startDate = trip.startDate ? new Date(trip.startDate) : null;
  const endDate = trip.endDate ? new Date(trip.endDate) : null;
  const durationDays = startDate && endDate
    ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
    : Object.keys(dailySpending).length || 1;

  // Top merchants
  const merchantSpending = {};
  tripTransactions.forEach(tx => {
    if (tx.isExpense && tx.merchantName) {
      merchantSpending[tx.merchantName] = (merchantSpending[tx.merchantName] || 0) + Math.abs(tx.amount);
    }
  });

  const topMerchants = Object.entries(merchantSpending)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([merchant, amount]) => ({ merchant, amount }));

  // Budget comparison
  const budgetStatus = trip.budget ? {
    budget: trip.budget,
    spent: totalSpent,
    remaining: trip.budget - totalSpent,
    percentUsed: Math.round((totalSpent / trip.budget) * 100),
    status: totalSpent > trip.budget ? 'over' : totalSpent > trip.budget * 0.8 ? 'warning' : 'good',
  } : null;

  return {
    tripId: trip.id,
    tripName: trip.name,
    dates: { start: trip.startDate, end: trip.endDate },
    durationDays,
    transactionCount: tripTransactions.length,
    totalSpent: Math.round(totalSpent * 100) / 100,
    dailyAverage: Math.round((totalSpent / durationDays) * 100) / 100,
    categoryBreakdown: Object.entries(categoryBreakdown)
      .map(([category, amount]) => ({
        category,
        amount: Math.round(amount * 100) / 100,
        percent: Math.round((amount / totalSpent) * 100),
      }))
      .sort((a, b) => b.amount - a.amount),
    dailySpending: Object.entries(dailySpending)
      .map(([date, amount]) => ({ date, amount: Math.round(amount * 100) / 100 }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    topMerchants,
    budgetStatus,
    transactions: tripTransactions,
  };
}

function compareTrips(trips, allTransactions) {
  const analyzedTrips = trips.map(trip => analyzeTripExpenses(trip, allTransactions));

  // Sort by date
  analyzedTrips.sort((a, b) => (b.dates.start || '').localeCompare(a.dates.start || ''));

  // Calculate averages
  const avgTotalSpent = analyzedTrips.reduce((sum, t) => sum + t.totalSpent, 0) / analyzedTrips.length;
  const avgDailySpend = analyzedTrips.reduce((sum, t) => sum + t.dailyAverage, 0) / analyzedTrips.length;
  const avgDuration = analyzedTrips.reduce((sum, t) => sum + t.durationDays, 0) / analyzedTrips.length;

  // Find most expensive category across all trips
  const allCategories = {};
  analyzedTrips.forEach(trip => {
    trip.categoryBreakdown.forEach(cat => {
      allCategories[cat.category] = (allCategories[cat.category] || 0) + cat.amount;
    });
  });

  const topCategoriesOverall = Object.entries(allCategories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category, amount]) => ({ category, amount: Math.round(amount * 100) / 100 }));

  return {
    trips: analyzedTrips,
    summary: {
      totalTrips: analyzedTrips.length,
      totalSpentAllTrips: Math.round(analyzedTrips.reduce((sum, t) => sum + t.totalSpent, 0) * 100) / 100,
      averageTripCost: Math.round(avgTotalSpent * 100) / 100,
      averageDailySpend: Math.round(avgDailySpend * 100) / 100,
      averageDuration: Math.round(avgDuration * 10) / 10,
      topCategoriesOverall,
    },
  };
}

// Suggest transactions that might belong to a trip based on dates and categories
function suggestTripTransactions(trip, transactions) {
  if (!trip.startDate || !trip.endDate) return [];

  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);

  // Travel-related categories
  const travelCategories = [
    'Travel', 'Airlines', 'Hotels', 'Lodging', 'Car Rental',
    'Food and Drink', 'Restaurants', 'Entertainment', 'Recreation',
    'Transportation', 'Gas', 'Parking', 'Rideshare'
  ];

  const suggestions = transactions.filter(tx => {
    // Already assigned to this trip
    if (tx.tripId === trip.id || trip.transactionIds?.includes(tx.id)) return false;

    // Check date range
    const txDate = new Date(tx.date);
    if (txDate < start || txDate > end) return false;

    // Prefer travel-related categories
    const category = tx.primaryCategory || tx.standardCategory || '';
    const isLikelyTravel = travelCategories.some(cat =>
      category.toLowerCase().includes(cat.toLowerCase())
    );

    return isLikelyTravel || tx.isExpense;
  });

  // Sort by likelihood (travel categories first, then by amount)
  return suggestions.sort((a, b) => {
    const aTravel = travelCategories.some(cat =>
      (a.primaryCategory || '').toLowerCase().includes(cat.toLowerCase())
    );
    const bTravel = travelCategories.some(cat =>
      (b.primaryCategory || '').toLowerCase().includes(cat.toLowerCase())
    );
    if (aTravel && !bTravel) return -1;
    if (!aTravel && bTravel) return 1;
    return Math.abs(b.amount) - Math.abs(a.amount);
  }).slice(0, 20);
}

export async function POST(request) {
  try {
    const { action, trip, trips, transactions } = await request.json();

    switch (action) {
      case 'analyze':
        if (!trip || !transactions) {
          return NextResponse.json({ error: 'Trip and transactions required' }, { status: 400 });
        }
        return NextResponse.json(analyzeTripExpenses(trip, transactions));

      case 'compare':
        if (!trips || !transactions) {
          return NextResponse.json({ error: 'Trips and transactions required' }, { status: 400 });
        }
        return NextResponse.json(compareTrips(trips, transactions));

      case 'suggest':
        if (!trip || !transactions) {
          return NextResponse.json({ error: 'Trip and transactions required' }, { status: 400 });
        }
        return NextResponse.json({
          suggestions: suggestTripTransactions(trip, transactions),
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Trip analysis error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
