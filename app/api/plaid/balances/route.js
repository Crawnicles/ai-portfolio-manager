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

    const response = await plaidClient.accountsBalanceGet({
      access_token: accessToken,
    });

    const accounts = response.data.accounts.map(account => ({
      id: account.account_id,
      name: account.name,
      officialName: account.official_name,
      type: account.type,
      subtype: account.subtype,
      mask: account.mask,
      balances: {
        current: account.balances.current,
        available: account.balances.available,
        limit: account.balances.limit,
        isoCurrencyCode: account.balances.iso_currency_code,
      },
    }));

    // Categorize accounts
    const checking = accounts.filter(a => a.subtype === 'checking');
    const savings = accounts.filter(a => a.subtype === 'savings');
    const creditCards = accounts.filter(a => a.type === 'credit');
    const investments = accounts.filter(a => a.type === 'investment');
    const loans = accounts.filter(a => a.type === 'loan');

    // Calculate totals
    const totalCash = [...checking, ...savings]
      .reduce((sum, a) => sum + (a.balances.current || 0), 0);

    const totalCreditDebt = creditCards
      .reduce((sum, a) => sum + (a.balances.current || 0), 0);

    const totalCreditAvailable = creditCards
      .reduce((sum, a) => sum + ((a.balances.limit || 0) - (a.balances.current || 0)), 0);

    const totalInvestments = investments
      .reduce((sum, a) => sum + (a.balances.current || 0), 0);

    const totalLoans = loans
      .reduce((sum, a) => sum + (a.balances.current || 0), 0);

    return NextResponse.json({
      accounts,
      summary: {
        totalAccounts: accounts.length,
        totalCash: Math.round(totalCash * 100) / 100,
        totalCreditDebt: Math.round(totalCreditDebt * 100) / 100,
        totalCreditAvailable: Math.round(totalCreditAvailable * 100) / 100,
        totalInvestments: Math.round(totalInvestments * 100) / 100,
        totalLoans: Math.round(totalLoans * 100) / 100,
        netWorth: Math.round((totalCash + totalInvestments - totalCreditDebt - totalLoans) * 100) / 100,
        byType: {
          checking: checking.length,
          savings: savings.length,
          creditCards: creditCards.length,
          investments: investments.length,
          loans: loans.length,
        },
      },
      item: response.data.item,
    });
  } catch (error) {
    console.error('Plaid balances error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data?.error_message || error.message },
      { status: 500 }
    );
  }
}
