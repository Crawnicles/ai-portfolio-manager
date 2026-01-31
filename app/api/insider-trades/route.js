// Phase 21: Politician & Insider Trading Tracker API
// Track congressional trades, corporate insiders, and notable investors

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'all'; // politicians, insiders, notable
  const symbol = searchParams.get('symbol');
  const person = searchParams.get('person');

  // Congressional Trading Data (STOCK Act filings)
  const politicianTrades = [
    {
      id: 1,
      name: 'Nancy Pelosi',
      party: 'D',
      chamber: 'House',
      state: 'CA',
      recentTrades: [
        { date: '2026-01-15', symbol: 'NVDA', action: 'buy', amount: '$1M-$5M', shares: '~3,500', price: '~143', disclosure: '01/28/2026', daysToDisclose: 13 },
        { date: '2026-01-10', symbol: 'GOOGL', action: 'call_options', amount: '$500K-$1M', expiry: '2026-06-20', strike: 190, disclosure: '01/25/2026', daysToDisclose: 15 },
        { date: '2025-12-20', symbol: 'AAPL', action: 'sell', amount: '$250K-$500K', shares: '~1,800', price: '~248', disclosure: '01/02/2026', daysToDisclose: 13 },
      ],
      ytdReturn: 42.3,
      tradingStyle: 'Growth & Options',
      notablePattern: 'Heavy tech focus, uses deep ITM calls',
      watchScore: 95, // How closely followed by retail
    },
    {
      id: 2,
      name: 'Dan Crenshaw',
      party: 'R',
      chamber: 'House',
      state: 'TX',
      recentTrades: [
        { date: '2026-01-20', symbol: 'XOM', action: 'buy', amount: '$100K-$250K', shares: '~2,200', price: '~110', disclosure: '01/30/2026', daysToDisclose: 10 },
        { date: '2026-01-18', symbol: 'CVX', action: 'buy', amount: '$50K-$100K', shares: '~550', price: '~158', disclosure: '01/30/2026', daysToDisclose: 12 },
      ],
      ytdReturn: 18.5,
      tradingStyle: 'Energy Value',
      notablePattern: 'Energy sector concentration, committee relevance',
      watchScore: 72,
    },
    {
      id: 3,
      name: 'Tommy Tuberville',
      party: 'R',
      chamber: 'Senate',
      state: 'AL',
      recentTrades: [
        { date: '2026-01-22', symbol: 'RTX', action: 'buy', amount: '$50K-$100K', shares: '~800', price: '~118', disclosure: '01/30/2026', daysToDisclose: 8 },
        { date: '2026-01-19', symbol: 'LMT', action: 'buy', amount: '$100K-$250K', shares: '~450', price: '~485', disclosure: '01/28/2026', daysToDisclose: 9 },
        { date: '2026-01-12', symbol: 'GD', action: 'buy', amount: '$15K-$50K', shares: '~150', price: '~295', disclosure: '01/25/2026', daysToDisclose: 13 },
      ],
      ytdReturn: 28.7,
      tradingStyle: 'Defense Heavy',
      notablePattern: 'Armed Services Committee member, defense trades',
      watchScore: 88,
    },
    {
      id: 4,
      name: 'Josh Gottheimer',
      party: 'D',
      chamber: 'House',
      state: 'NJ',
      recentTrades: [
        { date: '2026-01-25', symbol: 'MSFT', action: 'buy', amount: '$250K-$500K', shares: '~1,100', price: '~435', disclosure: '01/31/2026', daysToDisclose: 6 },
        { date: '2026-01-15', symbol: 'META', action: 'buy', amount: '$100K-$250K', shares: '~350', price: '~615', disclosure: '01/28/2026', daysToDisclose: 13 },
      ],
      ytdReturn: 35.2,
      tradingStyle: 'Big Tech',
      notablePattern: 'Tech-heavy portfolio, quick disclosure',
      watchScore: 65,
    },
    {
      id: 5,
      name: 'Marjorie Taylor Greene',
      party: 'R',
      chamber: 'House',
      state: 'GA',
      recentTrades: [
        { date: '2026-01-24', symbol: 'TSLA', action: 'buy', amount: '$50K-$100K', shares: '~250', price: '~390', disclosure: '01/30/2026', daysToDisclose: 6 },
        { date: '2026-01-10', symbol: 'DJT', action: 'buy', amount: '$15K-$50K', shares: '~1,500', price: '~32', disclosure: '01/22/2026', daysToDisclose: 12 },
      ],
      ytdReturn: 22.1,
      tradingStyle: 'Momentum/Political',
      notablePattern: 'Politically-aligned investments',
      watchScore: 70,
    },
  ];

  // Corporate Insider Trades (SEC Form 4)
  const corporateInsiders = [
    {
      company: 'Apple Inc.',
      symbol: 'AAPL',
      recentFilings: [
        { date: '2026-01-28', insider: 'Tim Cook', title: 'CEO', action: 'sell', shares: 100000, price: 248.50, value: 24850000, purpose: '10b5-1 Plan' },
        { date: '2026-01-25', insider: 'Luca Maestri', title: 'CFO', action: 'sell', shares: 25000, price: 246.20, value: 6155000, purpose: '10b5-1 Plan' },
        { date: '2026-01-15', insider: 'Jeff Williams', title: 'COO', action: 'exercise', shares: 50000, price: 175.00, value: 8750000, purpose: 'Option Exercise' },
      ],
      insiderSentiment: 'selling',
      openMarketBuys: 0,
      openMarketSells: 3,
      netActivity: -$35755000,
    },
    {
      company: 'NVIDIA',
      symbol: 'NVDA',
      recentFilings: [
        { date: '2026-01-27', insider: 'Jensen Huang', title: 'CEO', action: 'sell', shares: 240000, price: 142.80, value: 34272000, purpose: '10b5-1 Plan' },
        { date: '2026-01-20', insider: 'Colette Kress', title: 'CFO', action: 'sell', shares: 30000, price: 148.50, value: 4455000, purpose: '10b5-1 Plan' },
      ],
      insiderSentiment: 'selling',
      openMarketBuys: 0,
      openMarketSells: 2,
      netActivity: -38727000,
    },
    {
      company: 'JPMorgan Chase',
      symbol: 'JPM',
      recentFilings: [
        { date: '2026-01-26', insider: 'Jamie Dimon', title: 'CEO', action: 'sell', shares: 150000, price: 252.40, value: 37860000, purpose: 'Personal Financial Planning' },
        { date: '2026-01-22', insider: 'Mary Erdoes', title: 'CEO AWM', action: 'buy', shares: 5000, price: 248.80, value: 1244000, purpose: 'Open Market' },
      ],
      insiderSentiment: 'mixed',
      openMarketBuys: 1,
      openMarketSells: 1,
      netActivity: -36616000,
    },
    {
      company: 'Berkshire Hathaway',
      symbol: 'BRK.B',
      recentFilings: [
        { date: '2026-01-20', insider: 'Warren Buffett', title: 'CEO', action: 'gift', shares: 1600000, value: 736000000, purpose: 'Charitable Gift' },
      ],
      insiderSentiment: 'neutral',
      openMarketBuys: 0,
      openMarketSells: 0,
      netActivity: 0,
      note: 'Annual charitable giving, not indicative of company view',
    },
    {
      company: 'Tesla',
      symbol: 'TSLA',
      recentFilings: [
        { date: '2026-01-28', insider: 'Elon Musk', title: 'CEO', action: 'none', shares: 0, value: 0, purpose: 'N/A' },
      ],
      insiderSentiment: 'holding',
      openMarketBuys: 0,
      openMarketSells: 0,
      netActivity: 0,
      note: 'No sales since 2022, pledged ~50% as loan collateral',
    },
  ];

  // Notable Investor 13F Holdings & Trades
  const notableInvestors = [
    {
      name: 'Michael Burry',
      firm: 'Scion Asset Management',
      aum: '$285M',
      style: 'Deep Value / Contrarian',
      q4_2025_changes: [
        { symbol: 'BABA', action: 'NEW', shares: 125000, value: 10625000, portfolioPct: 3.7, thesis: 'China tech deep value play' },
        { symbol: 'JD', action: 'NEW', shares: 200000, value: 6800000, portfolioPct: 2.4, thesis: 'China e-commerce undervalued' },
        { symbol: 'GOOG', action: 'ADDED', shares: 50000, value: 9450000, portfolioPct: 3.3, change: '+25%', thesis: 'AI undervalued vs MSFT' },
        { symbol: 'GEO', action: 'ADDED', shares: 500000, value: 8750000, portfolioPct: 3.1, change: '+40%', thesis: 'Private prison demand' },
        { symbol: 'HCA', action: 'SOLD', shares: -75000, value: -21000000, portfolioPct: 0, change: '-100%', thesis: 'Took profits' },
      ],
      topHoldings: [
        { symbol: 'SIRI', name: 'Sirius XM', shares: 2500000, value: 62500000, portfolioPct: 21.9 },
        { symbol: 'BIDU', name: 'Baidu', shares: 250000, value: 22500000, portfolioPct: 7.9 },
        { symbol: 'BABA', name: 'Alibaba', shares: 125000, value: 10625000, portfolioPct: 3.7 },
        { symbol: 'GOOG', name: 'Alphabet', shares: 50000, value: 9450000, portfolioPct: 3.3 },
        { symbol: 'GEO', name: 'GEO Group', shares: 500000, value: 8750000, portfolioPct: 3.1 },
      ],
      recentCommentary: 'Still positioned for China recovery. Tech valuations reasonable outside Mag 7.',
      bearishBets: ['Consumer discretionary', 'Regional banks'],
    },
    {
      name: 'Bill Ackman',
      firm: 'Pershing Square',
      aum: '$18.5B',
      style: 'Activist / Concentrated',
      q4_2025_changes: [
        { symbol: 'GOOGL', action: 'NEW', shares: 8500000, value: 1615000000, portfolioPct: 8.7, thesis: 'AI and YouTube undervalued' },
        { symbol: 'CMG', action: 'ADDED', shares: 500000, value: 275000000, portfolioPct: 1.5, change: '+10%', thesis: 'Continued compounder' },
        { symbol: 'NFLX', action: 'SOLD', shares: -2000000, value: -1600000000, portfolioPct: 0, change: '-100%', thesis: 'Valuation stretched' },
      ],
      topHoldings: [
        { symbol: 'HLT', name: 'Hilton', shares: 10000000, value: 2350000000, portfolioPct: 12.7 },
        { symbol: 'CMG', name: 'Chipotle', shares: 5000000, value: 2750000000, portfolioPct: 14.9 },
        { symbol: 'GOOGL', name: 'Alphabet', shares: 8500000, value: 1615000000, portfolioPct: 8.7 },
        { symbol: 'LOW', name: 'Lowes', shares: 6000000, value: 1560000000, portfolioPct: 8.4 },
        { symbol: 'QSR', name: 'Restaurant Brands', shares: 15000000, value: 1050000000, portfolioPct: 5.7 },
      ],
      recentCommentary: 'Google is the cheapest Magnificent 7 stock. YouTube alone worth more than current cap.',
    },
    {
      name: 'David Tepper',
      firm: 'Appaloosa Management',
      aum: '$6.8B',
      style: 'Macro / Distressed',
      q4_2025_changes: [
        { symbol: 'BABA', action: 'ADDED', shares: 2000000, value: 170000000, portfolioPct: 2.5, change: '+30%', thesis: 'China stimulus coming' },
        { symbol: 'META', action: 'ADDED', shares: 500000, value: 307500000, portfolioPct: 4.5, change: '+20%', thesis: 'AI monetization' },
        { symbol: 'NVDA', action: 'TRIMMED', shares: -300000, value: -42840000, portfolioPct: 3.2, change: '-15%', thesis: 'Profit taking' },
      ],
      topHoldings: [
        { symbol: 'AMZN', name: 'Amazon', shares: 3000000, value: 693000000, portfolioPct: 10.2 },
        { symbol: 'META', name: 'Meta', shares: 1000000, value: 615000000, portfolioPct: 9.0 },
        { symbol: 'MSFT', name: 'Microsoft', shares: 1200000, value: 522000000, portfolioPct: 7.7 },
        { symbol: 'GOOGL', name: 'Alphabet', shares: 2000000, value: 380000000, portfolioPct: 5.6 },
      ],
      recentCommentary: 'The market is reasonably valued. China is the opportunity.',
    },
    {
      name: 'Cathie Wood',
      firm: 'ARK Invest',
      aum: '$14.2B',
      style: 'Disruptive Innovation',
      q4_2025_changes: [
        { symbol: 'TSLA', action: 'ADDED', shares: 800000, value: 319200000, portfolioPct: 2.2, change: '+15%', thesis: 'Robotaxi + Optimus' },
        { symbol: 'COIN', action: 'ADDED', shares: 1500000, value: 375000000, portfolioPct: 2.6, change: '+25%', thesis: 'Crypto adoption' },
        { symbol: 'ROKU', action: 'TRIMMED', shares: -500000, value: -40000000, portfolioPct: 1.8, change: '-10%', thesis: 'Rebalancing' },
      ],
      topHoldings: [
        { symbol: 'TSLA', name: 'Tesla', shares: 6000000, value: 2394000000, portfolioPct: 16.9 },
        { symbol: 'COIN', name: 'Coinbase', shares: 7500000, value: 1875000000, portfolioPct: 13.2 },
        { symbol: 'ROKU', name: 'Roku', shares: 10000000, value: 800000000, portfolioPct: 5.6 },
        { symbol: 'SQ', name: 'Block', shares: 8000000, value: 640000000, portfolioPct: 4.5 },
      ],
      recentCommentary: 'We are in the early innings of AI. Tesla is an AI company, not a car company.',
    },
  ];

  // Trading Signal Aggregation
  const signalAggregation = {
    mostBoughtByPoliticians: [
      { symbol: 'NVDA', buyers: 12, sellers: 3, netAmount: '+$15M', signal: 'bullish' },
      { symbol: 'MSFT', buyers: 8, sellers: 2, netAmount: '+$8M', signal: 'bullish' },
      { symbol: 'RTX', buyers: 6, sellers: 0, netAmount: '+$4M', signal: 'bullish' },
    ],
    mostSoldByPoliticians: [
      { symbol: 'AAPL', buyers: 2, sellers: 7, netAmount: '-$5M', signal: 'bearish' },
      { symbol: 'AMZN', buyers: 1, sellers: 5, netAmount: '-$3M', signal: 'bearish' },
    ],
    consensusBuys: [
      { symbol: 'GOOGL', politicianBuys: 5, insiderBuys: 2, notableBuys: 3, consensus: 'strong buy' },
      { symbol: 'BABA', politicianBuys: 0, insiderBuys: 0, notableBuys: 3, consensus: 'notable buy' },
    ],
    unusualActivity: [
      { symbol: 'RTX', pattern: 'Cluster buying by Armed Services members', suspicionScore: 85 },
      { symbol: 'NVDA', pattern: 'Pelosi call options before AI announcement', suspicionScore: 72 },
    ],
  };

  // Build response based on type
  let response = {
    updated: new Date().toISOString(),
    signals: signalAggregation,
  };

  if (type === 'all' || type === 'politicians') {
    response.politicians = politicianTrades;
  }
  if (type === 'all' || type === 'insiders') {
    response.insiders = corporateInsiders;
  }
  if (type === 'all' || type === 'notable') {
    response.notableInvestors = notableInvestors;
  }

  // Filter by symbol
  if (symbol) {
    const upperSymbol = symbol.toUpperCase();
    if (response.politicians) {
      response.politicians = politicianTrades.filter(p =>
        p.recentTrades.some(t => t.symbol === upperSymbol)
      ).map(p => ({
        ...p,
        recentTrades: p.recentTrades.filter(t => t.symbol === upperSymbol)
      }));
    }
    if (response.insiders) {
      response.insiders = corporateInsiders.filter(i => i.symbol === upperSymbol);
    }
    if (response.notableInvestors) {
      response.notableInvestors = notableInvestors.filter(n =>
        n.topHoldings.some(h => h.symbol === upperSymbol) ||
        n.q4_2025_changes.some(c => c.symbol === upperSymbol)
      );
    }
  }

  // Filter by person name
  if (person) {
    const lowerPerson = person.toLowerCase();
    if (response.politicians) {
      response.politicians = politicianTrades.filter(p =>
        p.name.toLowerCase().includes(lowerPerson)
      );
    }
    if (response.notableInvestors) {
      response.notableInvestors = notableInvestors.filter(n =>
        n.name.toLowerCase().includes(lowerPerson)
      );
    }
  }

  return Response.json(response);
}
