import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { apiKey, secretKey, symbol, qty, side, type = 'market', timeInForce = 'day' } = await request.json();

    const response = await fetch('https://paper-api.alpaca.markets/v2/orders', {
      method: 'POST',
      headers: {
        'APCA-API-KEY-ID': apiKey,
        'APCA-API-SECRET-KEY': secretKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symbol,
        qty: String(qty),
        side,
        type,
        time_in_force: timeInForce,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error.message || 'Failed to submit order' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}