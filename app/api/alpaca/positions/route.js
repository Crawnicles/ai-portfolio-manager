import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { apiKey, secretKey } = await request.json();

    const response = await fetch('https://paper-api.alpaca.markets/v2/positions', {
      headers: {
        'APCA-API-KEY-ID': apiKey,
        'APCA-API-SECRET-KEY': secretKey,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch positions' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}