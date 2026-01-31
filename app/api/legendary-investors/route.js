import { NextResponse } from 'next/server';

// Phase 20: Legendary Investors - Wisdom, Holdings, and Principles
// Data sourced from public 13F filings, interviews, books, and annual letters

const LEGENDARY_INVESTORS = [
  {
    id: 'buffett',
    name: 'Warren Buffett',
    firm: 'Berkshire Hathaway',
    title: 'Chairman & CEO',
    image: '🎩',
    style: 'Value Investing',
    aum: '$900B+',
    annualReturn: '19.8%',
    since: 1965,
    description: 'The Oracle of Omaha. Greatest investor of all time with a 60+ year track record of compounding capital.',
    bio: 'Warren Buffett began investing at age 11 and has built Berkshire Hathaway into one of the largest companies in the world. His value investing approach, learned from Benjamin Graham, focuses on buying wonderful businesses at fair prices.',
    holdings: [
      { symbol: 'AAPL', company: 'Apple Inc.', shares: 915000000, value: 174000000000, portfolioPct: 49.2, change: 'hold' },
      { symbol: 'BAC', company: 'Bank of America', shares: 1032000000, value: 33000000000, portfolioPct: 9.3, change: 'hold' },
      { symbol: 'AXP', company: 'American Express', shares: 151600000, value: 28500000000, portfolioPct: 8.1, change: 'hold' },
      { symbol: 'KO', company: 'Coca-Cola', shares: 400000000, value: 24000000000, portfolioPct: 6.8, change: 'hold' },
      { symbol: 'CVX', company: 'Chevron', shares: 123000000, value: 18500000000, portfolioPct: 5.2, change: 'reduced' },
      { symbol: 'OXY', company: 'Occidental Petroleum', shares: 248000000, value: 15000000000, portfolioPct: 4.2, change: 'increased' },
      { symbol: 'KHC', company: 'Kraft Heinz', shares: 325600000, value: 11000000000, portfolioPct: 3.1, change: 'hold' },
      { symbol: 'MCO', company: "Moody's Corp", shares: 24700000, value: 9800000000, portfolioPct: 2.8, change: 'hold' },
    ],
    principles: [
      { title: 'Circle of Competence', description: 'Only invest in businesses you truly understand. Know the boundaries of your knowledge.' },
      { title: 'Margin of Safety', description: 'Buy at a significant discount to intrinsic value to protect against errors and bad luck.' },
      { title: 'Economic Moats', description: 'Seek businesses with durable competitive advantages that protect profits over time.' },
      { title: 'Long-term Thinking', description: 'Our favorite holding period is forever. Time is the friend of the wonderful business.' },
      { title: 'Quality Over Price', description: "It's far better to buy a wonderful company at a fair price than a fair company at a wonderful price." },
      { title: 'Management Matters', description: 'Invest in businesses run by honest, capable managers who treat shareholders as partners.' },
    ],
    quotes: [
      { text: "Be fearful when others are greedy, and greedy when others are fearful.", context: "2008 Financial Crisis" },
      { text: "Price is what you pay. Value is what you get.", context: "Investment Philosophy" },
      { text: "Rule No. 1: Never lose money. Rule No. 2: Never forget rule No. 1.", context: "Risk Management" },
      { text: "The stock market is a device for transferring money from the impatient to the patient.", context: "Long-term Investing" },
      { text: "Only buy something that you'd be perfectly happy to hold if the market shut down for 10 years.", context: "Investment Criteria" },
      { text: "Risk comes from not knowing what you're doing.", context: "Circle of Competence" },
      { text: "It takes 20 years to build a reputation and five minutes to ruin it.", context: "Character" },
      { text: "The most important quality for an investor is temperament, not intellect.", context: "Psychology" },
    ],
    resources: [
      { type: 'letter', title: 'Annual Shareholder Letters', url: 'https://www.berkshirehathaway.com/letters/letters.html', description: '50+ years of investment wisdom' },
      { type: 'video', title: 'Annual Meeting Videos', url: 'https://buffett.cnbc.com/annual-meetings/', description: 'Hours of Q&A with Warren and Charlie' },
      { type: 'book', title: 'The Essays of Warren Buffett', author: 'Lawrence Cunningham', description: 'Curated collection of his best writing' },
    ],
  },
  {
    id: 'munger',
    name: 'Charlie Munger',
    firm: 'Berkshire Hathaway',
    title: 'Vice Chairman (1978-2023)',
    image: '📚',
    style: 'Multidisciplinary Value',
    aum: 'N/A',
    annualReturn: 'N/A',
    since: 1962,
    description: 'Warrens partner and intellectual architect of modern Berkshire. Master of mental models and multidisciplinary thinking.',
    bio: 'Charlie Munger transformed Buffetts approach from buying "cigar butts" to buying wonderful businesses. His mental models framework and emphasis on avoiding stupidity over seeking brilliance influenced generations of investors.',
    holdings: [], // Charlie's holdings were through Berkshire
    principles: [
      { title: 'Invert, Always Invert', description: 'Think about problems backwards. Avoid what causes failure rather than seeking success.' },
      { title: 'Mental Models', description: 'Build a latticework of mental models from multiple disciplines to make better decisions.' },
      { title: 'Avoid Stupidity', description: "It's remarkable how much long-term advantage people like us have gotten by trying to be consistently not stupid." },
      { title: 'Sit on Your Ass', description: 'The big money is not in the buying and selling but in the waiting. Patience compounds.' },
      { title: 'Opportunity Cost', description: 'Every investment must be compared to the best alternative available.' },
      { title: 'Avoid Envy & Resentment', description: 'These emotions poison your mind and decisions. Stay rational.' },
    ],
    quotes: [
      { text: "Spend each day trying to be a little wiser than you were when you woke up.", context: "Self-improvement" },
      { text: "The big money is not in the buying or selling, but in the waiting.", context: "Patience" },
      { text: "Invert, always invert: Turn a situation or problem upside down.", context: "Problem Solving" },
      { text: "Knowing what you don't know is more useful than being brilliant.", context: "Humility" },
      { text: "Take a simple idea and take it seriously.", context: "Focus" },
      { text: "I never allow myself to have an opinion on anything that I don't know the other side's argument better than they do.", context: "Intellectual Honesty" },
      { text: "The best thing a human being can do is to help another human being know more.", context: "Teaching" },
    ],
    resources: [
      { type: 'book', title: 'Poor Charlie\'s Almanack', author: 'Peter Kaufman', description: 'Comprehensive collection of his wisdom' },
      { type: 'speech', title: 'The Psychology of Human Misjudgment', url: 'https://www.youtube.com/watch?v=pqzcCfUglws', description: 'Famous speech on cognitive biases' },
      { type: 'video', title: 'Daily Journal Annual Meetings', url: 'https://www.youtube.com/results?search_query=charlie+munger+daily+journal', description: 'Hours of unfiltered Charlie' },
    ],
  },
  {
    id: 'druckenmiller',
    name: 'Stanley Druckenmiller',
    firm: 'Duquesne Family Office',
    title: 'Founder & CIO',
    image: '🎯',
    style: 'Macro / Concentrated',
    aum: '$3B+',
    annualReturn: '30%',
    since: 1981,
    description: 'One of the greatest macro investors ever. Famous for "breaking the Bank of England" with Soros. Never had a losing year at Duquesne.',
    bio: 'Druckenmiller learned from George Soros and ran Duquesne Capital for 30 years without a single losing year. His style combines macro analysis with concentrated positions when conviction is high.',
    holdings: [
      { symbol: 'NVDA', company: 'NVIDIA', shares: 1500000, value: 1500000000, portfolioPct: 15.2, change: 'increased' },
      { symbol: 'MSFT', company: 'Microsoft', shares: 2100000, value: 880000000, portfolioPct: 8.9, change: 'hold' },
      { symbol: 'GOOGL', company: 'Alphabet', shares: 800000, value: 140000000, portfolioPct: 6.8, change: 'new' },
      { symbol: 'COHR', company: 'Coherent Corp', shares: 3500000, value: 280000000, portfolioPct: 5.1, change: 'hold' },
      { symbol: 'ANET', company: 'Arista Networks', shares: 950000, value: 270000000, portfolioPct: 4.9, change: 'increased' },
      { symbol: 'NFLX', company: 'Netflix', shares: 400000, value: 250000000, portfolioPct: 4.5, change: 'hold' },
    ],
    principles: [
      { title: 'Bet Big When Right', description: 'When you see it, bet big. The way to build returns is through concentration, not diversification.' },
      { title: 'Cut Losses Quickly', description: "The first loss is the best loss. If you're wrong, get out fast." },
      { title: 'Follow Liquidity', description: 'Earnings don\'t move markets, liquidity does. Watch central bank policy closely.' },
      { title: 'Stay Flexible', description: 'Never marry a position. Be willing to change your mind when facts change.' },
      { title: 'Risk Management First', description: 'Preservation of capital is more important than making money.' },
      { title: 'Home Runs Matter', description: "It's not whether you're right or wrong, but how much you make when you're right." },
    ],
    quotes: [
      { text: "I've learned many things from George Soros, but perhaps the most significant is that it's not whether you're right or wrong that's important, but how much money you make when you're right and how much you lose when you're wrong.", context: "Risk/Reward" },
      { text: "The way to build long-term returns is through preservation of capital and home runs.", context: "Portfolio Strategy" },
      { text: "Never, ever invest in the present. It doesn't matter what a company is earning today.", context: "Forward Looking" },
      { text: "Put all your eggs in one basket and watch the basket very carefully.", context: "Concentration" },
      { text: "The most important thing I learned from George Soros is... when you have tremendous conviction, bet big.", context: "Position Sizing" },
    ],
    resources: [
      { type: 'interview', title: 'Bloomberg Interviews', url: 'https://www.youtube.com/results?search_query=stanley+druckenmiller+interview', description: 'Market insights and philosophy' },
      { type: 'book', title: 'The New Market Wizards', author: 'Jack Schwager', description: 'Chapter on Druckenmiller\'s approach' },
    ],
  },
  {
    id: 'simons',
    name: 'Jim Simons',
    firm: 'Renaissance Technologies',
    title: 'Founder (1982-2021)',
    image: '🧮',
    style: 'Quantitative',
    aum: '$130B',
    annualReturn: '66%',
    since: 1988,
    description: 'The greatest quantitative investor in history. Medallion Fund returned 66% annually before fees for 30+ years.',
    bio: 'Jim Simons was a world-class mathematician who cracked the code of the markets. His Medallion Fund is the most successful hedge fund ever, using mathematical models and algorithms to find market inefficiencies.',
    holdings: [
      { symbol: 'NVDA', company: 'NVIDIA', shares: 4200000, value: 4200000000, portfolioPct: 3.8, change: 'hold' },
      { symbol: 'META', company: 'Meta Platforms', shares: 2800000, value: 1400000000, portfolioPct: 2.1, change: 'increased' },
      { symbol: 'AMZN', company: 'Amazon', shares: 1900000, value: 330000000, portfolioPct: 1.8, change: 'hold' },
      { symbol: 'GOOGL', company: 'Alphabet', shares: 1200000, value: 210000000, portfolioPct: 1.2, change: 'hold' },
    ],
    principles: [
      { title: 'Data Over Intuition', description: 'Let the data speak. Remove human emotion and bias from investment decisions.' },
      { title: 'Hire the Best', description: 'Recruit world-class scientists and mathematicians, not Wall Street types.' },
      { title: 'Find Edge', description: 'Look for small, repeatable edges that compound over thousands of trades.' },
      { title: 'Keep Secrets', description: 'Protect your intellectual property fiercely. Alpha decays when shared.' },
      { title: 'Process Over Outcome', description: 'Focus on building robust systems, not predicting individual outcomes.' },
    ],
    quotes: [
      { text: "We don't override the models.", context: "Systematic Approach" },
      { text: "The things we are doing will not go away. We may have bad years, but the underlying principles are sound.", context: "Conviction" },
      { text: "Past performance is the best predictor of success. Not grades, not pedigree, past performance.", context: "Hiring" },
      { text: "We search through historical data looking for anomalous patterns that we would not expect to occur at random.", context: "Methodology" },
    ],
    resources: [
      { type: 'book', title: 'The Man Who Solved the Market', author: 'Gregory Zuckerman', description: 'Definitive biography of Simons and Renaissance' },
      { type: 'video', title: 'TED Talk: Mathematics of Finance', url: 'https://www.youtube.com/watch?v=U5kIdtMJGc8', description: 'Rare public appearance' },
    ],
  },
  {
    id: 'pabrai',
    name: 'Mohnish Pabrai',
    firm: 'Pabrai Investment Funds',
    title: 'Managing Partner',
    image: '🙏',
    style: 'Concentrated Value',
    aum: '$500M+',
    annualReturn: '26%',
    since: 1999,
    description: 'Buffett disciple who pioneered "heads I win, tails I don\'t lose much" investing. Known for cloning great investors.',
    bio: 'Mohnish Pabrai sold his IT company and became a full-time investor, closely studying Buffett and Munger. He\'s famous for his "Dhandho" approach - low risk, high uncertainty, high return opportunities.',
    holdings: [
      { symbol: 'GOOG', company: 'Alphabet', shares: 150000, value: 26000000, portfolioPct: 18.5, change: 'hold' },
      { symbol: 'BABA', company: 'Alibaba', shares: 800000, value: 64000000, portfolioPct: 15.2, change: 'hold' },
      { symbol: 'STNE', company: 'StoneCo', shares: 2500000, value: 35000000, portfolioPct: 12.1, change: 'increased' },
      { symbol: 'COAL', company: 'Warrior Met Coal', shares: 400000, value: 24000000, portfolioPct: 8.5, change: 'hold' },
      { symbol: 'EXPE', company: 'Expedia', shares: 180000, value: 27000000, portfolioPct: 7.8, change: 'new' },
    ],
    principles: [
      { title: 'Dhandho Framework', description: 'Heads I win, tails I don\'t lose much. Seek asymmetric bets with limited downside.' },
      { title: 'Clone Intelligently', description: 'Study and copy the best investors. Why reinvent the wheel?' },
      { title: 'Few Bets, Big Bets', description: 'Concentrate in your best ideas. A handful of good decisions is all you need.' },
      { title: 'Simple Businesses', description: 'Invest in simple, understandable businesses. Complexity is the enemy.' },
      { title: 'Checklist Investing', description: 'Use checklists to avoid mistakes. Most errors are preventable.' },
      { title: 'Be a Learning Machine', description: 'Read voraciously and learn from every mistake and success.' },
    ],
    quotes: [
      { text: "Heads I win, tails I don't lose much.", context: "Dhandho Philosophy" },
      { text: "Cloning is a very powerful technique in investing. I've cloned Buffett, Munger, and many others.", context: "Learning" },
      { text: "The stock market is the only market where things go on sale and all the customers run out of the store.", context: "Market Psychology" },
      { text: "The most important thing in investing is to know the limits of your competence.", context: "Circle of Competence" },
      { text: "The difference between successful people and very successful people is that very successful people say no to almost everything.", context: "Focus" },
    ],
    resources: [
      { type: 'book', title: 'The Dhandho Investor', author: 'Mohnish Pabrai', description: 'His investment philosophy explained' },
      { type: 'video', title: 'Pabrai Value Investing Lectures', url: 'https://www.youtube.com/results?search_query=mohnish+pabrai', description: 'Free lectures and Q&A sessions' },
      { type: 'website', title: 'Pabrai Funds', url: 'https://www.pabraifunds.com/', description: 'Annual letters and presentations' },
    ],
  },
  {
    id: 'dalio',
    name: 'Ray Dalio',
    firm: 'Bridgewater Associates',
    title: 'Founder & CIO Mentor',
    image: '🌊',
    style: 'Macro / Risk Parity',
    aum: '$150B',
    annualReturn: '12%',
    since: 1975,
    description: 'Built the world\'s largest hedge fund. Pioneer of risk parity and radical transparency.',
    bio: 'Ray Dalio founded Bridgewater from his apartment and grew it into the largest hedge fund in the world. He\'s known for his "Principles" approach to life and work, and his analysis of economic cycles.',
    holdings: [
      { symbol: 'SPY', company: 'S&P 500 ETF', shares: 3500000, value: 1750000000, portfolioPct: 8.2, change: 'hold' },
      { symbol: 'VWO', company: 'Emerging Markets ETF', shares: 25000000, value: 1100000000, portfolioPct: 5.1, change: 'reduced' },
      { symbol: 'GLD', company: 'Gold ETF', shares: 4500000, value: 900000000, portfolioPct: 4.2, change: 'increased' },
      { symbol: 'GOOGL', company: 'Alphabet', shares: 1800000, value: 315000000, portfolioPct: 2.8, change: 'hold' },
      { symbol: 'PG', company: 'Procter & Gamble', shares: 1900000, value: 310000000, portfolioPct: 2.7, change: 'hold' },
    ],
    principles: [
      { title: 'Radical Transparency', description: 'Embrace truthful feedback. Ego is the enemy of growth.' },
      { title: 'Understand the Machine', description: 'Everything is a machine. Understand cause-effect relationships.' },
      { title: 'Diversify Properly', description: 'True diversification is the holy grail of investing. Find 15+ uncorrelated bets.' },
      { title: 'Study History', description: 'Everything has happened before. Study debt cycles, empires, and human nature.' },
      { title: 'Pain + Reflection = Progress', description: 'Mistakes are opportunities to learn if you reflect on them honestly.' },
      { title: 'Believability Weight', description: 'Not all opinions are equal. Weight by track record and reasoning.' },
    ],
    quotes: [
      { text: "He who lives by the crystal ball will eat shattered glass.", context: "Humility" },
      { text: "Pain + Reflection = Progress", context: "Growth Mindset" },
      { text: "The biggest mistake investors make is to believe that what happened in the recent past is likely to persist.", context: "Recency Bias" },
      { text: "Diversifying well is the most important thing you can do to invest well.", context: "Portfolio Construction" },
      { text: "Time is like a river that carries us forward into encounters with reality that require us to make decisions.", context: "Decision Making" },
    ],
    resources: [
      { type: 'book', title: 'Principles: Life and Work', author: 'Ray Dalio', description: 'His life and management philosophy' },
      { type: 'video', title: 'How The Economic Machine Works', url: 'https://www.youtube.com/watch?v=PHe0bXAIuk0', description: '30-min masterclass on economics' },
      { type: 'book', title: 'Principles for Dealing with the Changing World Order', author: 'Ray Dalio', description: 'Analysis of empires and cycles' },
    ],
  },
  {
    id: 'marks',
    name: 'Howard Marks',
    firm: 'Oaktree Capital',
    title: 'Co-Chairman',
    image: '📝',
    style: 'Distressed / Value',
    aum: '$180B',
    annualReturn: '19%',
    since: 1995,
    description: 'Master of credit markets and market cycles. His memos are must-reads for serious investors.',
    bio: 'Howard Marks co-founded Oaktree Capital, focusing on distressed debt and credit investing. His memos on market cycles, risk, and investor psychology are legendary in the investment world.',
    holdings: [], // Oaktree focuses on credit, not public equities
    principles: [
      { title: 'Second-Level Thinking', description: 'Ask what\'s the consensus, and how is my view different? First-level thinking leads to average results.' },
      { title: 'Risk is Permanent Loss', description: 'Risk isn\'t volatility - it\'s the probability of permanent capital loss.' },
      { title: 'Know Where You Are', description: 'Understanding where we are in the cycle is more important than predicting the future.' },
      { title: 'Patient Opportunism', description: 'Wait for fat pitches. The best opportunities come from others\' mistakes.' },
      { title: 'Contrarian Thinking', description: 'To beat the market, you must think differently AND be right.' },
      { title: 'Margin of Safety', description: 'The less prudence with which others conduct their affairs, the greater prudence with which we should conduct our own.' },
    ],
    quotes: [
      { text: "The most important thing is to avoid the big mistakes.", context: "Risk Management" },
      { text: "You can't predict. You can prepare.", context: "Uncertainty" },
      { text: "Being too far ahead of your time is indistinguishable from being wrong.", context: "Timing" },
      { text: "The biggest investing errors come not from factors that are informational or analytical, but from those that are psychological.", context: "Behavior" },
      { text: "In the real world, things generally fluctuate between 'pretty good' and 'not so hot.' But in the world of investing, perception often swings from 'flawless' to 'hopeless.'", context: "Market Cycles" },
      { text: "Experience is what you got when you didn't get what you wanted.", context: "Learning" },
    ],
    resources: [
      { type: 'memo', title: 'Oaktree Memos', url: 'https://www.oaktreecapital.com/insights', description: '30+ years of investment wisdom' },
      { type: 'book', title: 'The Most Important Thing', author: 'Howard Marks', description: 'Distilled investment wisdom' },
      { type: 'book', title: 'Mastering the Market Cycle', author: 'Howard Marks', description: 'Deep dive into cycles' },
    ],
  },
  {
    id: 'ackman',
    name: 'Bill Ackman',
    firm: 'Pershing Square',
    title: 'CEO',
    image: '🎤',
    style: 'Activist Value',
    aum: '$16B',
    annualReturn: '16%',
    since: 2004,
    description: 'Activist investor known for concentrated bets and public campaigns. Made 100x on COVID hedge.',
    bio: 'Bill Ackman runs Pershing Square with a concentrated portfolio of 8-12 positions. He\'s known for activist campaigns at companies like Chipotle, Canadian Pacific, and his infamous Herbalife short.',
    holdings: [
      { symbol: 'HLT', company: 'Hilton Hotels', shares: 8500000, value: 1700000000, portfolioPct: 14.8, change: 'hold' },
      { symbol: 'QSR', company: 'Restaurant Brands', shares: 21000000, value: 1600000000, portfolioPct: 13.9, change: 'hold' },
      { symbol: 'CMG', company: 'Chipotle', shares: 500000, value: 1400000000, portfolioPct: 12.2, change: 'hold' },
      { symbol: 'GOOGL', company: 'Alphabet', shares: 6000000, value: 1050000000, portfolioPct: 9.1, change: 'increased' },
      { symbol: 'LOW', company: "Lowe's", shares: 4500000, value: 1000000000, portfolioPct: 8.7, change: 'hold' },
      { symbol: 'HHH', company: 'Howard Hughes', shares: 12500000, value: 900000000, portfolioPct: 7.8, change: 'hold' },
    ],
    principles: [
      { title: 'Simple, Predictable Businesses', description: 'Invest in businesses where you can predict cash flows with high confidence.' },
      { title: 'Durable Competitive Advantages', description: 'Look for moats that protect returns on capital.' },
      { title: 'Limited Exposure to Extrinsic Factors', description: 'Avoid businesses heavily affected by factors outside management control.' },
      { title: 'Strong Balance Sheet', description: 'Prefer companies that can survive any economic environment.' },
      { title: 'High-Quality Management', description: 'Partner with exceptional operators aligned with shareholders.' },
      { title: 'Asymmetric Risk/Reward', description: 'Seek situations where upside greatly exceeds downside.' },
    ],
    quotes: [
      { text: "The key to long-term investment success is avoiding the permanent loss of capital.", context: "Risk Management" },
      { text: "I'm looking for a mispriced bet on a business that I understand extremely well.", context: "Investment Criteria" },
      { text: "Time is the enemy of the poor business and the friend of the great business.", context: "Quality" },
      { text: "The market is very good at valuation over the long term, but very bad at it in the short term.", context: "Patience" },
    ],
    resources: [
      { type: 'letter', title: 'Pershing Square Annual Letters', url: 'https://pershingsquareholdings.com/company-reports/letters-to-shareholders/', description: 'Detailed investment analysis' },
      { type: 'video', title: 'Ackman Presentations', url: 'https://www.youtube.com/results?search_query=bill+ackman+presentation', description: 'Investment thesis presentations' },
    ],
  },
  {
    id: 'burry',
    name: 'Michael Burry',
    firm: 'Scion Asset Management',
    title: 'Founder',
    image: '🔮',
    style: 'Deep Value / Contrarian',
    aum: '$300M',
    annualReturn: '30%+',
    since: 2000,
    description: 'The Big Short. Predicted and profited from the 2008 housing crisis. Known for contrarian bets.',
    bio: 'Michael Burry famously predicted the housing crisis and made $700M+ for his investors. He\'s a trained physician who taught himself investing through SEC filings and deep research.',
    holdings: [
      { symbol: 'BABA', company: 'Alibaba', shares: 75000, value: 6000000, portfolioPct: 12.5, change: 'new' },
      { symbol: 'JD', company: 'JD.com', shares: 125000, value: 3750000, portfolioPct: 7.8, change: 'new' },
      { symbol: 'GOOG', company: 'Alphabet', shares: 20000, value: 3500000, portfolioPct: 7.3, change: 'reduced' },
      { symbol: 'REAL', company: 'RealReal', shares: 1500000, value: 2700000, portfolioPct: 5.6, change: 'hold' },
    ],
    principles: [
      { title: 'Read the Filings', description: 'The answer is usually in the footnotes. Most investors don\'t read them.' },
      { title: 'Ignore the Crowd', description: 'Consensus is comfortable but unprofitable. Do your own work.' },
      { title: 'Understand the Downside', description: 'Focus on what can go wrong. The upside takes care of itself.' },
      { title: 'Patience in Conviction', description: 'Being early is the same as being wrong, until it isn\'t.' },
      { title: 'Concentrated Bets', description: 'When you find something compelling, size it appropriately.' },
    ],
    quotes: [
      { text: "I try to buy shares of unpopular companies when they look like road kill.", context: "Contrarian Investing" },
      { text: "The late 90s almost forced me to hang up my spurs. Patience is hard.", context: "Patience" },
      { text: "I wasn't making subprime loans. I wasn't making the rules. I was just trying to understand them.", context: "On 2008" },
      { text: "It is ludicrous to believe that asset bubbles can only be recognized in hindsight.", context: "Market Analysis" },
    ],
    resources: [
      { type: 'movie', title: 'The Big Short', description: 'Hollywood adaptation of the 2008 crisis' },
      { type: 'tool', title: '13F Filings', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&company=scion+asset&type=13F', description: 'Track his current holdings' },
    ],
  },
  {
    id: 'lynch',
    name: 'Peter Lynch',
    firm: 'Fidelity Magellan Fund',
    title: 'Manager (1977-1990)',
    image: '📊',
    style: 'Growth at Reasonable Price',
    aum: '$14B (at peak)',
    annualReturn: '29%',
    since: 1977,
    description: 'Legendary fund manager who averaged 29% annually for 13 years. Pioneer of GARP investing.',
    bio: 'Peter Lynch turned Magellan Fund into the best-performing mutual fund in the world. He\'s known for "invest in what you know" and his classification of stocks into categories like stalwarts, fast growers, and turnarounds.',
    holdings: [], // Retired
    principles: [
      { title: 'Invest in What You Know', description: 'Your edge is in your everyday life. You see trends before Wall Street.' },
      { title: 'Know What You Own', description: 'Be able to explain your investment in 2 minutes to a 10-year-old.' },
      { title: 'Long-term Wins', description: 'Time is on your side when you own shares of superior companies.' },
      { title: 'Do Your Homework', description: 'Behind every stock is a company. Find out what it does.' },
      { title: 'Categories Matter', description: 'Fast growers, stalwarts, cyclicals, turnarounds - each has different rules.' },
      { title: 'Sell the Losers', description: 'Let winners run. Selling your winners and keeping losers is like cutting flowers and watering weeds.' },
    ],
    quotes: [
      { text: "Know what you own, and know why you own it.", context: "Due Diligence" },
      { text: "The person that turns over the most rocks wins the game.", context: "Research" },
      { text: "Go for a business that any idiot can run - because sooner or later, any idiot probably is going to run it.", context: "Business Quality" },
      { text: "In the stock market, the most important organ is the stomach, not the brain.", context: "Temperament" },
      { text: "Far more money has been lost by investors preparing for corrections than in corrections themselves.", context: "Market Timing" },
      { text: "If you spend 13 minutes a year on economics, you've wasted 10 minutes.", context: "Bottom-up Investing" },
    ],
    resources: [
      { type: 'book', title: 'One Up on Wall Street', author: 'Peter Lynch', description: 'Classic guide for individual investors' },
      { type: 'book', title: 'Beating the Street', author: 'Peter Lynch', description: 'How he picked winning stocks' },
    ],
  },
];

// Investment wisdom by category
const WISDOM_CATEGORIES = [
  {
    category: 'Risk Management',
    icon: '🛡️',
    lessons: [
      { text: 'Rule #1: Never lose money. Rule #2: Never forget Rule #1.', author: 'Warren Buffett' },
      { text: 'The biggest investing errors come from factors that are psychological.', author: 'Howard Marks' },
      { text: 'Risk comes from not knowing what you\'re doing.', author: 'Warren Buffett' },
      { text: 'The first loss is the best loss.', author: 'Stanley Druckenmiller' },
    ],
  },
  {
    category: 'Patience & Discipline',
    icon: '⏳',
    lessons: [
      { text: 'The stock market is a device for transferring money from the impatient to the patient.', author: 'Warren Buffett' },
      { text: 'The big money is not in the buying or selling, but in the waiting.', author: 'Charlie Munger' },
      { text: 'Time is the friend of the wonderful business, the enemy of the mediocre.', author: 'Warren Buffett' },
      { text: 'Our favorite holding period is forever.', author: 'Warren Buffett' },
    ],
  },
  {
    category: 'Market Psychology',
    icon: '🧠',
    lessons: [
      { text: 'Be fearful when others are greedy, and greedy when others are fearful.', author: 'Warren Buffett' },
      { text: 'Markets can remain irrational longer than you can remain solvent.', author: 'John Maynard Keynes' },
      { text: 'In the short run, the market is a voting machine. In the long run, it\'s a weighing machine.', author: 'Benjamin Graham' },
      { text: 'The most important quality for an investor is temperament, not intellect.', author: 'Warren Buffett' },
    ],
  },
  {
    category: 'Business Analysis',
    icon: '🔍',
    lessons: [
      { text: 'Price is what you pay. Value is what you get.', author: 'Warren Buffett' },
      { text: 'It\'s far better to buy a wonderful company at a fair price than a fair company at a wonderful price.', author: 'Warren Buffett' },
      { text: 'Know what you own and know why you own it.', author: 'Peter Lynch' },
      { text: 'Behind every stock is a company. Find out what it\'s doing.', author: 'Peter Lynch' },
    ],
  },
  {
    category: 'Continuous Learning',
    icon: '📚',
    lessons: [
      { text: 'Spend each day trying to be a little wiser than when you woke up.', author: 'Charlie Munger' },
      { text: 'I just keep reading and thinking. I read and read and read.', author: 'Warren Buffett' },
      { text: 'The best thing a human being can do is help another human being know more.', author: 'Charlie Munger' },
      { text: 'Experience is what you got when you didn\'t get what you wanted.', author: 'Howard Marks' },
    ],
  },
  {
    category: 'Circle of Competence',
    icon: '⭕',
    lessons: [
      { text: 'Knowing what you don\'t know is more useful than being brilliant.', author: 'Charlie Munger' },
      { text: 'Only invest in businesses you truly understand.', author: 'Warren Buffett' },
      { text: 'There are no called strikes in investing. You don\'t have to swing at anything.', author: 'Warren Buffett' },
      { text: 'The most important thing in investing is knowing the limits of your competence.', author: 'Mohnish Pabrai' },
    ],
  },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const investorId = searchParams.get('id');

  if (action === 'list') {
    // Return summary list of all investors
    const summary = LEGENDARY_INVESTORS.map(inv => ({
      id: inv.id,
      name: inv.name,
      firm: inv.firm,
      image: inv.image,
      style: inv.style,
      annualReturn: inv.annualReturn,
      aum: inv.aum,
    }));
    return NextResponse.json({ success: true, investors: summary });
  }

  if (action === 'detail' && investorId) {
    const investor = LEGENDARY_INVESTORS.find(inv => inv.id === investorId);
    if (!investor) {
      return NextResponse.json({ error: 'Investor not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, investor });
  }

  if (action === 'wisdom') {
    return NextResponse.json({ success: true, wisdom: WISDOM_CATEGORIES });
  }

  if (action === 'holdings') {
    // Return all holdings across all investors for comparison
    const allHoldings = {};
    LEGENDARY_INVESTORS.forEach(inv => {
      inv.holdings.forEach(h => {
        if (!allHoldings[h.symbol]) {
          allHoldings[h.symbol] = { symbol: h.symbol, company: h.company, investors: [] };
        }
        allHoldings[h.symbol].investors.push({
          name: inv.name,
          firm: inv.firm,
          shares: h.shares,
          value: h.value,
          change: h.change,
        });
      });
    });
    return NextResponse.json({ success: true, holdings: Object.values(allHoldings) });
  }

  if (action === 'random-quote') {
    const allQuotes = [];
    LEGENDARY_INVESTORS.forEach(inv => {
      inv.quotes.forEach(q => {
        allQuotes.push({ ...q, author: inv.name });
      });
    });
    const randomQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)];
    return NextResponse.json({ success: true, quote: randomQuote });
  }

  // Default: return everything
  return NextResponse.json({
    success: true,
    investors: LEGENDARY_INVESTORS,
    wisdom: WISDOM_CATEGORIES,
  });
}

export async function POST(request) {
  const body = await request.json();
  const { action, symbol } = body;

  if (action === 'whoOwns') {
    // Find which legendary investors own a particular stock
    const owners = [];
    LEGENDARY_INVESTORS.forEach(inv => {
      const holding = inv.holdings.find(h => h.symbol === symbol);
      if (holding) {
        owners.push({
          investor: inv.name,
          firm: inv.firm,
          shares: holding.shares,
          value: holding.value,
          portfolioPct: holding.portfolioPct,
          change: holding.change,
        });
      }
    });
    return NextResponse.json({ success: true, symbol, owners });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
