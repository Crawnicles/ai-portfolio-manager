import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from 'plaid';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { clientId, secret, environment = 'sandbox' } = await request.json();

    if (!clientId || !secret) {
      return NextResponse.json({ error: 'Missing Plaid credentials' }, { status: 400 });
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

    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: 'user-' + Date.now() },
      client_name: 'AI Portfolio Manager',
      products: [Products.Transactions, Products.Auth],
      country_codes: [CountryCode.Us],
      language: 'en',
    });

    return NextResponse.json({
      link_token: response.data.link_token,
      expiration: response.data.expiration,
    });
  } catch (error) {
    console.error('Plaid link token error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data?.error_message || error.message },
      { status: 500 }
    );
  }
}
