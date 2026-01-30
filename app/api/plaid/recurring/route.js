import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { clientId, secret, accessToken, environment = 'sandbox' } = await request.json();

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

    const response = await plaidClient.transactionsRecurringGet({
      access_token: accessToken,
    });

    // Process inflows (income)
    const inflows = response.data.inflow_streams.map(stream => ({
      id: stream.stream_id,
      merchantName: stream.merchant_name || stream.description,
      description: stream.description,
      category: stream.category,
      averageAmount: Math.abs(stream.average_amount.amount),
      frequency: stream.frequency,
      lastDate: stream.last_date,
      lastAmount: Math.abs(stream.last_amount.amount),
      isActive: stream.is_active,
      status: stream.status,
      type: 'income',
    }));

    // Process outflows (expenses/subscriptions)
    const outflows = response.data.outflow_streams.map(stream => ({
      id: stream.stream_id,
      merchantName: stream.merchant_name || stream.description,
      description: stream.description,
      category: stream.category,
      averageAmount: stream.average_amount.amount,
      frequency: stream.frequency,
      lastDate: stream.last_date,
      lastAmount: stream.last_amount.amount,
      isActive: stream.is_active,
      status: stream.status,
      type: 'expense',
    }));

    // Identify subscriptions (monthly recurring expenses)
    const subscriptions = outflows.filter(o =>
      o.isActive &&
      o.frequency === 'MONTHLY' &&
      o.averageAmount < 500 // Typical subscription threshold
    );

    // Calculate monthly totals
    const monthlyIncome = inflows
      .filter(i => i.isActive && i.frequency === 'MONTHLY')
      .reduce((sum, i) => sum + i.averageAmount, 0);

    const monthlyExpenses = outflows
      .filter(o => o.isActive && o.frequency === 'MONTHLY')
      .reduce((sum, o) => sum + o.averageAmount, 0);

    const monthlySubscriptions = subscriptions
      .reduce((sum, s) => sum + s.averageAmount, 0);

    // Annualize all recurring
    const annualIncome = inflows
      .filter(i => i.isActive)
      .reduce((sum, i) => {
        const multiplier = i.frequency === 'WEEKLY' ? 52 :
                          i.frequency === 'BIWEEKLY' ? 26 :
                          i.frequency === 'SEMI_MONTHLY' ? 24 :
                          i.frequency === 'MONTHLY' ? 12 :
                          i.frequency === 'ANNUALLY' ? 1 : 12;
        return sum + (i.averageAmount * multiplier);
      }, 0);

    const annualExpenses = outflows
      .filter(o => o.isActive)
      .reduce((sum, o) => {
        const multiplier = o.frequency === 'WEEKLY' ? 52 :
                          o.frequency === 'BIWEEKLY' ? 26 :
                          o.frequency === 'SEMI_MONTHLY' ? 24 :
                          o.frequency === 'MONTHLY' ? 12 :
                          o.frequency === 'ANNUALLY' ? 1 : 12;
        return sum + (o.averageAmount * multiplier);
      }, 0);

    return NextResponse.json({
      inflows,
      outflows,
      subscriptions,
      summary: {
        totalRecurringInflows: inflows.length,
        totalRecurringOutflows: outflows.length,
        totalSubscriptions: subscriptions.length,
        monthlyIncome: Math.round(monthlyIncome * 100) / 100,
        monthlyExpenses: Math.round(monthlyExpenses * 100) / 100,
        monthlySubscriptions: Math.round(monthlySubscriptions * 100) / 100,
        monthlyCashFlow: Math.round((monthlyIncome - monthlyExpenses) * 100) / 100,
        annualIncome: Math.round(annualIncome * 100) / 100,
        annualExpenses: Math.round(annualExpenses * 100) / 100,
        annualCashFlow: Math.round((annualIncome - annualExpenses) * 100) / 100,
      },
    });
  } catch (error) {
    console.error('Plaid recurring error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data?.error_message || error.message },
      { status: 500 }
    );
  }
}
