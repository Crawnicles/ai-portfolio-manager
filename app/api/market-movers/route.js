// Phase 21: Market Volatility Explainer API
// Explains why big price changes happen - gold, silver, crypto, commodities, stocks

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'all';
  const symbol = searchParams.get('symbol');

  // Major Market Movers with Explanations
  const marketMovers = {
    // Precious Metals
    metals: [
      {
        symbol: 'GOLD',
        name: 'Gold',
        price: 2847.50,
        change: 4.2,
        changePercent: 0.15,
        volume: '185M',
        volatility: 'elevated',
        direction: 'up',
        drivers: [
          { factor: 'Fed Rate Expectations', impact: 'bullish', weight: 35, explanation: 'Markets pricing in rate cuts for 2026, weakening dollar' },
          { factor: 'Geopolitical Tensions', impact: 'bullish', weight: 30, explanation: 'Middle East conflicts driving safe-haven demand' },
          { factor: 'Central Bank Buying', impact: 'bullish', weight: 25, explanation: 'China, India, Turkey accumulating reserves at record pace' },
          { factor: 'Inflation Hedging', impact: 'bullish', weight: 10, explanation: 'Persistent sticky inflation in services sector' },
        ],
        catalysts: [
          { date: '2026-01-29', event: 'Fed FOMC Meeting', outcome: 'Rates held steady, dovish guidance' },
          { date: '2026-01-15', event: 'China Gold Imports', outcome: 'Record monthly imports reported' },
        ],
        technicals: { support: 2750, resistance: 2900, rsi: 68, trend: 'bullish' },
        outlook: 'Gold remains well-supported with central banks diversifying away from USD. Key resistance at $2900.',
      },
      {
        symbol: 'SILVER',
        name: 'Silver',
        price: 32.45,
        change: 1.85,
        changePercent: 6.05,
        volume: '95M',
        volatility: 'high',
        direction: 'up',
        drivers: [
          { factor: 'Industrial Demand', impact: 'bullish', weight: 40, explanation: 'Solar panel demand at all-time highs, EV battery tech' },
          { factor: 'Gold Correlation', impact: 'bullish', weight: 25, explanation: 'Silver following gold higher with leverage' },
          { factor: 'Supply Constraints', impact: 'bullish', weight: 20, explanation: 'Major mines in Mexico facing production issues' },
          { factor: 'Speculative Interest', impact: 'bullish', weight: 15, explanation: 'Retail interest renewed via social media' },
        ],
        catalysts: [
          { date: '2026-01-28', event: 'Solar Industry Report', outcome: 'Record installations projected for 2026' },
          { date: '2026-01-20', event: 'Mexican Mining Data', outcome: 'Production down 8% YoY' },
        ],
        technicals: { support: 30, resistance: 35, rsi: 72, trend: 'bullish' },
        outlook: 'Silver volatile but bullish. Industrial use case strengthens long-term thesis. Watch $35 resistance.',
      },
    ],

    // Cryptocurrencies
    crypto: [
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 104250,
        change: -2100,
        changePercent: -1.97,
        volume: '42B',
        volatility: 'high',
        direction: 'down',
        drivers: [
          { factor: 'ETF Outflows', impact: 'bearish', weight: 35, explanation: 'Institutional profit-taking after Q4 rally' },
          { factor: 'Regulatory News', impact: 'mixed', weight: 25, explanation: 'SEC considering new spot ETF rules' },
          { factor: 'Whale Activity', impact: 'bearish', weight: 20, explanation: 'Large wallets moving BTC to exchanges' },
          { factor: 'Macro Correlation', impact: 'bearish', weight: 20, explanation: 'Risk-off sentiment in equity markets' },
        ],
        catalysts: [
          { date: '2026-01-30', event: 'Grayscale ETF', outcome: '$340M outflows this week' },
          { date: '2026-01-25', event: 'Whale Alert', outcome: '10,000 BTC moved to Coinbase' },
        ],
        technicals: { support: 95000, resistance: 110000, rsi: 45, trend: 'consolidating' },
        outlook: 'Short-term pullback likely. Long-term thesis intact with halving supply dynamics.',
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        price: 3285,
        change: 125,
        changePercent: 3.95,
        volume: '18B',
        volatility: 'high',
        direction: 'up',
        drivers: [
          { factor: 'ETF Approval Speculation', impact: 'bullish', weight: 40, explanation: 'Market expects ETH spot ETF approval Q1 2026' },
          { factor: 'DeFi Renaissance', impact: 'bullish', weight: 25, explanation: 'TVL recovering, new protocol launches' },
          { factor: 'L2 Adoption', impact: 'bullish', weight: 20, explanation: 'Arbitrum, Base seeing record transaction volumes' },
          { factor: 'Staking Yield', impact: 'bullish', weight: 15, explanation: 'Attractive 4.2% staking rewards' },
        ],
        catalysts: [
          { date: '2026-01-31', event: 'ETF Decision', outcome: 'Expected SEC ruling' },
          { date: '2026-01-22', event: 'Dencun Upgrade', outcome: 'Successful blob transactions' },
        ],
        technicals: { support: 3000, resistance: 3600, rsi: 58, trend: 'bullish' },
        outlook: 'ETH poised for breakout if ETF approved. Strong fundamental case.',
      },
      {
        symbol: 'SOL',
        name: 'Solana',
        price: 198.50,
        change: 22.30,
        changePercent: 12.65,
        volume: '8.5B',
        volatility: 'extreme',
        direction: 'up',
        drivers: [
          { factor: 'Memecoin Activity', impact: 'bullish', weight: 35, explanation: 'Pump.fun driving massive fee revenue' },
          { factor: 'Firedancer Anticipation', impact: 'bullish', weight: 25, explanation: 'New validator client promises 10x throughput' },
          { factor: 'ETF Filings', impact: 'bullish', weight: 25, explanation: 'VanEck, 21Shares filed for SOL ETFs' },
          { factor: 'Developer Activity', impact: 'bullish', weight: 15, explanation: 'GitHub commits at all-time high' },
        ],
        catalysts: [
          { date: '2026-01-29', event: 'Firedancer Update', outcome: 'Testnet launch successful' },
          { date: '2026-01-27', event: 'Pump.fun Volume', outcome: '$500M daily volume' },
        ],
        technicals: { support: 170, resistance: 220, rsi: 78, trend: 'overbought' },
        outlook: 'Momentum strong but RSI suggests caution. Long-term infrastructure play.',
      },
    ],

    // Commodities
    commodities: [
      {
        symbol: 'CL',
        name: 'Crude Oil (WTI)',
        price: 78.45,
        change: -1.20,
        changePercent: -1.51,
        volume: '350K contracts',
        volatility: 'moderate',
        direction: 'down',
        drivers: [
          { factor: 'OPEC+ Production', impact: 'bearish', weight: 30, explanation: 'UAE signaling intent to increase output' },
          { factor: 'China Demand', impact: 'bearish', weight: 25, explanation: 'Economic data shows slowing growth' },
          { factor: 'US Inventory', impact: 'bearish', weight: 25, explanation: 'EIA reports build of 4.2M barrels' },
          { factor: 'Geopolitical Risk', impact: 'bullish', weight: 20, explanation: 'Red Sea shipping disruptions continue' },
        ],
        catalysts: [
          { date: '2026-01-30', event: 'EIA Report', outcome: 'Unexpected inventory build' },
          { date: '2026-01-28', event: 'OPEC Meeting', outcome: 'No change to quotas, but UAE tension' },
        ],
        technicals: { support: 72, resistance: 82, rsi: 42, trend: 'bearish' },
        outlook: 'Oil facing demand headwinds. Supply overhang limits upside.',
      },
      {
        symbol: 'NG',
        name: 'Natural Gas',
        price: 3.25,
        change: 0.45,
        changePercent: 16.07,
        volume: '180K contracts',
        volatility: 'extreme',
        direction: 'up',
        drivers: [
          { factor: 'Weather', impact: 'bullish', weight: 45, explanation: 'Arctic blast hitting Eastern US, heating demand surge' },
          { factor: 'LNG Exports', impact: 'bullish', weight: 25, explanation: 'Record exports to Europe and Asia' },
          { factor: 'Storage Draw', impact: 'bullish', weight: 20, explanation: 'Weekly draw 2x expectations' },
          { factor: 'Production Cuts', impact: 'bullish', weight: 10, explanation: 'Some producers shutting wells at low prices' },
        ],
        catalysts: [
          { date: '2026-01-30', event: 'Weather Forecast', outcome: 'Extended cold through mid-February' },
          { date: '2026-01-29', event: 'Storage Report', outcome: '-258 Bcf vs -180 expected' },
        ],
        technicals: { support: 2.80, resistance: 3.50, rsi: 75, trend: 'bullish' },
        outlook: 'Weather-driven spike. Fade once cold passes, but LNG supports floor.',
      },
    ],

    // Major Stock Movers
    stocks: [
      {
        symbol: 'NVDA',
        name: 'NVIDIA',
        price: 142.80,
        change: -8.50,
        changePercent: -5.62,
        volume: '85M',
        volatility: 'high',
        direction: 'down',
        drivers: [
          { factor: 'DeepSeek News', impact: 'bearish', weight: 40, explanation: 'Chinese AI model trained cheaply raises efficiency questions' },
          { factor: 'Valuation Concerns', impact: 'bearish', weight: 25, explanation: '35x forward PE considered rich by some' },
          { factor: 'Export Restrictions', impact: 'bearish', weight: 20, explanation: 'New China chip export rules announced' },
          { factor: 'Data Center Demand', impact: 'bullish', weight: 15, explanation: 'Hyperscalers still ordering aggressively' },
        ],
        catalysts: [
          { date: '2026-01-27', event: 'DeepSeek Launch', outcome: 'R1 model matches GPT-4 at fraction of cost' },
          { date: '2026-01-25', event: 'Export Rules', outcome: 'Biden admin tightens chip restrictions' },
        ],
        technicals: { support: 130, resistance: 155, rsi: 35, trend: 'oversold' },
        outlook: 'Short-term overhang from DeepSeek narrative. Long-term AI demand intact.',
      },
      {
        symbol: 'TSLA',
        name: 'Tesla',
        price: 398.50,
        change: 15.20,
        changePercent: 3.97,
        volume: '125M',
        volatility: 'high',
        direction: 'up',
        drivers: [
          { factor: 'Robotaxi Hype', impact: 'bullish', weight: 35, explanation: 'Austin robotaxi launch imminent' },
          { factor: 'Optimus Progress', impact: 'bullish', weight: 25, explanation: 'Factory robot deployment videos' },
          { factor: 'Energy Business', impact: 'bullish', weight: 20, explanation: 'Megapack orders at record levels' },
          { factor: 'EV Competition', impact: 'bearish', weight: 20, explanation: 'BYD, Rivian gaining market share' },
        ],
        catalysts: [
          { date: '2026-01-29', event: 'Robotaxi Update', outcome: 'Musk confirms Austin launch timeline' },
          { date: '2026-01-20', event: 'Q4 Deliveries', outcome: 'Beat estimates, margins improved' },
        ],
        technicals: { support: 350, resistance: 420, rsi: 62, trend: 'bullish' },
        outlook: 'Speculation-driven rally. Fundamentals need to catch up to valuation.',
      },
    ],
  };

  // Analysis insights for the current market
  const marketAnalysis = {
    overallSentiment: 'cautious',
    volatilityIndex: 22.5, // VIX
    fearGreedIndex: 42, // 0-100, currently fear
    summary: 'Markets digesting AI efficiency narrative (DeepSeek) while precious metals rally on safe-haven demand. Crypto consolidating after strong Q4.',
    keyThemes: [
      { theme: 'AI Efficiency Revolution', description: 'DeepSeek challenging NVIDIA dominance narrative, raising questions about training costs', impact: 'mixed' },
      { theme: 'Rate Cut Expectations', description: 'Fed signaling cuts possible in H2 2026, supporting gold and risk assets', impact: 'bullish' },
      { theme: 'China Uncertainty', description: 'Economic data mixed, stimulus measures underwhelming', impact: 'bearish' },
      { theme: 'Energy Transition', description: 'Record solar installations driving silver demand', impact: 'sector-specific' },
    ],
    contraianOpportunities: [
      { symbol: 'NVDA', thesis: 'DeepSeek panic overdone - inference demand still requires compute', risk: 'medium' },
      { symbol: 'XOM', thesis: 'Energy oversold despite strong FCF generation', risk: 'low' },
      { symbol: 'BABA', thesis: 'China tech at historic lows, stimulus coming', risk: 'high' },
    ],
    boringCompounders: [
      { symbol: 'COST', name: 'Costco', thesis: 'Membership model provides predictable revenue, inflation-resistant', moat: 'strong' },
      { symbol: 'WM', name: 'Waste Management', thesis: 'Essential service, pricing power, dividend growth', moat: 'strong' },
      { symbol: 'BRK.B', name: 'Berkshire Hathaway', thesis: 'Diversified, $150B+ cash pile, Buffett succession handled', moat: 'legendary' },
      { symbol: 'JNJ', name: 'Johnson & Johnson', thesis: 'Healthcare staple, dividend aristocrat, talc overhang resolved', moat: 'strong' },
    ],
    momentumPlays: [
      { symbol: 'PLTR', name: 'Palantir', thesis: 'Government AI contracts expanding rapidly', risk: 'high', momentum: 'strong' },
      { symbol: 'COIN', name: 'Coinbase', thesis: 'Crypto rally beneficiary, institutional adoption', risk: 'high', momentum: 'strong' },
      { symbol: 'APP', name: 'AppLovin', thesis: 'Mobile gaming advertising dominance', risk: 'medium', momentum: 'strong' },
    ],
  };

  // Filter by category if specified
  let response = { analysis: marketAnalysis };

  if (category === 'all') {
    response.movers = marketMovers;
  } else if (marketMovers[category]) {
    response.movers = { [category]: marketMovers[category] };
  }

  // Filter by specific symbol
  if (symbol) {
    for (const [cat, items] of Object.entries(marketMovers)) {
      const found = items.find(m => m.symbol.toUpperCase() === symbol.toUpperCase());
      if (found) {
        response.movers = { [cat]: [found] };
        break;
      }
    }
  }

  return Response.json(response);
}
