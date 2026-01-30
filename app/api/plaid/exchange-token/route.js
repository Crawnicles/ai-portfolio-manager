import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { clientId, secret, publicToken, environment = 'sandbox' } = await request.json();

    if (!clientId || !secret || !publicToken) {
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

    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    return NextResponse.json({
      access_token: response.data.access_token,
      item_id: response.data.item_id,
    });
  } catch (error) {
    console.error('Plaid exchange error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data?.error_message || error.message },
      { status: 500 }
    );
  }
}
