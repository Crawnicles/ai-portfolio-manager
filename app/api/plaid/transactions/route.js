import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { clientId, secret, accessToken, environment = 'sandbox', startDate, endDate } = await request.json();

    if (!clientId || !secret || !accessToken) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const configuration = new Configuration({
      basePath: PlaidEnvironments[environment],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': clientId,
          'PLAID-SECRET': secret,
        },
      },
    });

    const plaidClient = new PlaidApi(configuration);

    // Default to last 30 days if not specified
    const end = endDate || new Date().toISOString().split('T')[0];
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const response = await plaidClient.transactionsGet({
      access_token: accessToken,
      start_date: start,
      end_date: end,
      options: {
        count: 500,
        offset: 0,
      },
    });

    // Categorize and enrich transactions
    const transactions = response.data.transactions.map(tx => ({
      id: tx.transaction_id,
      date: tx.date,
      name: tx.name,
      merchantName: tx.merchant_name,
      amount: tx.amount,
      category: tx.category,
      primaryCategory: tx.category?.[0] || 'Uncategorized',
      detailedCategory: tx.personal_finance_category?.detailed || tx.category?.join(' > '),
      pending: tx.pending,
      accountId: tx.account_id,
      paymentChannel: tx.payment_channel,
      location: tx.location,
      isExpense: tx.amount > 0, // Plaid: positive = money out, negative = money in
    }));

    // Calculate spending by category
    const categorySpending = {};
    transactions.forEach(tx => {
      if (tx.isExpense && !tx.pending) {
        const cat = tx.primaryCategory;
        categorySpending[cat] = (categorySpending[cat] || 0) + tx.amount;
      }
    });

    // Calculate spending by merchant
    const merchantSpending = {};
    transactions.forEach(tx => {
      if (tx.isExpense && !tx.pending && tx.merchantName) {
        merchantSpending[tx.merchantName] = (merchantSpending[tx.merchantName] || 0) + tx.amount;
      }
    });

    // Calculate daily spending
    const dailySpending = {};
    transactions.forEach(tx => {
      if (tx.isExpense && !tx.pending) {
        dailySpending[tx.date] = (dailySpending[tx.date] || 0) + tx.amount;
      }
    });

    // Sort categories by spending
    const topCategories = Object.entries(categorySpending)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([category, amount]) => ({ category, amount: Math.round(amount * 100) / 100 }));

    // Sort merchants by spending
    const topMerchants = Object.entries(merchantSpending)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([merchant, amount]) => ({ merchant, amount: Math.round(amount * 100) / 100 }));

    // Calculate totals
    const totalSpending = transactions
      .filter(tx => tx.isExpense && !tx.pending)
      .reduce((sum, tx) => sum + tx.amount, 0);

    const totalIncome = transactions
      .filter(tx => !tx.isExpense && !tx.pending)
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    return NextResponse.json({
      transactions,
      accounts: response.data.accounts,
      summary: {
        totalTransactions: transactions.length,
        totalSpending: Math.round(totalSpending * 100) / 100,
        totalIncome: Math.round(totalIncome * 100) / 100,
        netCashFlow: Math.round((totalIncome - totalSpending) * 100) / 100,
        topCategories,
        topMerchants,
        dailySpending: Object.entries(dailySpending)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([date, amount]) => ({ date, amount: Math.round(amount * 100) / 100 })),
        dateRange: { start, end },
      },
    });
  } catch (error) {
    console.error('Plaid transactions error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data?.error_message || error.message },
      { status: 500 }
    );
  }
}
