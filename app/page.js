'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Circle, Brain, Zap, Shield, Target, Settings, RefreshCw, ChevronRight, Check, Briefcase, BarChart3, Sparkles, Play, Lock, Eye, EyeOff, Search, X, ShoppingCart, ArrowUpCircle, ArrowDownCircle, History, AlertTriangle, Power, Gauge, Bot, Clock, Newspaper, Calendar, ThumbsUp, ThumbsDown, Minus, Activity, FileText, Users, Radio, Layers, Wallet, Building2, CreditCard, PiggyBank, Plus, Trash2, Edit3, Home, Bell, Mail, LogOut, UserPlus, LogIn, Share2, Copy } from 'lucide-react';

const POPULAR_STOCKS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'JPM', 'V', 'JNJ', 'XOM', 'SPY', 'QQQ', 'AMD', 'NFLX'];

const DEMO_ACCOUNT = { equity: '127450.32', buying_power: '48230.15', last_equity: '125890.50' };

const DEMO_POSITIONS = [
  { symbol: 'AAPL', qty: '25', avg_entry_price: '178.50', current_price: '192.30', market_value: '4807.50', unrealized_pl: '345.00', unrealized_plpc: '0.0772' },
  { symbol: 'MSFT', qty: '15', avg_entry_price: '378.20', current_price: '415.80', market_value: '6237.00', unrealized_pl: '564.00', unrealized_plpc: '0.0994' },
  { symbol: 'NVDA', qty: '10', avg_entry_price: '725.00', current_price: '875.40', market_value: '8754.00', unrealized_pl: '1504.00', unrealized_plpc: '0.2074' },
  { symbol: 'GOOGL', qty: '20', avg_entry_price: '141.30', current_price: '152.80', market_value: '3056.00', unrealized_pl: '230.00', unrealized_plpc: '0.0814' },
  { symbol: 'JPM', qty: '30', avg_entry_price: '185.40', current_price: '198.20', market_value: '5946.00', unrealized_pl: '384.00', unrealized_plpc: '0.0690' },
  { symbol: 'JNJ', qty: '18', avg_entry_price: '158.90', current_price: '162.45', market_value: '2924.10', unrealized_pl: '63.90', unrealized_plpc: '0.0223' },
];

// AI Analysis Engine
const generateAIAnalysis = (preferences, positions) => {
  const sectors = {
    'AAPL': { sector: 'Technology', industry: 'Consumer Electronics', beta: 1.28 },
    'MSFT': { sector: 'Technology', industry: 'Software', beta: 0.93 },
    'GOOGL': { sector: 'Technology', industry: 'Internet Services', beta: 1.06 },
    'AMZN': { sector: 'Consumer Cyclical', industry: 'E-Commerce', beta: 1.24 },
    'NVDA': { sector: 'Technology', industry: 'Semiconductors', beta: 1.71 },
    'TSLA': { sector: 'Consumer Cyclical', industry: 'Auto Manufacturers', beta: 2.05 },
    'JPM': { sector: 'Financial', industry: 'Banks', beta: 1.12 },
    'JNJ': { sector: 'Healthcare', industry: 'Pharmaceuticals', beta: 0.56 },
    'V': { sector: 'Financial', industry: 'Credit Services', beta: 0.94 },
    'XOM': { sector: 'Energy', industry: 'Oil & Gas', beta: 0.98 },
    'META': { sector: 'Technology', industry: 'Social Media', beta: 1.35 },
    'AMD': { sector: 'Technology', industry: 'Semiconductors', beta: 1.82 },
    'PG': { sector: 'Consumer Defensive', industry: 'Household Products', beta: 0.42 },
    'UNH': { sector: 'Healthcare', industry: 'Health Plans', beta: 0.73 },
  };

  const suggestions = [];
  const preferredSectors = preferences.sectors || [];
  const riskTolerance = preferences.riskTolerance || 'moderate';
  const riskMultiplier = { conservative: 0.5, moderate: 1.0, aggressive: 1.5 }[riskTolerance];
  const currentSymbols = positions.map(p => p.symbol);

  Object.entries(sectors).forEach(([symbol, data]) => {
    if (currentSymbols.includes(symbol)) return;
    const sectorMatch = preferredSectors.length === 0 || preferredSectors.includes(data.sector);
    const betaMatch = (riskTolerance === 'conservative' && data.beta < 0.8) ||
                      (riskTolerance === 'moderate' && data.beta >= 0.7 && data.beta <= 1.3) ||
                      (riskTolerance === 'aggressive' && data.beta > 1.0);

    if (sectorMatch && betaMatch && Math.random() > 0.4) {
      const confidence = Math.floor(65 + Math.random() * 30);
      const basePrice = 100 + Math.random() * 400;
      suggestions.push({
        symbol, action: 'BUY', confidence,
        suggestedQty: Math.ceil(5 * riskMultiplier),
        currentPrice: basePrice,
        sector: data.sector, industry: data.industry, beta: data.beta,
        analysis: {
          technicalScore: Math.floor(60 + Math.random() * 35),
          fundamentalScore: Math.floor(55 + Math.random() * 40),
          sentimentScore: Math.floor(50 + Math.random() * 45),
          riskScore: Math.floor(100 - data.beta * 40),
          reasons: [
            `Strong ${data.sector} sector momentum`,
            `Beta of ${data.beta.toFixed(2)} fits your ${riskTolerance} profile`,
            `${data.industry} showing solid fundamentals`
          ]
        }
      });
    }
  });

  positions.forEach(pos => {
    const unrealizedPct = parseFloat(pos.unrealized_plpc) * 100;
    const data = sectors[pos.symbol] || { sector: 'Unknown', industry: 'Unknown', beta: 1.0 };
    if (unrealizedPct > 15 || unrealizedPct < -10) {
      suggestions.push({
        symbol: pos.symbol,
        action: unrealizedPct > 15 ? 'TAKE_PROFIT' : 'STOP_LOSS',
        confidence: Math.floor(70 + Math.random() * 25),
        suggestedQty: Math.ceil(parseFloat(pos.qty) * 0.5),
        currentPrice: parseFloat(pos.current_price),
        sector: data.sector, industry: data.industry,
        analysis: {
          technicalScore: Math.floor(40 + Math.random() * 30),
          fundamentalScore: Math.floor(50 + Math.random() * 30),
          sentimentScore: Math.floor(45 + Math.random() * 30),
          riskScore: unrealizedPct < 0 ? 30 : 70,
          reasons: unrealizedPct > 15
            ? [`Up ${unrealizedPct.toFixed(1)}% - take profits`, `Lock in gains`]
            : [`Down ${Math.abs(unrealizedPct).toFixed(1)}%`, `Consider cutting losses`]
        }
      });
    }
  });

  return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 8);
};

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function AIPortfolioManager() {
  // Authentication
  const { data: session, status } = useSession();
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authHouseholdCode, setAuthHouseholdCode] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [householdData, setHouseholdData] = useState(null);
  const [showHouseholdShare, setShowHouseholdShare] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const [mode, setMode] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  const [account, setAccount] = useState(null);
  const [positions, setPositions] = useState([]);
  const [portfolioHistory, setPortfolioHistory] = useState([]);

  // Quick Trade State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);
  const [tradeQty, setTradeQty] = useState(1);
  const [tradeSide, setTradeSide] = useState('buy');
  const [showTradePanel, setShowTradePanel] = useState(false);

  // Trade History
  const [tradeHistory, setTradeHistory] = useState([]);

  // Auto-Trading Settings
  const [autoTradeSettings, setAutoTradeSettings] = useState({
    enabled: false,
    confidenceThreshold: 85,
    maxPositionPercent: 5,
    dailyLossLimit: 3,
    maxTradesPerDay: 10,
  });
  const [dailyPL, setDailyPL] = useState(0);
  const [tradesToday, setTradesToday] = useState(0);
  const [circuitBreakerTripped, setCircuitBreakerTripped] = useState(false);

  const [preferences, setPreferences] = useState({
    tradingStyle: 'balanced',
    riskTolerance: 'moderate',
    sectors: ['Technology', 'Healthcare'],
    maxPositionSize: 10,
  });

  const [suggestions, setSuggestions] = useState([]);
  const [analyzingMarket, setAnalyzingMarket] = useState(false);
  const [executingTrade, setExecutingTrade] = useState(null);
  const [tradeConfirmation, setTradeConfirmation] = useState(null);

  // Research Agent State (Phase 2)
  const [researchData, setResearchData] = useState(null);
  const [holdingsRatings, setHoldingsRatings] = useState({});
  const [newsFeed, setNewsFeed] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [researchLoading, setResearchLoading] = useState(false);
  const [lastResearchUpdate, setLastResearchUpdate] = useState(null);

  // Phase 3 & 4: Manual Accounts, Debts & Digests
  const [manualAccounts, setManualAccounts] = useState([
    { id: 1, name: 'Roth IRA', type: 'retirement', institution: 'Fidelity', balance: 45000, lastUpdated: new Date().toISOString() },
    { id: 2, name: 'Checking', type: 'checking', institution: 'Chase', balance: 8500, lastUpdated: new Date().toISOString() },
    { id: 3, name: 'Savings', type: 'savings', institution: 'Marcus', balance: 15000, lastUpdated: new Date().toISOString() },
    { id: 4, name: 'Crypto (Ledger)', type: 'crypto', institution: 'Ledger', balance: 12500, holdings: 'BTC, ETH', lastUpdated: new Date().toISOString() },
    { id: 5, name: 'Investment Partnership', type: 'partnership', institution: 'ABC Partners LP', balance: 25000, ownershipPct: 1.8, lastUpdated: new Date().toISOString() },
  ]);
  const [debts, setDebts] = useState([
    { id: 1, name: 'Mortgage', type: 'mortgage', balance: 285000, interestRate: 6.5, minimumPayment: 1850, institution: 'Wells Fargo', lastUpdated: new Date().toISOString() },
    { id: 2, name: 'Student Loan', type: 'student', balance: 32000, interestRate: 5.5, minimumPayment: 350, institution: 'Nelnet', lastUpdated: new Date().toISOString() },
  ]);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showAddDebt, setShowAddDebt] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [editingDebt, setEditingDebt] = useState(null);
  const [newAccount, setNewAccount] = useState({ name: '', type: 'checking', institution: '', balance: '', ownershipPct: '', holdings: '' });
  const [newDebt, setNewDebt] = useState({ name: '', type: 'mortgage', balance: '', interestRate: '', minimumPayment: '', institution: '' });
  const [digest, setDigest] = useState(null);
  const [digestPeriod, setDigestPeriod] = useState('weekly');
  const [digestLoading, setDigestLoading] = useState(false);
  const [advisor, setAdvisor] = useState(null);
  const [advisorLoading, setAdvisorLoading] = useState(false);

  // Phase 5: AI Competition
  const [aiTraders, setAiTraders] = useState([
    { model: 'claude', enabled: true, portfolioValue: 100000, positions: [], tradeHistory: [], dailyReturns: [], valueHistory: [100000] },
    { model: 'gpt', enabled: true, portfolioValue: 100000, positions: [], tradeHistory: [], dailyReturns: [], valueHistory: [100000] },
    { model: 'grok', enabled: true, portfolioValue: 100000, positions: [], tradeHistory: [], dailyReturns: [], valueHistory: [100000] },
    { model: 'gemini', enabled: true, portfolioValue: 100000, positions: [], tradeHistory: [], dailyReturns: [], valueHistory: [100000] },
  ]);
  const [aiDecisions, setAiDecisions] = useState({});
  const [competitionRunning, setCompetitionRunning] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  // Phase 6: Partnership Dashboard
  const [partnershipData, setPartnershipData] = useState({
    name: 'Investment Partnership',
    ownershipPct: 1.8,
    quarterlyReports: [],
  });
  const [showAddReport, setShowAddReport] = useState(false);
  const [newReport, setNewReport] = useState({
    quarter: 4, year: 2025, totalNav: '', navPerUnit: '',
    grossReturn: '', netReturn: '', distributions: '', capitalCalls: '',
    managementFee: '', performanceFee: '', notes: ''
  });
  const [partnershipMetrics, setPartnershipMetrics] = useState(null);
  const [reportAnalysis, setReportAnalysis] = useState(null);

  // Phase 7: Plaid Bank Integrations
  const [plaidConfig, setPlaidConfig] = useState({ clientId: '', secret: '', environment: 'sandbox' });
  const [plaidConnections, setPlaidConnections] = useState([]); // { id, accessToken, institutionName, accounts }
  const [transactions, setTransactions] = useState([]);
  const [transactionsSummary, setTransactionsSummary] = useState(null);
  const [recurringExpenses, setRecurringExpenses] = useState(null);
  const [plaidLoading, setPlaidLoading] = useState(false);
  const [plaidLinkToken, setPlaidLinkToken] = useState(null);
  const [showPlaidSetup, setShowPlaidSetup] = useState(false);
  const [transactionDateRange, setTransactionDateRange] = useState('30'); // days
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [transactionSearch, setTransactionSearch] = useState('');

  // Phase 8: Budgets & Smart Categorization
  const [budgets, setBudgets] = useState({});
  const [budgetAnalysis, setBudgetAnalysis] = useState(null);
  const [showBudgetSetup, setShowBudgetSetup] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [spendingView, setSpendingView] = useState('overview'); // overview, budgets, transactions, trips

  // Phase 10: Trip & Event Tracking
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [tripAnalysis, setTripAnalysis] = useState(null);
  const [tripComparison, setTripComparison] = useState(null);
  const [showAddTrip, setShowAddTrip] = useState(false);
  const [newTrip, setNewTrip] = useState({ name: '', startDate: '', endDate: '', budget: '', notes: '' });
  const [tripSuggestions, setTripSuggestions] = useState([]);

  // Authentication functions
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: authEmail,
        password: authPassword,
        name: authName,
        action: authMode,
        householdCode: authHouseholdCode,
      });

      if (result?.error) {
        setAuthError(result.error);
      } else {
        // Clear form
        setAuthEmail('');
        setAuthPassword('');
        setAuthName('');
        setAuthHouseholdCode('');
      }
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    setHouseholdData(null);
  };

  const copyHouseholdCode = () => {
    if (session?.user?.householdCode) {
      navigator.clipboard.writeText(session.user.householdCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Fetch household data when session changes
  useEffect(() => {
    if (session?.user?.householdId) {
      fetchHouseholdData();
    }
  }, [session?.user?.householdId]);

  const fetchHouseholdData = async () => {
    if (!session?.user?.householdId) return;
    try {
      const res = await fetch(`/api/household?householdId=${session.user.householdId}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setHouseholdData(data);

      // Load shared data into state
      if (data.data) {
        if (data.data.accounts) setManualAccounts(data.data.accounts);
        if (data.data.debts) setDebts(data.data.debts);
        if (data.data.budgets) setBudgets(data.data.budgets);
        if (data.data.monthlyIncome) setMonthlyIncome(data.data.monthlyIncome);
        if (data.data.partnershipData) setPartnershipData(data.data.partnershipData);
        if (data.data.plaidConfig) setPlaidConfig(data.data.plaidConfig);
      }
    } catch (err) {
      console.error('Failed to fetch household data:', err);
    }
  };

  const saveHouseholdData = async (field, value) => {
    if (!session?.user?.householdId) return;
    try {
      await fetch('/api/household', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          householdId: session.user.householdId,
          field,
          data: value,
        }),
      });
    } catch (err) {
      console.error('Failed to save household data:', err);
    }
  };

  // Auto-save shared data when it changes (debounced)
  useEffect(() => {
    if (session?.user?.householdId && manualAccounts.length > 0) {
      const timeout = setTimeout(() => saveHouseholdData('accounts', manualAccounts), 1000);
      return () => clearTimeout(timeout);
    }
  }, [manualAccounts, session?.user?.householdId]);

  useEffect(() => {
    if (session?.user?.householdId && debts.length > 0) {
      const timeout = setTimeout(() => saveHouseholdData('debts', debts), 1000);
      return () => clearTimeout(timeout);
    }
  }, [debts, session?.user?.householdId]);

  useEffect(() => {
    if (session?.user?.householdId && Object.keys(budgets).length > 0) {
      const timeout = setTimeout(() => saveHouseholdData('budgets', budgets), 1000);
      return () => clearTimeout(timeout);
    }
  }, [budgets, session?.user?.householdId]);

  useEffect(() => {
    if (session?.user?.householdId && monthlyIncome > 0) {
      const timeout = setTimeout(() => saveHouseholdData('monthlyIncome', monthlyIncome), 1000);
      return () => clearTimeout(timeout);
    }
  }, [monthlyIncome, session?.user?.householdId]);

  useEffect(() => {
    if (session?.user?.householdId && partnershipData.quarterlyReports?.length > 0) {
      const timeout = setTimeout(() => saveHouseholdData('partnershipData', partnershipData), 1000);
      return () => clearTimeout(timeout);
    }
  }, [partnershipData, session?.user?.householdId]);

  const generateHistory = (equity) => {
    const history = [];
    let value = parseFloat(equity) * 0.85;
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      value *= (1 + (Math.random() - 0.48) * 0.03);
      history.push({ date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: Math.round(value) });
    }
    return history;
  };

  const startDemoMode = () => {
    setMode('demo');
    setConnected(true);
    setAccount(DEMO_ACCOUNT);
    setPositions(DEMO_POSITIONS);
    setPortfolioHistory(generateHistory(DEMO_ACCOUNT.equity));
  };

  const connectLive = async () => {
    if (!apiKey || !secretKey) { setError('Please enter both API Key and Secret Key'); return; }
    setLoading(true);
    setError('');
    try {
      const accountRes = await fetch('/api/alpaca/account', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, secretKey }),
      });
      if (!accountRes.ok) throw new Error('Invalid API credentials');
      const accountData = await accountRes.json();

      const positionsRes = await fetch('/api/alpaca/positions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, secretKey }),
      });
      const positionsData = positionsRes.ok ? await positionsRes.json() : [];

      setMode('live');
      setConnected(true);
      setAccount(accountData);
      setPositions(positionsData);
      setPortfolioHistory(generateHistory(accountData.equity));
    } catch (err) {
      setError(err.message || 'Failed to connect');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    if (mode !== 'live') return;
    setLoading(true);
    try {
      const [accountRes, positionsRes] = await Promise.all([
        fetch('/api/alpaca/account', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ apiKey, secretKey }) }),
        fetch('/api/alpaca/positions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ apiKey, secretKey }) }),
      ]);
      if (accountRes.ok) setAccount(await accountRes.json());
      if (positionsRes.ok) setPositions(await positionsRes.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Check circuit breaker conditions
  const checkCircuitBreaker = () => {
    if (!account) return false;
    const dailyLossPct = (dailyPL / parseFloat(account.equity)) * 100;
    if (dailyLossPct < -autoTradeSettings.dailyLossLimit) {
      setCircuitBreakerTripped(true);
      return true;
    }
    if (tradesToday >= autoTradeSettings.maxTradesPerDay) {
      return true;
    }
    return false;
  };

  // Auto-execute trade
  const autoExecuteTrade = async (suggestion) => {
    if (checkCircuitBreaker()) return;
    if (suggestion.confidence < autoTradeSettings.confidenceThreshold) return;

    // Check position size limit
    if (account) {
      const maxValue = parseFloat(account.equity) * (autoTradeSettings.maxPositionPercent / 100);
      const tradeValue = suggestion.suggestedQty * suggestion.currentPrice;
      if (tradeValue > maxValue) {
        suggestion.suggestedQty = Math.floor(maxValue / suggestion.currentPrice);
        if (suggestion.suggestedQty < 1) return;
      }
    }

    await executeTrade(suggestion, true);
  };

  // Run AI Analysis with optional auto-execution
  const runAIAnalysis = async () => {
    setAnalyzingMarket(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const newSuggestions = generateAIAnalysis(preferences, positions);
    setSuggestions(newSuggestions);
    setAnalyzingMarket(false);

    // Auto-execute if enabled and not circuit-broken
    if (autoTradeSettings.enabled && !circuitBreakerTripped) {
      for (const suggestion of newSuggestions) {
        if (suggestion.confidence >= autoTradeSettings.confidenceThreshold) {
          await autoExecuteTrade(suggestion);
        }
      }
    }
  };

  // Research Agent Pipeline (Phase 2)
  const runResearchPipeline = async () => {
    setResearchLoading(true);
    try {
      const symbols = positions.map(p => p.symbol);

      // Fetch research data through multi-agent pipeline
      const res = await fetch('/api/alpaca/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbols, positions, preferences }),
      });

      if (res.ok) {
        const data = await res.json();
        setResearchData(data);
        setHoldingsRatings(data.decisions || {});
        setLastResearchUpdate(new Date());
      }

      // Fetch news separately
      const newsRes = await fetch('/api/alpaca/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, secretKey, symbols }),
      });

      if (newsRes.ok) {
        const newsData = await newsRes.json();
        setNewsFeed(newsData.news || []);
        setUpcomingEvents(newsData.events || []);
      }
    } catch (err) {
      console.error('Research pipeline error:', err);
    } finally {
      setResearchLoading(false);
    }
  };

  // Auto-refresh research on position changes
  useEffect(() => {
    if (connected && positions.length > 0 && !researchData) {
      runResearchPipeline();
    }
  }, [connected, positions.length]);

  // Phase 3: Account Management Functions
  const addAccount = () => {
    if (!newAccount.name || !newAccount.balance) return;
    const account = {
      id: Date.now(),
      ...newAccount,
      balance: parseFloat(newAccount.balance),
      lastUpdated: new Date().toISOString()
    };
    setManualAccounts(prev => [...prev, account]);
    setNewAccount({ name: '', type: 'checking', institution: '', balance: '' });
    setShowAddAccount(false);
  };

  const updateAccount = (id, updates) => {
    setManualAccounts(prev => prev.map(acc =>
      acc.id === id ? { ...acc, ...updates, lastUpdated: new Date().toISOString() } : acc
    ));
    setEditingAccount(null);
  };

  const deleteAccount = (id) => {
    setManualAccounts(prev => prev.filter(acc => acc.id !== id));
  };

  const calculateNetWorth = () => {
    const manualTotal = manualAccounts.reduce((sum, acc) => sum + acc.balance, 0);
    const portfolioTotal = account ? parseFloat(account.equity) : 0;
    return manualTotal + portfolioTotal;
  };

  // Generate Digest
  const generateDigest = async () => {
    setDigestLoading(true);
    try {
      const res = await fetch('/api/alpaca/digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          period: digestPeriod,
          accounts: manualAccounts,
          positions,
          tradeHistory,
          preferences
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setDigest(data);
      }
    } catch (err) {
      console.error('Digest generation error:', err);
    } finally {
      setDigestLoading(false);
    }
  };

  const getAccountIcon = (type) => {
    const icons = {
      retirement: PiggyBank,
      investment: BarChart3,
      checking: Building2,
      savings: Wallet,
      credit: CreditCard,
      crypto: Circle, // Bitcoin-like
      partnership: Users,
    };
    return icons[type] || Wallet;
  };

  const getAccountColor = (type) => {
    const colors = {
      retirement: 'text-purple-400 bg-purple-500/20',
      investment: 'text-blue-400 bg-blue-500/20',
      checking: 'text-green-400 bg-green-500/20',
      savings: 'text-amber-400 bg-amber-500/20',
      credit: 'text-red-400 bg-red-500/20',
      crypto: 'text-orange-400 bg-orange-500/20',
      partnership: 'text-cyan-400 bg-cyan-500/20',
    };
    return colors[type] || 'text-slate-400 bg-slate-500/20';
  };

  // Debt Management Functions
  const addDebt = () => {
    if (!newDebt.name || !newDebt.balance) return;
    const debt = {
      id: Date.now(),
      ...newDebt,
      balance: parseFloat(newDebt.balance),
      interestRate: parseFloat(newDebt.interestRate) || 0,
      minimumPayment: parseFloat(newDebt.minimumPayment) || 0,
      lastUpdated: new Date().toISOString()
    };
    setDebts(prev => [...prev, debt]);
    setNewDebt({ name: '', type: 'mortgage', balance: '', interestRate: '', minimumPayment: '', institution: '' });
    setShowAddDebt(false);
  };

  const updateDebt = (id, updates) => {
    setDebts(prev => prev.map(debt =>
      debt.id === id ? { ...debt, ...updates, lastUpdated: new Date().toISOString() } : debt
    ));
    setEditingDebt(null);
  };

  const deleteDebt = (id) => {
    setDebts(prev => prev.filter(debt => debt.id !== id));
  };

  const calculateTotalDebts = () => {
    return debts.reduce((sum, debt) => sum + debt.balance, 0);
  };

  const calculateTrueNetWorth = () => {
    return calculateNetWorth() - calculateTotalDebts();
  };

  // AI Financial Advisor
  const getFinancialAdvice = async () => {
    setAdvisorLoading(true);
    try {
      const res = await fetch('/api/alpaca/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accounts: manualAccounts,
          debts,
          positions,
          preferences
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAdvisor(data);
      }
    } catch (err) {
      console.error('Advisor error:', err);
    } finally {
      setAdvisorLoading(false);
    }
  };

  const getDebtIcon = (type) => {
    const icons = {
      mortgage: Home,
      student: FileText,
      auto: ShoppingCart,
      credit: CreditCard,
      personal: Wallet,
    };
    return icons[type] || Wallet;
  };

  // Load from localStorage on mount
  useEffect(() => {
    const savedAccounts = localStorage.getItem('portfolioAccounts');
    const savedDebts = localStorage.getItem('portfolioDebts');
    if (savedAccounts) {
      try { setManualAccounts(JSON.parse(savedAccounts)); } catch (e) {}
    }
    if (savedDebts) {
      try { setDebts(JSON.parse(savedDebts)); } catch (e) {}
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem('portfolioAccounts', JSON.stringify(manualAccounts));
  }, [manualAccounts]);

  useEffect(() => {
    localStorage.setItem('portfolioDebts', JSON.stringify(debts));
  }, [debts]);

  // AI Competition Functions
  const AI_PROFILES = {
    claude: { name: 'Claude', provider: 'Anthropic', style: 'Balanced & Thoughtful', color: '#D97706' },
    gpt: { name: 'GPT-4', provider: 'OpenAI', style: 'Aggressive Growth', color: '#10B981' },
    grok: { name: 'Grok', provider: 'xAI', style: 'Contrarian & Bold', color: '#EF4444' },
    gemini: { name: 'Gemini', provider: 'Google', style: 'Data-Driven Conservative', color: '#3B82F6' },
  };

  const runAICompetition = async () => {
    setCompetitionRunning(true);
    try {
      // Get decisions from each AI
      const res = await fetch('/api/alpaca/ai-competition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_decisions',
          traders: aiTraders.filter(t => t.enabled),
          positions
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiDecisions(data.decisions);

        // Simulate performance update
        const perfRes = await fetch('/api/alpaca/ai-competition', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'simulate_performance',
            traders: aiTraders.filter(t => t.enabled),
          }),
        });

        if (perfRes.ok) {
          const perfData = await perfRes.json();

          // Update trader portfolios
          setAiTraders(prev => prev.map(trader => {
            const perf = perfData[trader.model];
            if (!perf) return trader;

            const newReturn = perf.dailyReturn;
            return {
              ...trader,
              portfolioValue: perf.newValue,
              dailyReturns: [...trader.dailyReturns, newReturn].slice(-30),
              valueHistory: [...trader.valueHistory, perf.newValue].slice(-30),
            };
          }));
        }

        // Update leaderboard
        const lbRes = await fetch('/api/alpaca/ai-competition', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'get_leaderboard',
            traders: aiTraders.filter(t => t.enabled),
          }),
        });

        if (lbRes.ok) {
          const lbData = await lbRes.json();
          setLeaderboard(lbData);
        }
      }
    } catch (err) {
      console.error('AI Competition error:', err);
    } finally {
      setCompetitionRunning(false);
    }
  };

  const toggleTrader = (model) => {
    setAiTraders(prev => prev.map(t =>
      t.model === model ? { ...t, enabled: !t.enabled } : t
    ));
  };

  const resetCompetition = () => {
    setAiTraders(prev => prev.map(t => ({
      ...t,
      portfolioValue: 100000,
      positions: [],
      tradeHistory: [],
      dailyReturns: [],
      valueHistory: [100000],
    })));
    setLeaderboard([]);
    setAiDecisions({});
  };

  // Partnership Functions
  const addQuarterlyReport = () => {
    const report = {
      id: Date.now(),
      ...newReport,
      totalNav: parseFloat(newReport.totalNav) || 0,
      navPerUnit: parseFloat(newReport.navPerUnit) || 0,
      grossReturn: parseFloat(newReport.grossReturn) || 0,
      netReturn: parseFloat(newReport.netReturn) || 0,
      distributions: parseFloat(newReport.distributions) || 0,
      capitalCalls: parseFloat(newReport.capitalCalls) || 0,
      managementFee: parseFloat(newReport.managementFee) || 0,
      performanceFee: parseFloat(newReport.performanceFee) || 0,
      reportDate: new Date().toISOString()
    };

    setPartnershipData(prev => ({
      ...prev,
      quarterlyReports: [...prev.quarterlyReports, report]
    }));

    setNewReport({
      quarter: 4, year: 2025, totalNav: '', navPerUnit: '',
      grossReturn: '', netReturn: '', distributions: '', capitalCalls: '',
      managementFee: '', performanceFee: '', notes: ''
    });
    setShowAddReport(false);
    analyzeReport(report);
  };

  const analyzeReport = async (report) => {
    try {
      const res = await fetch('/api/alpaca/partnership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'analyze_report',
          report,
          partnership: partnershipData
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setReportAnalysis(data);
      }
    } catch (err) {
      console.error('Report analysis error:', err);
    }
  };

  const calculatePartnershipMetrics = async () => {
    try {
      const res = await fetch('/api/alpaca/partnership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'calculate_metrics',
          partnership: partnershipData
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setPartnershipMetrics(data);
      }
    } catch (err) {
      console.error('Partnership metrics error:', err);
    }
  };

  const deleteReport = (id) => {
    setPartnershipData(prev => ({
      ...prev,
      quarterlyReports: prev.quarterlyReports.filter(r => r.id !== id)
    }));
  };

  // Phase 7: Plaid Functions
  const initPlaidLink = async () => {
    if (!plaidConfig.clientId || !plaidConfig.secret) {
      setError('Please enter your Plaid credentials');
      return;
    }
    setPlaidLoading(true);
    try {
      const res = await fetch('/api/plaid/create-link-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plaidConfig),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPlaidLinkToken(data.link_token);
      // Open Plaid Link in a new window (simplified approach)
      window.open(
        `https://cdn.plaid.com/link/v2/stable/link.html?token=${data.link_token}`,
        'PlaidLink',
        'width=400,height=600'
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setPlaidLoading(false);
    }
  };

  const connectPlaidAccount = async (publicToken, institutionName) => {
    setPlaidLoading(true);
    try {
      const res = await fetch('/api/plaid/exchange-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...plaidConfig, publicToken }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Get initial balances
      const balanceRes = await fetch('/api/plaid/balances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...plaidConfig, accessToken: data.access_token }),
      });
      const balanceData = await balanceRes.json();

      const newConnection = {
        id: Date.now(),
        accessToken: data.access_token,
        itemId: data.item_id,
        institutionName: institutionName || 'Connected Bank',
        accounts: balanceData.accounts || [],
        summary: balanceData.summary,
        connectedAt: new Date().toISOString(),
      };

      setPlaidConnections(prev => [...prev, newConnection]);
      setShowPlaidSetup(false);

      // Fetch transactions
      fetchTransactions(data.access_token);
    } catch (err) {
      setError(err.message);
    } finally {
      setPlaidLoading(false);
    }
  };

  const fetchTransactions = async (accessToken) => {
    if (!accessToken && plaidConnections.length === 0) return;
    setPlaidLoading(true);
    try {
      const token = accessToken || plaidConnections[0]?.accessToken;
      if (!token) return;

      const days = parseInt(transactionDateRange);
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const res = await fetch('/api/plaid/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...plaidConfig, accessToken: token, startDate, endDate }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setTransactions(data.transactions || []);
      setTransactionsSummary(data.summary);
    } catch (err) {
      setError(err.message);
    } finally {
      setPlaidLoading(false);
    }
  };

  const fetchRecurring = async () => {
    if (plaidConnections.length === 0) return;
    setPlaidLoading(true);
    try {
      const res = await fetch('/api/plaid/recurring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...plaidConfig, accessToken: plaidConnections[0].accessToken }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setRecurringExpenses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setPlaidLoading(false);
    }
  };

  const removePlaidConnection = (connectionId) => {
    setPlaidConnections(prev => prev.filter(c => c.id !== connectionId));
    if (plaidConnections.length <= 1) {
      setTransactions([]);
      setTransactionsSummary(null);
      setRecurringExpenses(null);
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = !transactionSearch ||
      tx.name?.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      tx.merchantName?.toLowerCase().includes(transactionSearch.toLowerCase());
    const matchesCategory = !selectedCategory || tx.primaryCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Phase 8: Budget Functions
  const analyzeBudget = async () => {
    if (transactions.length === 0) return;
    setPlaidLoading(true);
    try {
      const res = await fetch('/api/plaid/budget-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactions,
          budgets,
          monthlyIncome,
          previousTransactions: [], // TODO: store historical for better analysis
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setBudgetAnalysis(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setPlaidLoading(false);
    }
  };

  const updateBudget = (category, amount) => {
    setBudgets(prev => ({
      ...prev,
      [category]: parseFloat(amount) || 0,
    }));
  };

  const removeBudget = (category) => {
    setBudgets(prev => {
      const updated = { ...prev };
      delete updated[category];
      return updated;
    });
  };

  const applyBudgetSuggestions = () => {
    if (!budgetAnalysis?.budgetSuggestions) return;
    const newBudgets = {};
    budgetAnalysis.budgetSuggestions.forEach(s => {
      if (s.suggestedBudget > 0 && s.category !== 'Income' && s.category !== 'Transfer') {
        newBudgets[s.category] = s.suggestedBudget;
      }
    });
    setBudgets(newBudgets);
  };

  // Auto-analyze when transactions change
  useEffect(() => {
    if (transactions.length > 0) {
      analyzeBudget();
    }
  }, [transactions, budgets, monthlyIncome]);

  // Phase 10: Trip Functions
  const addTrip = () => {
    if (!newTrip.name) return;
    const trip = {
      id: `trip_${Date.now()}`,
      ...newTrip,
      budget: parseFloat(newTrip.budget) || 0,
      transactionIds: [],
      createdAt: new Date().toISOString(),
    };
    setTrips(prev => [...prev, trip]);
    setNewTrip({ name: '', startDate: '', endDate: '', budget: '', notes: '' });
    setShowAddTrip(false);
  };

  const deleteTrip = (tripId) => {
    setTrips(prev => prev.filter(t => t.id !== tripId));
    if (selectedTrip?.id === tripId) {
      setSelectedTrip(null);
      setTripAnalysis(null);
    }
  };

  const addTransactionToTrip = (tripId, transactionId) => {
    setTrips(prev => prev.map(t =>
      t.id === tripId
        ? { ...t, transactionIds: [...(t.transactionIds || []), transactionId] }
        : t
    ));
  };

  const removeTransactionFromTrip = (tripId, transactionId) => {
    setTrips(prev => prev.map(t =>
      t.id === tripId
        ? { ...t, transactionIds: (t.transactionIds || []).filter(id => id !== transactionId) }
        : t
    ));
  };

  const analyzeTrip = async (trip) => {
    if (!trip || transactions.length === 0) return;
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'analyze', trip, transactions }),
      });
      const data = await res.json();
      setTripAnalysis(data);
    } catch (err) {
      console.error('Trip analysis error:', err);
    }
  };

  const compareTrips = async () => {
    if (trips.length === 0 || transactions.length === 0) return;
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'compare', trips, transactions }),
      });
      const data = await res.json();
      setTripComparison(data);
    } catch (err) {
      console.error('Trip comparison error:', err);
    }
  };

  const suggestTripTransactions = async (trip) => {
    if (!trip || transactions.length === 0) return;
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'suggest', trip, transactions }),
      });
      const data = await res.json();
      setTripSuggestions(data.suggestions || []);
    } catch (err) {
      console.error('Trip suggestions error:', err);
    }
  };

  // Auto-analyze selected trip
  useEffect(() => {
    if (selectedTrip && transactions.length > 0) {
      analyzeTrip(selectedTrip);
      suggestTripTransactions(selectedTrip);
    }
  }, [selectedTrip, transactions]);

  // Load trips from localStorage (will be replaced by household sync)
  useEffect(() => {
    const savedTrips = localStorage.getItem('trips');
    if (savedTrips) {
      try { setTrips(JSON.parse(savedTrips)); } catch (e) {}
    }
  }, []);

  // Save trips
  useEffect(() => {
    localStorage.setItem('trips', JSON.stringify(trips));
  }, [trips]);

  // Load partnership data from localStorage
  useEffect(() => {
    const savedPartnership = localStorage.getItem('partnershipData');
    if (savedPartnership) {
      try { setPartnershipData(JSON.parse(savedPartnership)); } catch (e) {}
    }
  }, []);

  // Save partnership data
  useEffect(() => {
    localStorage.setItem('partnershipData', JSON.stringify(partnershipData));
    if (partnershipData.quarterlyReports.length > 0) {
      calculatePartnershipMetrics();
    }
  }, [partnershipData]);

  // Load Plaid data from localStorage
  useEffect(() => {
    const savedPlaid = localStorage.getItem('plaidConfig');
    const savedConnections = localStorage.getItem('plaidConnections');
    if (savedPlaid) {
      try { setPlaidConfig(JSON.parse(savedPlaid)); } catch (e) {}
    }
    if (savedConnections) {
      try { setPlaidConnections(JSON.parse(savedConnections)); } catch (e) {}
    }
  }, []);

  // Save Plaid config
  useEffect(() => {
    if (plaidConfig.clientId) {
      localStorage.setItem('plaidConfig', JSON.stringify(plaidConfig));
    }
  }, [plaidConfig]);

  // Save Plaid connections
  useEffect(() => {
    localStorage.setItem('plaidConnections', JSON.stringify(plaidConnections));
  }, [plaidConnections]);

  // Load budgets from localStorage
  useEffect(() => {
    const savedBudgets = localStorage.getItem('budgets');
    const savedIncome = localStorage.getItem('monthlyIncome');
    if (savedBudgets) {
      try { setBudgets(JSON.parse(savedBudgets)); } catch (e) {}
    }
    if (savedIncome) {
      setMonthlyIncome(parseFloat(savedIncome) || 0);
    }
  }, []);

  // Save budgets
  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  // Save monthly income
  useEffect(() => {
    localStorage.setItem('monthlyIncome', monthlyIncome.toString());
  }, [monthlyIncome]);

  const openTradePanel = (symbol, side = 'buy') => {
    setSelectedStock(symbol.toUpperCase());
    setTradeSide(side);
    setTradeQty(1);
    setShowTradePanel(true);
    setSearchQuery('');
  };

  const executeTrade = async (suggestion, isAuto = false) => {
    const symbol = suggestion.symbol || selectedStock;
    const qty = suggestion.suggestedQty || tradeQty;
    const side = suggestion.action === 'BUY' ? 'buy' : (suggestion.action ? 'sell' : tradeSide);

    setExecutingTrade(symbol);

    const tradeRecord = {
      id: Date.now(),
      symbol,
      side,
      qty,
      price: suggestion.currentPrice || 150,
      timestamp: new Date().toISOString(),
      auto: isAuto,
      confidence: suggestion.confidence,
      status: 'pending'
    };

    if (mode === 'demo') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockPrice = suggestion.currentPrice || (150 + Math.random() * 100);

      if (side === 'buy') {
        setPositions(prev => {
          const existing = prev.find(p => p.symbol === symbol);
          if (existing) {
            const newQty = parseFloat(existing.qty) + qty;
            return prev.map(p => p.symbol === symbol ? { ...p, qty: String(newQty) } : p);
          }
          return [...prev, {
            symbol, qty: String(qty),
            avg_entry_price: mockPrice.toFixed(2), current_price: mockPrice.toFixed(2),
            market_value: (qty * mockPrice).toFixed(2), unrealized_pl: '0.00', unrealized_plpc: '0'
          }];
        });
      } else {
        setPositions(prev => prev.map(p => {
          if (p.symbol === symbol) {
            const newQty = Math.max(0, parseFloat(p.qty) - qty);
            return newQty > 0 ? { ...p, qty: String(newQty) } : null;
          }
          return p;
        }).filter(Boolean));
      }

      tradeRecord.status = 'filled';
      tradeRecord.price = mockPrice;
      setTradeHistory(prev => [tradeRecord, ...prev].slice(0, 50));
      setTradesToday(prev => prev + 1);

      if (!isAuto) {
        setTradeConfirmation({ success: true, message: `Demo: ${side.toUpperCase()} ${qty} shares of ${symbol}` });
      }
      setSuggestions(prev => prev.filter(s => s.symbol !== symbol));
    } else {
      try {
        const res = await fetch('/api/alpaca/trade', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apiKey, secretKey, symbol, qty, side }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Trade failed');
        }

        tradeRecord.status = 'filled';
        setTradeHistory(prev => [tradeRecord, ...prev].slice(0, 50));
        setTradesToday(prev => prev + 1);

        if (!isAuto) {
          setTradeConfirmation({ success: true, message: `${side.toUpperCase()} order placed: ${qty} shares of ${symbol}` });
        }
        setSuggestions(prev => prev.filter(s => s.symbol !== symbol));
        await refreshData();
      } catch (err) {
        tradeRecord.status = 'failed';
        tradeRecord.error = err.message;
        setTradeHistory(prev => [tradeRecord, ...prev].slice(0, 50));
        if (!isAuto) {
          setTradeConfirmation({ success: false, message: err.message });
        }
      }
    }

    setExecutingTrade(null);
    if (!isAuto) setShowTradePanel(false);
  };

  const executeQuickTrade = () => executeTrade({ suggestedQty: tradeQty, action: tradeSide === 'buy' ? 'BUY' : 'SELL' });

  const filteredStocks = searchQuery.length > 0 ? POPULAR_STOCKS.filter(s => s.includes(searchQuery.toUpperCase())) : POPULAR_STOCKS;

  const portfolioMetrics = account ? {
    totalValue: parseFloat(account.equity),
    buyingPower: parseFloat(account.buying_power),
    dayPL: parseFloat(account.equity) - parseFloat(account.last_equity),
    dayPLPercent: ((parseFloat(account.equity) - parseFloat(account.last_equity)) / parseFloat(account.last_equity)) * 100,
    totalPositions: positions.length,
  } : null;

  const sectorAllocation = positions.reduce((acc, pos) => {
    const sectorMap = { 'AAPL': 'Tech', 'MSFT': 'Tech', 'GOOGL': 'Tech', 'NVDA': 'Tech', 'JPM': 'Finance', 'JNJ': 'Health', 'META': 'Tech', 'AMD': 'Tech' };
    const sector = sectorMap[pos.symbol] || 'Other';
    acc[sector] = (acc[sector] || 0) + parseFloat(pos.market_value);
    return acc;
  }, {});
  const pieData = Object.entries(sectorAllocation).map(([name, value]) => ({ name, value }));

  // Authentication Screen
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">AI Portfolio Manager</h1>
            <p className="text-slate-400">Family Finance Command Center</p>
          </div>

          {/* Auth Mode Toggle */}
          <div className="flex bg-slate-700/50 rounded-lg p-1 mb-6">
            <button
              onClick={() => { setAuthMode('login'); setAuthError(''); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                authMode === 'login' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthMode('signup'); setAuthError(''); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                authMode === 'signup' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
                <input
                  type="text"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Andrew"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {authMode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Household Code <span className="text-slate-500">(optional - join existing)</span>
                </label>
                <input
                  type="text"
                  value={authHouseholdCode}
                  onChange={(e) => setAuthHouseholdCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                  placeholder="ABC123"
                  maxLength={6}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Have a code from your spouse? Enter it to share finances.
                </p>
              </div>
            )}

            {authError && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-3 text-red-300 text-sm">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {authLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : authMode === 'login' ? (
                <><LogIn className="w-5 h-5" /> Sign In</>
              ) : (
                <><UserPlus className="w-5 h-5" /> Create Account</>
              )}
            </button>
          </form>

          {authMode === 'signup' && (
            <p className="text-xs text-slate-500 text-center mt-4">
              Create an account to save your data and share with family members.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Connection Screen
  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">AI Portfolio Manager</h1>
            <p className="text-slate-400">Autonomous trading powered by AI</p>
          </div>

          <div className="space-y-4">
            <button onClick={startDemoMode} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-4 rounded-xl flex items-center justify-center gap-3">
              <Play className="w-5 h-5" /> Launch Demo Mode
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-600"></div></div>
              <div className="relative flex justify-center"><span className="px-4 bg-slate-800 text-slate-400 text-sm">or connect Alpaca</span></div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">API Key ID</label>
                <input type="text" value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="PK..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Secret Key</label>
                <div className="relative">
                  <input type={showSecret ? 'text' : 'password'} value={secretKey} onChange={(e) => setSecretKey(e.target.value)} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 pr-12 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your secret key" />
                  <button type="button" onClick={() => setShowSecret(!showSecret)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                    {showSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {error && <div className="bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-3 text-red-300 text-sm">{error}</div>}
              <button onClick={connectLive} disabled={loading} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />} Connect Paper Trading
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main App
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">AI Portfolio Manager</h1>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${mode === 'demo' ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'}`}>
                    {mode === 'demo' ? 'Demo' : 'Live Paper'}
                  </span>
                  {autoTradeSettings.enabled && (
                    <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${circuitBreakerTripped ? 'bg-red-500/20 text-red-400' : 'bg-purple-500/20 text-purple-400'}`}>
                      <Bot className="w-3 h-3" /> {circuitBreakerTripped ? 'Stopped' : 'Auto'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <nav className="flex gap-1 overflow-x-auto">
              {['overview', 'spending', 'partnership', 'dashboard', 'ai-arena', 'research', 'trade', 'suggestions', 'history', 'settings'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-2 rounded-lg font-medium transition-all capitalize whitespace-nowrap text-sm ${activeTab === tab ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}>
                  {tab === 'ai-arena' ? '🤖 AI Arena' : tab === 'partnership' ? '🤝 Partnership' : tab}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {/* Household Share Button */}
              {session?.user && (
                <div className="relative">
                  <button
                    onClick={() => setShowHouseholdShare(!showHouseholdShare)}
                    className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 flex items-center gap-1"
                    title="Share with family"
                  >
                    <Users className="w-4 h-4" />
                    {householdData?.members?.length > 1 && (
                      <span className="text-xs">{householdData.members.length}</span>
                    )}
                  </button>
                  {showHouseholdShare && (
                    <div className="absolute right-0 top-full mt-2 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-4 z-50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-white flex items-center gap-2">
                          <Users className="w-4 h-4 text-purple-400" /> Household
                        </h4>
                        <button onClick={() => setShowHouseholdShare(false)} className="text-slate-400 hover:text-white">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="mb-4">
                        <p className="text-xs text-slate-400 mb-1">Share code with family:</p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 bg-slate-700 px-3 py-2 rounded text-purple-400 font-mono">
                            {session.user.householdCode}
                          </code>
                          <button
                            onClick={copyHouseholdCode}
                            className="p-2 bg-slate-700 hover:bg-slate-600 rounded text-slate-300"
                          >
                            {copiedCode ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="border-t border-slate-700 pt-3">
                        <p className="text-xs text-slate-400 mb-2">Members:</p>
                        <div className="space-y-1">
                          {householdData?.members?.map((member, i) => (
                            <div key={member.email} className="flex items-center gap-2 text-sm">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                member.email === session.user.email ? 'bg-blue-500 text-white' : 'bg-slate-600 text-slate-300'
                              }`}>
                                {member.name?.[0]?.toUpperCase() || '?'}
                              </div>
                              <span className="text-slate-300">{member.name}</span>
                              {member.email === session.user.email && (
                                <span className="text-xs text-slate-500">(you)</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* User Menu */}
              {session?.user && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {session.user.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span className="text-sm text-slate-300 hidden sm:inline">{session.user.name}</span>
                  <button
                    onClick={handleSignOut}
                    className="p-1 text-slate-400 hover:text-red-400"
                    title="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}

              {mode === 'live' && (
                <button onClick={refreshData} disabled={loading} className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300">
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              )}
              <button onClick={() => { setConnected(false); setMode(null); }} className="px-3 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-sm">Disconnect</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Circuit Breaker Warning */}
        {circuitBreakerTripped && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-center gap-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <div className="flex-1">
              <h3 className="font-bold text-red-400">Circuit Breaker Triggered</h3>
              <p className="text-red-300 text-sm">Auto-trading has been paused due to exceeding daily loss limit.</p>
            </div>
            <button onClick={() => setCircuitBreakerTripped(false)} className="px-4 py-2 bg-red-500/30 hover:bg-red-500/50 text-red-300 rounded-lg text-sm">Reset</button>
          </div>
        )}

        {/* OVERVIEW TAB - Phase 3: Net Worth & All Accounts */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Net Worth Header */}
            <div className="bg-gradient-to-r from-indigo-500/10 to-violet-500/10 rounded-xl border border-indigo-500/30 p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">True Net Worth</p>
                  <p className={`text-4xl font-bold ${calculateTrueNetWorth() >= 0 ? 'text-white' : 'text-red-400'}`}>
                    ${calculateTrueNetWorth().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="text-green-400">Assets: ${calculateNetWorth().toLocaleString()}</span>
                    <span className="text-red-400">Debts: ${calculateTotalDebts().toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={getFinancialAdvice}
                    disabled={advisorLoading}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                  >
                    {advisorLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                    Get Advice
                  </button>
                  <select
                    value={digestPeriod}
                    onChange={(e) => setDigestPeriod(e.target.value)}
                    className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                  <button
                    onClick={generateDigest}
                    disabled={digestLoading}
                    className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                  >
                    {digestLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                    Generate Digest
                  </button>
                </div>
              </div>
            </div>

            {/* Digest Display */}
            {digest && (
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Bell className="w-5 h-5 text-indigo-400" /> {digest.periodLabel} Digest
                  </h3>
                  <span className="text-xs text-slate-500">{new Date(digest.generatedAt).toLocaleString()}</span>
                </div>
                <div className="p-6 space-y-6">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <p className="text-slate-400 text-xs mb-1">Net Worth Change</p>
                      <p className={`text-xl font-bold ${digest.summary.netWorthChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {digest.summary.netWorthChange >= 0 ? '+' : ''}${digest.summary.netWorthChange.toFixed(2)}
                      </p>
                      <p className={`text-xs ${digest.summary.netWorthChangePct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {digest.summary.netWorthChangePct >= 0 ? '+' : ''}{digest.summary.netWorthChangePct.toFixed(2)}%
                      </p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <p className="text-slate-400 text-xs mb-1">Portfolio P&L</p>
                      <p className={`text-xl font-bold ${digest.summary.portfolioPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {digest.summary.portfolioPL >= 0 ? '+' : ''}${digest.summary.portfolioPL.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <p className="text-slate-400 text-xs mb-1">Total Accounts</p>
                      <p className="text-xl font-bold text-white">{digest.summary.totalAccounts}</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <p className="text-slate-400 text-xs mb-1">Positions</p>
                      <p className="text-xl font-bold text-white">{digest.summary.totalPositions}</p>
                    </div>
                  </div>

                  {/* Insights */}
                  {digest.insights && digest.insights.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-3">Key Insights</h4>
                      <div className="space-y-2">
                        {digest.insights.map((insight, i) => (
                          <div key={i} className={`p-3 rounded-lg border ${
                            insight.type === 'positive' ? 'bg-green-500/10 border-green-500/30' :
                            insight.type === 'warning' ? 'bg-red-500/10 border-red-500/30' :
                            insight.type === 'info' ? 'bg-blue-500/10 border-blue-500/30' :
                            'bg-slate-700/30 border-slate-600'
                          }`}>
                            <div className="flex items-start gap-3">
                              {insight.type === 'positive' ? <TrendingUp className="w-5 h-5 text-green-400 mt-0.5" /> :
                               insight.type === 'warning' ? <TrendingDown className="w-5 h-5 text-red-400 mt-0.5" /> :
                               insight.type === 'info' ? <Activity className="w-5 h-5 text-blue-400 mt-0.5" /> :
                               <Minus className="w-5 h-5 text-slate-400 mt-0.5" />}
                              <div>
                                <p className="font-medium text-white text-sm">{insight.title}</p>
                                <p className="text-slate-400 text-xs mt-1">{insight.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Items */}
                  {digest.actionItems && digest.actionItems.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-3">Action Items</h4>
                      <div className="space-y-2">
                        {digest.actionItems.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                            <div className={`w-2 h-2 rounded-full ${
                              item.priority === 'high' ? 'bg-red-400' :
                              item.priority === 'medium' ? 'bg-amber-400' : 'bg-slate-400'
                            }`} />
                            <span className="text-sm text-slate-300">{item.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Top Movers */}
                  {digest.topMovers && (digest.topMovers.gainers?.length > 0 || digest.topMovers.losers?.length > 0) && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-green-400 mb-2">Top Gainers</h4>
                        {digest.topMovers.gainers?.map((g, i) => (
                          <div key={i} className="flex justify-between text-sm py-1">
                            <span className="text-white">{g.symbol}</span>
                            <span className="text-green-400">+{g.change}%</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-red-400 mb-2">Underperformers</h4>
                        {digest.topMovers.losers?.map((l, i) => (
                          <div key={i} className="flex justify-between text-sm py-1">
                            <span className="text-white">{l.symbol}</span>
                            <span className="text-red-400">{l.change}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AI Financial Advisor */}
            {advisor && (
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-emerald-500/30 overflow-hidden">
                <div className="p-6 border-b border-slate-700 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-emerald-400" /> AI Financial Advisor
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-400">Health Score:</span>
                    <span className={`text-2xl font-bold ${
                      advisor.analysis?.healthScore >= 80 ? 'text-green-400' :
                      advisor.analysis?.healthScore >= 60 ? 'text-amber-400' : 'text-red-400'
                    }`}>{advisor.analysis?.healthScore || 0}/100</span>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  {/* Recommendations */}
                  {advisor.recommendations && advisor.recommendations.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-3">Recommendations</h4>
                      <div className="space-y-3">
                        {advisor.recommendations.slice(0, 4).map((rec, i) => (
                          <div key={i} className={`p-4 rounded-lg border ${
                            rec.priority === 'high' ? 'bg-red-500/10 border-red-500/30' :
                            rec.priority === 'medium' ? 'bg-amber-500/10 border-amber-500/30' :
                            'bg-slate-700/30 border-slate-600'
                          }`}>
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${
                                rec.priority === 'high' ? 'bg-red-400' :
                                rec.priority === 'medium' ? 'bg-amber-400' : 'bg-green-400'
                              }`} />
                              <div className="flex-1">
                                <p className="font-medium text-white">{rec.title}</p>
                                <p className="text-sm text-slate-400 mt-1">{rec.description}</p>
                                {rec.action && <p className="text-sm text-emerald-400 mt-2">→ {rec.action}</p>}
                                {rec.impact && <p className="text-xs text-slate-500 mt-1">{rec.impact}</p>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Debt Strategy */}
                  {advisor.debtStrategy?.hasDebt && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-3">Debt Payoff Strategy</h4>
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-white font-medium">Recommended: {advisor.debtStrategy.recommendedStrategy === 'avalanche' ? 'Avalanche Method' : 'Snowball Method'}</span>
                          <span className="text-sm text-slate-400">Avg Rate: {advisor.debtStrategy.weightedRate?.toFixed(1)}%</span>
                        </div>
                        <p className="text-sm text-slate-400 mb-3">{advisor.debtStrategy.strategyReason}</p>
                        <div className="space-y-2">
                          <p className="text-xs text-slate-500">Payoff Order:</p>
                          {(advisor.debtStrategy.recommendedStrategy === 'avalanche'
                            ? advisor.debtStrategy.avalancheOrder
                            : advisor.debtStrategy.snowballOrder
                          )?.slice(0, 3).map((d, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <span className="text-slate-300">{i + 1}. {d.name}</span>
                              <span className="text-slate-400">${d.balance?.toLocaleString()} @ {d.rate}%</span>
                            </div>
                          ))}
                        </div>
                        {advisor.debtStrategy.extraPaymentSuggestion > 0 && (
                          <p className="text-emerald-400 text-sm mt-3">
                            💡 {advisor.debtStrategy.payoffAcceleration}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Investment Opportunities */}
                  {advisor.investmentStrategy && advisor.investmentStrategy.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-3">Investment Opportunities</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {advisor.investmentStrategy.map((opp, i) => (
                          <div key={i} className="bg-slate-700/30 rounded-lg p-3">
                            <p className="font-medium text-white text-sm">{opp.title}</p>
                            <p className="text-xs text-slate-400 mt-1">{opp.description}</p>
                            {opp.amount && <p className="text-xs text-blue-400 mt-1">Up to ${opp.amount.toLocaleString()}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Debts Section */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-red-400" /> Debts & Liabilities
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">Total: ${calculateTotalDebts().toLocaleString()}</p>
                </div>
                <button
                  onClick={() => setShowAddDebt(true)}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Debt
                </button>
              </div>
              <div className="p-4">
                {debts.length > 0 ? (
                  <div className="space-y-3">
                    {debts.map((debt) => {
                      const DebtIcon = getDebtIcon(debt.type);
                      const monthlyInterest = (debt.balance * (debt.interestRate / 100) / 12);
                      return (
                        <div key={debt.id} className="bg-slate-700/30 rounded-xl border border-slate-600 p-4 group relative">
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button onClick={() => setEditingDebt(debt)} className="p-1.5 bg-slate-600 hover:bg-slate-500 rounded text-slate-300">
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button onClick={() => deleteDebt(debt.id)} className="p-1.5 bg-red-500/20 hover:bg-red-500/30 rounded text-red-400">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-500/20 rounded-lg">
                              <DebtIcon className="w-6 h-6 text-red-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-white">{debt.name}</p>
                                <span className="text-xs px-2 py-0.5 bg-slate-600 rounded text-slate-300">{debt.institution}</span>
                              </div>
                              <div className="flex items-center gap-4 mt-1 text-sm">
                                <span className="text-red-400 font-semibold">${debt.balance.toLocaleString()}</span>
                                <span className="text-slate-400">{debt.interestRate}% APR</span>
                                <span className="text-slate-500">~${monthlyInterest.toFixed(0)}/mo interest</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-slate-400 text-xs">Min Payment</p>
                              <p className="text-white font-medium">${debt.minimumPayment}/mo</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No debts tracked. Add mortgage, student loans, etc.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Accounts Grid */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-amber-400" /> All Accounts
                </h3>
                <button
                  onClick={() => setShowAddAccount(true)}
                  className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Account
                </button>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Alpaca Paper Trading Account */}
                {account && (
                  <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/50 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Alpaca Paper Trading</p>
                        <p className="text-xs text-slate-400">Investment • Alpaca</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      ${parseFloat(account.equity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">Connected via API</p>
                  </div>
                )}

                {/* Manual Accounts */}
                {manualAccounts.map((acc) => {
                  const IconComponent = getAccountIcon(acc.type);
                  const colorClass = getAccountColor(acc.type);

                  return (
                    <div
                      key={acc.id}
                      className="bg-slate-700/30 rounded-xl border border-slate-600 p-4 group relative"
                    >
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button
                          onClick={() => setEditingAccount(acc)}
                          className="p-1.5 bg-slate-600 hover:bg-slate-500 rounded text-slate-300"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => deleteAccount(acc.id)}
                          className="p-1.5 bg-red-500/20 hover:bg-red-500/30 rounded text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${colorClass}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{acc.name}</p>
                          <p className="text-xs text-slate-400 capitalize">{acc.type} • {acc.institution}</p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        ${acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        Updated {new Date(acc.lastUpdated).toLocaleDateString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Account Breakdown by Type */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['retirement', 'investment', 'checking', 'savings'].map(type => {
                const total = manualAccounts
                  .filter(a => a.type === type)
                  .reduce((sum, a) => sum + a.balance, 0) +
                  (type === 'investment' && account ? parseFloat(account.equity) : 0);
                const IconComponent = getAccountIcon(type);
                const colorClass = getAccountColor(type);

                return (
                  <div key={type} className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-1.5 rounded ${colorClass}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-slate-400 text-sm capitalize">{type}</span>
                    </div>
                    <p className="text-xl font-bold text-white">
                      ${total.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && portfolioMetrics && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg"><DollarSign className="w-5 h-5 text-blue-400" /></div>
                  <span className="text-slate-400 text-sm">Portfolio Value</span>
                </div>
                <p className="text-2xl font-bold text-white">${portfolioMetrics.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${portfolioMetrics.dayPL >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    {portfolioMetrics.dayPL >= 0 ? <TrendingUp className="w-5 h-5 text-green-400" /> : <TrendingDown className="w-5 h-5 text-red-400" />}
                  </div>
                  <span className="text-slate-400 text-sm">Today's P&L</span>
                </div>
                <p className={`text-2xl font-bold ${portfolioMetrics.dayPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {portfolioMetrics.dayPL >= 0 ? '+' : ''}${portfolioMetrics.dayPL.toFixed(2)}
                </p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg"><Bot className="w-5 h-5 text-purple-400" /></div>
                  <span className="text-slate-400 text-sm">Trades Today</span>
                </div>
                <p className="text-2xl font-bold text-white">{tradesToday} <span className="text-sm text-slate-400">/ {autoTradeSettings.maxTradesPerDay}</span></p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-amber-500/20 rounded-lg"><Zap className="w-5 h-5 text-amber-400" /></div>
                  <span className="text-slate-400 text-sm">Buying Power</span>
                </div>
                <p className="text-2xl font-bold text-white">${portfolioMetrics.buyingPower.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-blue-400" /> Performance</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={portfolioHistory}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} />
                      <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Circle className="w-5 h-5 text-purple-400" /> Allocation</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value">
                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {pieData.map((entry, i) => (
                    <div key={entry.name} className="flex items-center gap-1 text-xs">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-slate-400">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Holdings */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2"><Briefcase className="w-5 h-5 text-green-400" /> Holdings</h3>
                <button onClick={() => setActiveTab('trade')} className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" /> Trade
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Symbol</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Qty</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Price</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Value</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">P&L</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {positions.map((pos) => {
                      const pl = parseFloat(pos.unrealized_pl);
                      const plPct = parseFloat(pos.unrealized_plpc) * 100;
                      return (
                        <tr key={pos.symbol} className="hover:bg-slate-700/30">
                          <td className="px-6 py-4 font-medium text-white">{pos.symbol}</td>
                          <td className="px-6 py-4 text-right text-slate-300">{parseFloat(pos.qty).toFixed(0)}</td>
                          <td className="px-6 py-4 text-right text-slate-300">${parseFloat(pos.current_price).toFixed(2)}</td>
                          <td className="px-6 py-4 text-right text-slate-300">${parseFloat(pos.market_value).toLocaleString()}</td>
                          <td className={`px-6 py-4 text-right ${pl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {pl >= 0 ? '+' : ''}${pl.toFixed(2)} ({plPct.toFixed(1)}%)
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => openTradePanel(pos.symbol, 'sell')} className="text-red-400 hover:text-red-300 text-sm font-medium">Sell</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SPENDING TAB - Phase 7 */}
        {activeTab === 'spending' && (
          <div className="space-y-6">
            {/* Spending Header */}
            <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-xl border border-emerald-500/30 p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Spending Tracker</h2>
                    <p className="text-slate-400 text-sm">
                      {plaidConnections.length > 0
                        ? `${plaidConnections.length} bank${plaidConnections.length > 1 ? 's' : ''} connected`
                        : 'Connect your bank accounts to track spending'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {plaidConnections.length > 0 && (
                    <>
                      <select
                        value={transactionDateRange}
                        onChange={(e) => setTransactionDateRange(e.target.value)}
                        className="bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg text-sm"
                      >
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="60">Last 60 days</option>
                        <option value="90">Last 90 days</option>
                      </select>
                      <button
                        onClick={() => fetchTransactions()}
                        disabled={plaidLoading}
                        className="bg-slate-700 hover:bg-slate-600 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2"
                      >
                        <RefreshCw className={`w-4 h-4 ${plaidLoading ? 'animate-spin' : ''}`} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setShowPlaidSetup(true)}
                    className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Connect Bank
                  </button>
                </div>
              </div>
            </div>

            {/* Sub-navigation */}
            {plaidConnections.length > 0 && (
              <div className="flex gap-2 border-b border-slate-700 pb-2">
                {['overview', 'budgets', 'transactions', 'trips'].map((view) => (
                  <button
                    key={view}
                    onClick={() => setSpendingView(view)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                      spendingView === view
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    {view === 'trips' ? '✈️ Trips' : view}
                  </button>
                ))}
              </div>
            )}

            {/* No Connections State */}
            {plaidConnections.length === 0 && (
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-12 text-center">
                <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Connect Your Bank Accounts</h3>
                <p className="text-slate-400 mb-6 max-w-md mx-auto">
                  Securely connect your checking, savings, and credit cards to track spending, identify subscriptions, and get insights.
                </p>
                <button
                  onClick={() => setShowPlaidSetup(true)}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium px-6 py-3 rounded-xl flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-5 h-5" /> Get Started with Plaid
                </button>
                <p className="text-slate-500 text-xs mt-4">
                  Get free Plaid sandbox credentials at <a href="https://dashboard.plaid.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">dashboard.plaid.com</a>
                </p>
              </div>
            )}

            {/* Connected Banks */}
            {plaidConnections.length > 0 && (
              <>
                {/* OVERVIEW VIEW */}
                {spendingView === 'overview' && (
                  <>
                    {/* Summary Cards */}
                    {transactionsSummary && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
                      <p className="text-slate-400 text-xs mb-1">Total Spending</p>
                      <p className="text-xl font-bold text-red-400">-${transactionsSummary.totalSpending?.toLocaleString()}</p>
                      <p className="text-slate-500 text-xs mt-1">{transactionDateRange} days</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
                      <p className="text-slate-400 text-xs mb-1">Total Income</p>
                      <p className="text-xl font-bold text-green-400">+${transactionsSummary.totalIncome?.toLocaleString()}</p>
                      <p className="text-slate-500 text-xs mt-1">{transactionsSummary.totalTransactions} transactions</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
                      <p className="text-slate-400 text-xs mb-1">Net Cash Flow</p>
                      <p className={`text-xl font-bold ${transactionsSummary.netCashFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {transactionsSummary.netCashFlow >= 0 ? '+' : ''}${transactionsSummary.netCashFlow?.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
                      <p className="text-slate-400 text-xs mb-1">Top Category</p>
                      <p className="text-lg font-bold text-white">{transactionsSummary.topCategories?.[0]?.category || '-'}</p>
                      <p className="text-slate-500 text-xs mt-1">${transactionsSummary.topCategories?.[0]?.amount?.toLocaleString() || 0}</p>
                    </div>
                  </div>
                )}

                {/* Spending by Category */}
                {transactionsSummary?.topCategories?.length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Category Breakdown */}
                    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-emerald-400" /> Spending by Category
                      </h3>
                      <div className="space-y-3">
                        {transactionsSummary.topCategories.map((cat, i) => {
                          const pct = (cat.amount / transactionsSummary.totalSpending) * 100;
                          const colors = ['bg-emerald-500', 'bg-cyan-500', 'bg-purple-500', 'bg-amber-500', 'bg-pink-500', 'bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-indigo-500', 'bg-orange-500'];
                          return (
                            <div key={cat.category} className="group">
                              <div className="flex items-center justify-between mb-1">
                                <button
                                  onClick={() => setSelectedCategory(selectedCategory === cat.category ? null : cat.category)}
                                  className={`text-sm font-medium ${selectedCategory === cat.category ? 'text-emerald-400' : 'text-slate-300 hover:text-white'}`}
                                >
                                  {cat.category}
                                </button>
                                <span className="text-sm text-slate-400">${cat.amount.toLocaleString()}</span>
                              </div>
                              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div className={`h-full ${colors[i % colors.length]} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Top Merchants */}
                    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-amber-400" /> Top Merchants
                      </h3>
                      <div className="space-y-2">
                        {transactionsSummary.topMerchants?.slice(0, 8).map((m, i) => (
                          <div key={m.merchant} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-400">{i + 1}</span>
                              <span className="text-sm text-slate-300">{m.merchant}</span>
                            </div>
                            <span className="text-sm font-medium text-white">${m.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Daily Spending Chart */}
                {transactionsSummary?.dailySpending?.length > 0 && (
                  <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Daily Spending</h3>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={transactionsSummary.dailySpending}>
                          <defs>
                            <linearGradient id="spendingGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickFormatter={(d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                          <YAxis stroke="#64748b" fontSize={10} tickFormatter={(v) => `$${v}`} />
                          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} formatter={(v) => [`$${v}`, 'Spent']} />
                          <Area type="monotone" dataKey="amount" stroke="#10B981" strokeWidth={2} fill="url(#spendingGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Recurring/Subscriptions */}
                {recurringExpenses && (
                  <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Radio className="w-5 h-5 text-purple-400" /> Subscriptions & Recurring
                      </h3>
                      <div className="text-right">
                        <p className="text-sm text-slate-400">Monthly Total</p>
                        <p className="text-lg font-bold text-purple-400">${recurringExpenses.summary?.monthlySubscriptions?.toLocaleString()}/mo</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {recurringExpenses.subscriptions?.slice(0, 9).map(sub => (
                        <div key={sub.id} className="bg-slate-700/30 rounded-lg p-3 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-white">{sub.merchantName}</p>
                            <p className="text-xs text-slate-400">{sub.frequency}</p>
                          </div>
                          <p className="text-sm font-bold text-white">${sub.averageAmount?.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    {!recurringExpenses.subscriptions?.length && (
                      <p className="text-slate-400 text-center py-4">No recurring expenses detected yet</p>
                    )}
                  </div>
                )}

                {/* Transactions List */}
                <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                  <div className="p-4 border-b border-slate-700 flex items-center justify-between flex-wrap gap-4">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <History className="w-4 h-4 text-slate-400" /> Recent Transactions
                      {selectedCategory && (
                        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                          {selectedCategory}
                          <button onClick={() => setSelectedCategory(null)} className="ml-1">×</button>
                        </span>
                      )}
                    </h3>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search transactions..."
                        value={transactionSearch}
                        onChange={(e) => setTransactionSearch(e.target.value)}
                        className="bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white text-sm w-64 placeholder-slate-400"
                      />
                    </div>
                  </div>
                  {filteredTransactions.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-900/50 sticky top-0">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs text-slate-400">Date</th>
                            <th className="px-4 py-2 text-left text-xs text-slate-400">Description</th>
                            <th className="px-4 py-2 text-left text-xs text-slate-400">Category</th>
                            <th className="px-4 py-2 text-right text-xs text-slate-400">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                          {filteredTransactions.slice(0, 50).map((tx) => (
                            <tr key={tx.id} className="hover:bg-slate-700/30">
                              <td className="px-4 py-2 text-slate-400 text-xs">{new Date(tx.date).toLocaleDateString()}</td>
                              <td className="px-4 py-2">
                                <p className="text-white">{tx.merchantName || tx.name}</p>
                                {tx.merchantName && tx.merchantName !== tx.name && (
                                  <p className="text-xs text-slate-500">{tx.name}</p>
                                )}
                              </td>
                              <td className="px-4 py-2">
                                <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">{tx.primaryCategory}</span>
                              </td>
                              <td className={`px-4 py-2 text-right font-medium ${tx.isExpense ? 'text-red-400' : 'text-green-400'}`}>
                                {tx.isExpense ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-400">
                      {transactions.length === 0 ? (
                        <p>No transactions yet. Click refresh to load.</p>
                      ) : (
                        <p>No transactions match your search.</p>
                      )}
                    </div>
                  )}
                </div>
                  </>
                )}

                {/* BUDGETS VIEW */}
                {spendingView === 'budgets' && (
                  <>
                    {/* Income & Budget Setup */}
                    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <Target className="w-5 h-5 text-amber-400" /> Monthly Budget
                        </h3>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-400">Monthly Income:</span>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                              <input
                                type="number"
                                value={monthlyIncome || ''}
                                onChange={(e) => setMonthlyIncome(parseFloat(e.target.value) || 0)}
                                placeholder="5,000"
                                className="bg-slate-700/50 border border-slate-600 rounded-lg pl-7 pr-3 py-2 text-white w-32 text-sm"
                              />
                            </div>
                          </div>
                          {budgetAnalysis?.budgetSuggestions && Object.keys(budgets).length === 0 && (
                            <button
                              onClick={applyBudgetSuggestions}
                              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 px-3 py-2 rounded-lg text-sm flex items-center gap-2"
                            >
                              <Sparkles className="w-4 h-4" /> Auto-fill Budgets
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Insights & Anomalies */}
                      {budgetAnalysis?.insights?.length > 0 && (
                        <div className="mb-6 space-y-2">
                          {budgetAnalysis.insights.slice(0, 3).map((insight, i) => (
                            <div
                              key={i}
                              className={`p-3 rounded-lg flex items-start gap-3 ${
                                insight.type === 'warning' || insight.type === 'alert' ? 'bg-red-500/10 border border-red-500/20' :
                                insight.type === 'caution' ? 'bg-amber-500/10 border border-amber-500/20' :
                                insight.type === 'success' ? 'bg-green-500/10 border border-green-500/20' :
                                'bg-blue-500/10 border border-blue-500/20'
                              }`}
                            >
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                insight.type === 'warning' || insight.type === 'alert' ? 'bg-red-500/20 text-red-400' :
                                insight.type === 'caution' ? 'bg-amber-500/20 text-amber-400' :
                                insight.type === 'success' ? 'bg-green-500/20 text-green-400' :
                                'bg-blue-500/20 text-blue-400'
                              }`}>
                                {insight.type === 'success' ? '✓' : insight.type === 'warning' || insight.type === 'alert' ? '!' : 'i'}
                              </div>
                              <div>
                                <p className="text-sm text-white">{insight.message}</p>
                                {insight.action && <p className="text-xs text-slate-400 mt-1">{insight.action}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Budget Categories Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {budgetAnalysis?.categorySummary?.filter(c => c.category !== 'Income' && c.category !== 'Transfer').map((cat) => {
                          const budget = budgets[cat.category];
                          const pctUsed = budget ? (cat.amount / budget) * 100 : 0;
                          return (
                            <div
                              key={cat.category}
                              className={`bg-slate-700/30 rounded-lg p-4 border ${
                                budget && pctUsed > 100 ? 'border-red-500/50' :
                                budget && pctUsed > 80 ? 'border-amber-500/50' :
                                'border-slate-600/50'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{cat.icon}</span>
                                  <span className="text-sm font-medium text-white">{cat.category}</span>
                                </div>
                                {cat.trend && (
                                  <span className={`text-xs ${cat.trend === 'up' ? 'text-red-400' : cat.trend === 'down' ? 'text-green-400' : 'text-slate-400'}`}>
                                    {cat.trend === 'up' ? '↑' : cat.trend === 'down' ? '↓' : '→'}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-baseline justify-between mb-2">
                                <span className="text-xl font-bold text-white">${cat.amount.toLocaleString()}</span>
                                {budget && (
                                  <span className={`text-sm ${pctUsed > 100 ? 'text-red-400' : 'text-slate-400'}`}>
                                    / ${budget.toLocaleString()}
                                  </span>
                                )}
                              </div>
                              {budget && (
                                <div className="h-2 bg-slate-600 rounded-full overflow-hidden mb-2">
                                  <div
                                    className={`h-full rounded-full transition-all ${
                                      pctUsed > 100 ? 'bg-red-500' : pctUsed > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                                    }`}
                                    style={{ width: `${Math.min(pctUsed, 100)}%` }}
                                  />
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                                  <input
                                    type="number"
                                    value={budget || ''}
                                    onChange={(e) => updateBudget(cat.category, e.target.value)}
                                    placeholder={cat.monthlyAverage ? `Avg: ${Math.round(cat.monthlyAverage)}` : 'Set budget'}
                                    className="w-full bg-slate-600/50 border border-slate-500 rounded pl-5 pr-2 py-1 text-white text-sm"
                                  />
                                </div>
                                {budget && (
                                  <button
                                    onClick={() => removeBudget(cat.category)}
                                    className="text-red-400 hover:text-red-300 p-1"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Anomalies */}
                    {budgetAnalysis?.anomalies?.length > 0 && (
                      <div className="bg-slate-800/50 rounded-xl border border-amber-500/30 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-amber-400" /> Spending Anomalies
                        </h3>
                        <div className="space-y-3">
                          {budgetAnalysis.anomalies.map((anomaly, i) => (
                            <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${
                              anomaly.type === 'spike' ? 'bg-red-500/10' : 'bg-green-500/10'
                            }`}>
                              <div className="flex items-center gap-3">
                                <span className={`text-2xl ${anomaly.type === 'spike' ? '' : ''}`}>
                                  {anomaly.type === 'spike' ? '📈' : '📉'}
                                </span>
                                <div>
                                  <p className="text-sm font-medium text-white">{anomaly.message}</p>
                                </div>
                              </div>
                              <span className={`text-lg font-bold ${anomaly.type === 'spike' ? 'text-red-400' : 'text-green-400'}`}>
                                {anomaly.percentChange > 0 ? '+' : ''}{anomaly.percentChange}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* TRANSACTIONS VIEW */}
                {spendingView === 'transactions' && (
                  <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                    <div className="p-4 border-b border-slate-700 flex items-center justify-between flex-wrap gap-4">
                      <h3 className="font-semibold text-white flex items-center gap-2">
                        <History className="w-4 h-4 text-slate-400" /> All Transactions
                        <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">{transactions.length}</span>
                      </h3>
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedCategory || ''}
                          onChange={(e) => setSelectedCategory(e.target.value || null)}
                          className="bg-slate-700 border border-slate-600 text-white text-sm px-3 py-2 rounded-lg"
                        >
                          <option value="">All Categories</option>
                          {[...new Set(transactions.map(t => t.primaryCategory))].sort().map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search..."
                            value={transactionSearch}
                            onChange={(e) => setTransactionSearch(e.target.value)}
                            className="bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white text-sm w-48 placeholder-slate-400"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="max-h-[600px] overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-900/50 sticky top-0">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs text-slate-400">Date</th>
                            <th className="px-4 py-2 text-left text-xs text-slate-400">Description</th>
                            <th className="px-4 py-2 text-left text-xs text-slate-400">Category</th>
                            <th className="px-4 py-2 text-right text-xs text-slate-400">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                          {filteredTransactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-slate-700/30">
                              <td className="px-4 py-2 text-slate-400 text-xs">{new Date(tx.date).toLocaleDateString()}</td>
                              <td className="px-4 py-2">
                                <p className="text-white">{tx.merchantName || tx.name}</p>
                                {tx.merchantName && tx.merchantName !== tx.name && (
                                  <p className="text-xs text-slate-500">{tx.name}</p>
                                )}
                              </td>
                              <td className="px-4 py-2">
                                <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">{tx.primaryCategory}</span>
                              </td>
                              <td className={`px-4 py-2 text-right font-medium ${tx.isExpense ? 'text-red-400' : 'text-green-400'}`}>
                                {tx.isExpense ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TRIPS VIEW */}
                {spendingView === 'trips' && (
                  <div className="space-y-6">
                    {/* Trip Header */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        ✈️ Trip & Event Tracking
                      </h3>
                      <button
                        onClick={() => setShowAddTrip(true)}
                        className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> New Trip
                      </button>
                    </div>

                    {/* Trips List */}
                    {trips.length === 0 ? (
                      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-12 text-center">
                        <div className="text-4xl mb-4">🏝️</div>
                        <h4 className="text-lg font-semibold text-white mb-2">No Trips Yet</h4>
                        <p className="text-slate-400 mb-4">Track your vacation and event expenses by creating a trip.</p>
                        <button
                          onClick={() => setShowAddTrip(true)}
                          className="bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 px-4 py-2 rounded-lg"
                        >
                          Create Your First Trip
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Trip Cards */}
                        <div className="lg:col-span-1 space-y-3">
                          {trips.map(trip => (
                            <div
                              key={trip.id}
                              onClick={() => setSelectedTrip(trip)}
                              className={`bg-slate-800/50 rounded-xl border p-4 cursor-pointer transition-all ${
                                selectedTrip?.id === trip.id
                                  ? 'border-violet-500 ring-1 ring-violet-500'
                                  : 'border-slate-700 hover:border-slate-600'
                              }`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-white">{trip.name}</h4>
                                <button
                                  onClick={(e) => { e.stopPropagation(); deleteTrip(trip.id); }}
                                  className="text-red-400 hover:text-red-300 p-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                              <p className="text-xs text-slate-400 mb-2">
                                {trip.startDate && trip.endDate
                                  ? `${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()}`
                                  : 'No dates set'}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-300">
                                  {trip.transactionIds?.length || 0} expenses
                                </span>
                                {trip.budget > 0 && (
                                  <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                                    Budget: ${trip.budget.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Trip Details */}
                        <div className="lg:col-span-2">
                          {selectedTrip && tripAnalysis ? (
                            <div className="space-y-4">
                              {/* Trip Summary */}
                              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                                <h4 className="text-lg font-semibold text-white mb-4">{selectedTrip.name}</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div>
                                    <p className="text-xs text-slate-400">Total Spent</p>
                                    <p className="text-xl font-bold text-white">${tripAnalysis.totalSpent?.toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-400">Daily Average</p>
                                    <p className="text-xl font-bold text-violet-400">${tripAnalysis.dailyAverage?.toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-400">Duration</p>
                                    <p className="text-xl font-bold text-white">{tripAnalysis.durationDays} days</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-400">Expenses</p>
                                    <p className="text-xl font-bold text-white">{tripAnalysis.transactionCount}</p>
                                  </div>
                                </div>

                                {/* Budget Status */}
                                {tripAnalysis.budgetStatus && (
                                  <div className="mt-4 p-3 bg-slate-700/30 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm text-slate-300">Budget Progress</span>
                                      <span className={`text-sm font-medium ${
                                        tripAnalysis.budgetStatus.status === 'over' ? 'text-red-400' :
                                        tripAnalysis.budgetStatus.status === 'warning' ? 'text-amber-400' :
                                        'text-green-400'
                                      }`}>
                                        {tripAnalysis.budgetStatus.percentUsed}%
                                      </span>
                                    </div>
                                    <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
                                      <div
                                        className={`h-full rounded-full ${
                                          tripAnalysis.budgetStatus.status === 'over' ? 'bg-red-500' :
                                          tripAnalysis.budgetStatus.status === 'warning' ? 'bg-amber-500' :
                                          'bg-green-500'
                                        }`}
                                        style={{ width: `${Math.min(tripAnalysis.budgetStatus.percentUsed, 100)}%` }}
                                      />
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">
                                      ${tripAnalysis.budgetStatus.spent.toLocaleString()} of ${tripAnalysis.budgetStatus.budget.toLocaleString()}
                                      {tripAnalysis.budgetStatus.remaining > 0
                                        ? ` (${tripAnalysis.budgetStatus.remaining.toLocaleString()} remaining)`
                                        : ` (${Math.abs(tripAnalysis.budgetStatus.remaining).toLocaleString()} over)`}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Category Breakdown */}
                              {tripAnalysis.categoryBreakdown?.length > 0 && (
                                <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                                  <h5 className="text-sm font-semibold text-white mb-3">Spending by Category</h5>
                                  <div className="space-y-2">
                                    {tripAnalysis.categoryBreakdown.slice(0, 6).map((cat, i) => (
                                      <div key={cat.category} className="flex items-center gap-3">
                                        <div className="flex-1">
                                          <div className="flex justify-between text-sm mb-1">
                                            <span className="text-slate-300">{cat.category}</span>
                                            <span className="text-white">${cat.amount.toLocaleString()}</span>
                                          </div>
                                          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                              className="h-full bg-violet-500 rounded-full"
                                              style={{ width: `${cat.percent}%` }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Suggested Transactions */}
                              {tripSuggestions.length > 0 && (
                                <div className="bg-slate-800/50 rounded-xl border border-amber-500/30 p-6">
                                  <h5 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-amber-400" /> Suggested Expenses to Add
                                  </h5>
                                  <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {tripSuggestions.slice(0, 10).map(tx => (
                                      <div key={tx.id} className="flex items-center justify-between p-2 bg-slate-700/30 rounded-lg">
                                        <div className="flex-1">
                                          <p className="text-sm text-white">{tx.merchantName || tx.name}</p>
                                          <p className="text-xs text-slate-400">{tx.date} · {tx.primaryCategory}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-medium text-white">${Math.abs(tx.amount).toFixed(2)}</span>
                                          <button
                                            onClick={() => addTransactionToTrip(selectedTrip.id, tx.id)}
                                            className="p-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded"
                                          >
                                            <Plus className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Trip Transactions */}
                              {tripAnalysis.transactions?.length > 0 && (
                                <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                                  <h5 className="text-sm font-semibold text-white mb-3">Trip Expenses</h5>
                                  <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {tripAnalysis.transactions.map(tx => (
                                      <div key={tx.id} className="flex items-center justify-between p-2 bg-slate-700/30 rounded-lg">
                                        <div className="flex-1">
                                          <p className="text-sm text-white">{tx.merchantName || tx.name}</p>
                                          <p className="text-xs text-slate-400">{tx.date}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-medium text-red-400">-${Math.abs(tx.amount).toFixed(2)}</span>
                                          <button
                                            onClick={() => removeTransactionFromTrip(selectedTrip.id, tx.id)}
                                            className="p-1 text-slate-400 hover:text-red-400"
                                          >
                                            <X className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-12 text-center">
                              <p className="text-slate-400">Select a trip to view details</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Connected Accounts - Always visible */}
                <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-4">
                  <h3 className="text-sm font-semibold text-slate-400 mb-3">Connected Accounts</h3>
                  <div className="flex flex-wrap gap-3">
                    {plaidConnections.map(conn => (
                      <div key={conn.id} className="bg-slate-700/50 rounded-lg px-4 py-2 flex items-center gap-3">
                        <Building2 className="w-4 h-4 text-emerald-400" />
                        <div>
                          <p className="text-sm font-medium text-white">{conn.institutionName}</p>
                          <p className="text-xs text-slate-400">{conn.accounts?.length || 0} accounts</p>
                        </div>
                        <button onClick={() => removePlaidConnection(conn.id)} className="text-red-400 hover:text-red-300 ml-2">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* PARTNERSHIP TAB - Phase 6 */}
        {activeTab === 'partnership' && (
          <div className="space-y-6">
            {/* Partnership Header */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-teal-500/10 rounded-xl border border-cyan-500/30 p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white">{partnershipData.name}</h2>
                      <span className="text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full">
                        {partnershipData.ownershipPct}% ownership
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">
                      {partnershipData.quarterlyReports.length} quarterly reports
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddReport(true)}
                  className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Report
                </button>
              </div>
            </div>

            {/* Partnership Metrics */}
            {partnershipMetrics?.hasData && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
                  <p className="text-slate-400 text-xs mb-1">Your Share Value</p>
                  <p className="text-xl font-bold text-white">${partnershipMetrics.currentValue?.yourShare?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
                  <p className="text-slate-400 text-xs mb-1">Annualized Return</p>
                  <p className={`text-xl font-bold ${parseFloat(partnershipMetrics.performanceMetrics?.annualizedReturn) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {partnershipMetrics.performanceMetrics?.annualizedReturn}%
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
                  <p className="text-slate-400 text-xs mb-1">Distributions Received</p>
                  <p className="text-xl font-bold text-green-400">${partnershipMetrics.cumulativeMetrics?.yourDistributions?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
                  <p className="text-slate-400 text-xs mb-1">Sharpe Ratio</p>
                  <p className="text-xl font-bold text-white">{partnershipMetrics.performanceMetrics?.sharpeRatio}</p>
                </div>
              </div>
            )}

            {/* Performance Chart */}
            {partnershipMetrics?.navHistory?.length > 1 && (
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Your Share Value Over Time</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={partnershipMetrics.navHistory}>
                      <defs>
                        <linearGradient id="partnershipGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="period" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} formatter={(v) => [`$${v?.toLocaleString()}`, 'Value']} />
                      <Area type="monotone" dataKey="yourValue" stroke="#06B6D4" strokeWidth={2} fill="url(#partnershipGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Quarterly Reports */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-700">
                <h3 className="font-semibold text-white flex items-center gap-2"><FileText className="w-4 h-4 text-amber-400" /> Quarterly Reports</h3>
              </div>
              {partnershipData.quarterlyReports.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-900/50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs text-slate-400">Period</th>
                        <th className="px-4 py-2 text-right text-xs text-slate-400">NAV</th>
                        <th className="px-4 py-2 text-right text-xs text-slate-400">Your Share</th>
                        <th className="px-4 py-2 text-right text-xs text-slate-400">Return</th>
                        <th className="px-4 py-2 text-right text-xs text-slate-400">Distribution</th>
                        <th className="px-4 py-2 text-right text-xs text-slate-400"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {partnershipData.quarterlyReports.sort((a, b) => (b.year * 4 + b.quarter) - (a.year * 4 + a.quarter)).map((r) => (
                        <tr key={r.id} className="hover:bg-slate-700/30">
                          <td className="px-4 py-2 text-white">Q{r.quarter} {r.year}</td>
                          <td className="px-4 py-2 text-right text-slate-300">${r.totalNav?.toLocaleString()}</td>
                          <td className="px-4 py-2 text-right text-cyan-400">${(r.totalNav * partnershipData.ownershipPct / 100)?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                          <td className={`px-4 py-2 text-right ${r.netReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>{r.netReturn >= 0 ? '+' : ''}{r.netReturn}%</td>
                          <td className="px-4 py-2 text-right text-green-400">{r.distributions > 0 ? `$${(r.distributions * partnershipData.ownershipPct / 100).toFixed(0)}` : '-'}</td>
                          <td className="px-4 py-2 text-right"><button onClick={() => deleteReport(r.id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-3 h-3" /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400">
                  <p>No reports yet. Add quarterly reports to track performance.</p>
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-4 flex items-center gap-6 flex-wrap">
              <div>
                <label className="text-xs text-slate-400">Partnership Name</label>
                <input type="text" value={partnershipData.name} onChange={(e) => setPartnershipData(p => ({ ...p, name: e.target.value }))} className="block mt-1 bg-slate-700/50 border border-slate-600 rounded px-3 py-1.5 text-white text-sm w-48" />
              </div>
              <div>
                <label className="text-xs text-slate-400">Ownership %</label>
                <input type="number" step="0.1" value={partnershipData.ownershipPct} onChange={(e) => setPartnershipData(p => ({ ...p, ownershipPct: parseFloat(e.target.value) || 0 }))} className="block mt-1 bg-slate-700/50 border border-slate-600 rounded px-3 py-1.5 text-white text-sm w-24" />
              </div>
            </div>
          </div>
        )}

        {/* AI ARENA TAB - Phase 5 */}
        {activeTab === 'ai-arena' && (
          <div className="space-y-6">
            {/* Arena Header */}
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/30 p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">AI Trading Arena</h2>
                    <p className="text-slate-400 text-sm">Watch AI models compete with $100k paper portfolios</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={resetCompetition}
                    className="bg-slate-700 hover:bg-slate-600 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" /> Reset
                  </button>
                  <button
                    onClick={runAICompetition}
                    disabled={competitionRunning}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                  >
                    {competitionRunning ? (
                      <><RefreshCw className="w-4 h-4 animate-spin" /> Running...</>
                    ) : (
                      <><Play className="w-4 h-4" /> Run Round</>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Leaderboard */}
            {leaderboard.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-700">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-amber-400" /> Leaderboard
                  </h3>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {leaderboard.map((entry, i) => (
                      <div
                        key={entry.model}
                        className={`flex items-center gap-4 p-4 rounded-xl ${
                          i === 0 ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30' :
                          i === 1 ? 'bg-gradient-to-r from-slate-400/20 to-slate-300/20 border border-slate-400/30' :
                          i === 2 ? 'bg-gradient-to-r from-orange-600/20 to-orange-500/20 border border-orange-500/30' :
                          'bg-slate-700/30 border border-slate-600'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold ${
                          i === 0 ? 'bg-amber-500 text-amber-900' :
                          i === 1 ? 'bg-slate-300 text-slate-700' :
                          i === 2 ? 'bg-orange-500 text-orange-900' :
                          'bg-slate-600 text-slate-300'
                        }`}>
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="font-bold text-white">{entry.name}</span>
                            <span className="text-xs text-slate-400">{entry.provider}</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{entry.style}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-white">${entry.portfolioValue?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                          <p className={`text-sm ${entry.totalReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {entry.totalReturn >= 0 ? '+' : ''}{entry.totalReturn?.toFixed(2)}%
                          </p>
                        </div>
                        <div className="text-right text-sm">
                          <p className="text-slate-400">Trades: {entry.tradeCount}</p>
                          <p className="text-slate-400">Win: {entry.winRate?.toFixed(0)}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* AI Trader Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiTraders.map((trader) => {
                const profile = AI_PROFILES[trader.model];
                const decisions = aiDecisions[trader.model] || [];
                const returnPct = ((trader.portfolioValue - 100000) / 100000) * 100;

                return (
                  <div
                    key={trader.model}
                    className={`bg-slate-800/50 backdrop-blur-xl rounded-xl border overflow-hidden ${
                      trader.enabled ? 'border-slate-700' : 'border-slate-800 opacity-50'
                    }`}
                  >
                    <div className="p-4 border-b border-slate-700 flex items-center justify-between" style={{ borderLeftWidth: 4, borderLeftColor: profile.color }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: profile.color + '30' }}>
                          <Brain className="w-5 h-5" style={{ color: profile.color }} />
                        </div>
                        <div>
                          <p className="font-bold text-white">{profile.name}</p>
                          <p className="text-xs text-slate-400">{profile.provider} • {profile.style}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleTrader(trader.model)}
                        className={`p-2 rounded-lg ${trader.enabled ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-slate-400 text-xs">Portfolio Value</p>
                          <p className="text-2xl font-bold text-white">
                            ${trader.portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-400 text-xs">Return</p>
                          <p className={`text-xl font-bold ${returnPct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {returnPct >= 0 ? '+' : ''}{returnPct.toFixed(2)}%
                          </p>
                        </div>
                      </div>

                      {/* Mini performance chart */}
                      {trader.valueHistory.length > 1 && (
                        <div className="h-16 mb-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trader.valueHistory.map((v, i) => ({ i, v }))}>
                              <defs>
                                <linearGradient id={`gradient-${trader.model}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={profile.color} stopOpacity={0.3} />
                                  <stop offset="95%" stopColor={profile.color} stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <Area type="monotone" dataKey="v" stroke={profile.color} strokeWidth={2} fill={`url(#gradient-${trader.model})`} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      )}

                      {/* Recent Decisions */}
                      {decisions.length > 0 && (
                        <div>
                          <p className="text-xs text-slate-400 mb-2">Latest Decisions</p>
                          <div className="space-y-2">
                            {decisions.slice(0, 2).map((d, i) => (
                              <div key={i} className="bg-slate-700/30 rounded-lg p-2 text-sm">
                                <div className="flex items-center justify-between">
                                  <span className={`font-medium ${d.action === 'BUY' || d.action === 'ADD' ? 'text-green-400' : 'text-red-400'}`}>
                                    {d.action} {d.symbol}
                                  </span>
                                  <span className="text-slate-400">{d.confidence}%</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">{d.reasoning}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {decisions.length === 0 && trader.enabled && (
                        <p className="text-center text-slate-500 text-sm py-4">
                          Run a round to see decisions
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Competition Info */}
            <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-4">
              <h4 className="font-medium text-white mb-2">How It Works</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-slate-400">
                <div>
                  <p className="text-amber-400 font-medium">Claude</p>
                  <p>Balanced approach, focuses on risk-adjusted returns and diversification</p>
                </div>
                <div>
                  <p className="text-green-400 font-medium">GPT-4</p>
                  <p>Aggressive growth, momentum-focused with quick decision making</p>
                </div>
                <div>
                  <p className="text-red-400 font-medium">Grok</p>
                  <p>Contrarian plays, high conviction bets, unconventional picks</p>
                </div>
                <div>
                  <p className="text-blue-400 font-medium">Gemini</p>
                  <p>Data-driven conservative, pattern recognition, fundamental analysis</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RESEARCH TAB - Phase 2 */}
        {activeTab === 'research' && (
          <div className="space-y-6">
            {/* Research Header */}
            <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-xl border border-emerald-500/30 p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-xl flex items-center justify-center">
                    <Layers className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Research Center</h2>
                    <p className="text-slate-400 text-sm">
                      {lastResearchUpdate
                        ? `Last updated ${lastResearchUpdate.toLocaleTimeString()}`
                        : 'Multi-agent analysis pipeline'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={runResearchPipeline}
                  disabled={researchLoading}
                  className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white font-medium px-6 py-3 rounded-xl flex items-center gap-2 disabled:opacity-50"
                >
                  {researchLoading ? (
                    <><RefreshCw className="w-5 h-5 animate-spin" /> Analyzing...</>
                  ) : (
                    <><Radio className="w-5 h-5" /> Run Research</>
                  )}
                </button>
              </div>
            </div>

            {/* Holdings Ratings */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-700">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" /> Holdings Analysis
                </h3>
                <p className="text-slate-400 text-sm mt-1">AI-generated buy/sell/hold ratings for your positions</p>
              </div>
              <div className="p-4">
                {Object.keys(holdingsRatings).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {positions.map((pos) => {
                      const rating = holdingsRatings[pos.symbol];
                      if (!rating) return null;

                      const ratingColors = {
                        BUY: 'from-green-500/20 to-emerald-500/20 border-green-500/50',
                        SELL: 'from-red-500/20 to-rose-500/20 border-red-500/50',
                        HOLD: 'from-amber-500/20 to-yellow-500/20 border-amber-500/50'
                      };
                      const ratingTextColors = {
                        BUY: 'text-green-400',
                        SELL: 'text-red-400',
                        HOLD: 'text-amber-400'
                      };
                      const RatingIcon = rating.rating === 'BUY' ? ThumbsUp : rating.rating === 'SELL' ? ThumbsDown : Minus;

                      return (
                        <div
                          key={pos.symbol}
                          className={`bg-gradient-to-br ${ratingColors[rating.rating]} rounded-xl border p-4`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <span className="text-lg font-bold text-white">{pos.symbol}</span>
                              <div className="flex items-center gap-2 mt-1">
                                <RatingIcon className={`w-4 h-4 ${ratingTextColors[rating.rating]}`} />
                                <span className={`font-semibold ${ratingTextColors[rating.rating]}`}>
                                  {rating.rating}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-slate-400">Confidence</div>
                              <div className={`text-lg font-bold ${rating.confidence >= 80 ? 'text-green-400' : rating.confidence >= 60 ? 'text-amber-400' : 'text-slate-400'}`}>
                                {rating.confidence}%
                              </div>
                            </div>
                          </div>

                          {/* Score bars */}
                          <div className="space-y-2 mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400 w-16">Sentiment</span>
                              <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${rating.scores?.sentiment > 0 ? 'bg-green-400' : 'bg-red-400'}`}
                                  style={{ width: `${Math.abs(rating.scores?.sentiment || 0) * 50 + 50}%` }}
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400 w-16">Technical</span>
                              <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-400 rounded-full"
                                  style={{ width: `${rating.scores?.technical || 0}%` }}
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400 w-16">Risk</span>
                              <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-purple-400 rounded-full"
                                  style={{ width: `${rating.scores?.risk || 0}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Key reasoning */}
                          {rating.reasoning && rating.reasoning.length > 0 && (
                            <div className="text-xs text-slate-300 border-t border-slate-600/50 pt-2 mt-2">
                              {rating.reasoning[0]}
                            </div>
                          )}

                          {/* Action button */}
                          <button
                            onClick={() => openTradePanel(pos.symbol, rating.rating === 'BUY' ? 'buy' : 'sell')}
                            className={`w-full mt-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${
                              rating.rating === 'BUY' ? 'bg-green-500/30 hover:bg-green-500/50 text-green-300' :
                              rating.rating === 'SELL' ? 'bg-red-500/30 hover:bg-red-500/50 text-red-300' :
                              'bg-slate-600/30 hover:bg-slate-600/50 text-slate-300'
                            }`}
                          >
                            <Zap className="w-4 h-4" />
                            {rating.action || rating.rating}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Run research pipeline to get holdings analysis</p>
                  </div>
                )}
              </div>
            </div>

            {/* News Feed & Events Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* News Feed */}
              <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-700">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-blue-400" /> Latest News
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {newsFeed.length > 0 ? (
                    <div className="divide-y divide-slate-700">
                      {newsFeed.map((item) => (
                        <div key={item.id} className="p-4 hover:bg-slate-700/30 transition-colors">
                          <div className="flex items-start gap-3">
                            <div className={`mt-1 p-1.5 rounded ${
                              item.sentiment === 'positive' ? 'bg-green-500/20' :
                              item.sentiment === 'negative' ? 'bg-red-500/20' : 'bg-slate-500/20'
                            }`}>
                              {item.sentiment === 'positive' ? (
                                <TrendingUp className="w-4 h-4 text-green-400" />
                              ) : item.sentiment === 'negative' ? (
                                <TrendingDown className="w-4 h-4 text-red-400" />
                              ) : (
                                <Minus className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                                  {item.symbol}
                                </span>
                                <span className="text-xs text-slate-500">{item.source}</span>
                                <span className="text-xs text-slate-500">
                                  {new Date(item.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-slate-200 line-clamp-2">{item.headline}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-400">
                      <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Run research to load news feed</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-700">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-400" /> Upcoming Events
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {upcomingEvents.length > 0 ? (
                    <div className="divide-y divide-slate-700">
                      {upcomingEvents.map((event, i) => (
                        <div key={i} className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              event.type === 'earnings' ? 'bg-amber-500/20' :
                              event.type === 'dividend' ? 'bg-green-500/20' : 'bg-blue-500/20'
                            }`}>
                              {event.type === 'earnings' ? (
                                <FileText className={`w-4 h-4 text-amber-400`} />
                              ) : event.type === 'dividend' ? (
                                <DollarSign className="w-4 h-4 text-green-400" />
                              ) : (
                                <Users className="w-4 h-4 text-blue-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium px-2 py-0.5 bg-slate-600 text-slate-300 rounded">
                                  {event.symbol}
                                </span>
                              </div>
                              <p className="text-sm text-white mt-1">{event.title}</p>
                              <p className="text-xs text-slate-400 mt-1">
                                In {event.daysUntil} days
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-400">
                      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No upcoming events</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Research Pipeline Status */}
            {researchData && (
              <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400 text-sm">Pipeline Status:</span>
                    <div className="flex items-center gap-2">
                      {['Research', 'Analysis', 'Decision'].map((stage, i) => (
                        <div key={stage} className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                          <span className="text-xs text-slate-300">{stage}</span>
                          {i < 2 && <ChevronRight className="w-3 h-3 text-slate-500" />}
                        </div>
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">
                    {researchData.pipeline?.completedAt && new Date(researchData.pipeline.completedAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TRADE TAB */}
        {activeTab === 'trade' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Search className="w-5 h-5 text-blue-400" /> Quick Trade</h2>
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value.toUpperCase())} onKeyDown={(e) => { if (e.key === 'Enter' && searchQuery) openTradePanel(searchQuery); }} placeholder="Search stock symbol..." className="w-full bg-slate-700/50 border border-slate-600 rounded-xl pl-12 pr-4 py-4 text-white text-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                {searchQuery && (
                  <button onClick={() => openTradePanel(searchQuery)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    Trade {searchQuery}
                  </button>
                )}
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-3">Popular Stocks</p>
                <div className="flex flex-wrap gap-2">
                  {filteredStocks.map(symbol => (
                    <button key={symbol} onClick={() => openTradePanel(symbol)} className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg text-white font-medium transition-all">
                      {symbol}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-700">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2"><Briefcase className="w-5 h-5 text-green-400" /> Your Positions</h3>
              </div>
              <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {positions.length > 0 ? positions.map((pos) => {
                  const plPct = parseFloat(pos.unrealized_plpc) * 100;
                  return (
                    <div key={pos.symbol} className="bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/50 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-lg font-bold text-white">{pos.symbol}</span>
                        <span className={`text-sm ${plPct >= 0 ? 'text-green-400' : 'text-red-400'}`}>{plPct >= 0 ? '+' : ''}{plPct.toFixed(1)}%</span>
                      </div>
                      <div className="text-slate-400 text-sm mb-3">{parseFloat(pos.qty).toFixed(0)} @ ${parseFloat(pos.current_price).toFixed(2)}</div>
                      <div className="flex gap-2">
                        <button onClick={() => openTradePanel(pos.symbol, 'buy')} className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1">
                          <ArrowUpCircle className="w-4 h-4" /> Buy
                        </button>
                        <button onClick={() => openTradePanel(pos.symbol, 'sell')} className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1">
                          <ArrowDownCircle className="w-4 h-4" /> Sell
                        </button>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="col-span-full text-center py-8 text-slate-400">No positions yet</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SUGGESTIONS TAB */}
        {activeTab === 'suggestions' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/30 p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">AI Trade Suggestions</h2>
                    <p className="text-slate-400 text-sm">
                      {autoTradeSettings.enabled
                        ? `Auto-execute when confidence ≥ ${autoTradeSettings.confidenceThreshold}%`
                        : 'Auto-trading disabled'}
                    </p>
                  </div>
                </div>
                <button onClick={runAIAnalysis} disabled={analyzingMarket} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-xl flex items-center gap-2 disabled:opacity-50">
                  {analyzingMarket ? <><RefreshCw className="w-5 h-5 animate-spin" /> Analyzing...</> : <><Brain className="w-5 h-5" /> Run Analysis</>}
                </button>
              </div>
            </div>

            {suggestions.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {suggestions.map((s, i) => (
                  <div key={i} className={`bg-slate-800/50 rounded-xl border overflow-hidden ${s.confidence >= autoTradeSettings.confidenceThreshold && autoTradeSettings.enabled ? 'border-purple-500/50' : 'border-slate-700'}`}>
                    <div className="p-5 border-b border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-lg text-sm font-medium ${s.action === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {s.action.replace('_', ' ')}
                          </span>
                          <span className="text-xl font-bold text-white">{s.symbol}</span>
                          {s.confidence >= autoTradeSettings.confidenceThreshold && autoTradeSettings.enabled && (
                            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full flex items-center gap-1">
                              <Bot className="w-3 h-3" /> Auto
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Gauge className="w-4 h-4 text-slate-400" />
                          <span className={`font-bold ${s.confidence >= 85 ? 'text-green-400' : s.confidence >= 70 ? 'text-amber-400' : 'text-slate-400'}`}>
                            {s.confidence}%
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-slate-400">{s.sector} • {s.industry}</div>
                    </div>
                    <div className="p-5 border-b border-slate-700">
                      <ul className="space-y-1">
                        {s.analysis.reasons.map((r, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-slate-400">
                            <ChevronRight className="w-4 h-4 text-blue-400 flex-shrink-0" />{r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-5 bg-slate-900/30">
                      <div className="flex justify-between mb-3 text-sm">
                        <span className="text-slate-400">Qty: <span className="text-white font-medium">{s.suggestedQty}</span></span>
                        <span className="text-slate-400">Price: <span className="text-white font-medium">${s.currentPrice?.toFixed(2)}</span></span>
                      </div>
                      <button onClick={() => openTradePanel(s.symbol, s.action === 'BUY' ? 'buy' : 'sell')} className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${s.action === 'BUY' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}>
                        <Zap className="w-5 h-5" /> Execute {s.action.replace('_', ' ')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-12 text-center">
                <Brain className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Suggestions Yet</h3>
                <p className="text-slate-400 mb-6">Run AI analysis to get recommendations</p>
                <button onClick={runAIAnalysis} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl inline-flex items-center gap-2">
                  <Brain className="w-5 h-5" /> Run Analysis
                </button>
              </div>
            )}
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-700">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-400" /> Trade History
                </h3>
              </div>
              {tradeHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-900/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Symbol</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Side</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Qty</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Price</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-slate-400 uppercase">Type</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-slate-400 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {tradeHistory.map((trade) => (
                        <tr key={trade.id} className="hover:bg-slate-700/30">
                          <td className="px-6 py-4 text-slate-300 text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-slate-500" />
                              {new Date(trade.timestamp).toLocaleTimeString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-white">{trade.symbol}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${trade.side === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                              {trade.side.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-slate-300">{trade.qty}</td>
                          <td className="px-6 py-4 text-right text-slate-300">${trade.price?.toFixed(2)}</td>
                          <td className="px-6 py-4 text-center">
                            {trade.auto ? (
                              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs flex items-center justify-center gap-1">
                                <Bot className="w-3 h-3" /> Auto
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-slate-500/20 text-slate-400 rounded text-xs">Manual</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-2 py-1 rounded text-xs ${trade.status === 'filled' ? 'bg-green-500/20 text-green-400' : trade.status === 'failed' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                              {trade.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-400">
                  <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No trades yet. Execute some trades to see history here.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Auto-Trading Settings */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-400" /> Auto-Trading
              </h2>

              <div className="space-y-6">
                {/* Enable Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">Enable Auto-Trading</h3>
                    <p className="text-sm text-slate-400">Automatically execute high-confidence trades</p>
                  </div>
                  <button
                    onClick={() => setAutoTradeSettings(s => ({ ...s, enabled: !s.enabled }))}
                    className={`w-14 h-8 rounded-full transition-all flex items-center ${autoTradeSettings.enabled ? 'bg-purple-500 justify-end' : 'bg-slate-600 justify-start'}`}
                  >
                    <div className="w-6 h-6 bg-white rounded-full mx-1 shadow-md flex items-center justify-center">
                      <Power className={`w-3 h-3 ${autoTradeSettings.enabled ? 'text-purple-500' : 'text-slate-400'}`} />
                    </div>
                  </button>
                </div>

                {/* Confidence Threshold */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300">Confidence Threshold</label>
                    <span className="text-sm font-bold text-purple-400">{autoTradeSettings.confidenceThreshold}%</span>
                  </div>
                  <input
                    type="range" min="60" max="95" step="5"
                    value={autoTradeSettings.confidenceThreshold}
                    onChange={(e) => setAutoTradeSettings(s => ({ ...s, confidenceThreshold: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">Only auto-execute trades above this confidence level</p>
                </div>

                {/* Max Position Size */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300">Max Position Size</label>
                    <span className="text-sm font-bold text-blue-400">{autoTradeSettings.maxPositionPercent}%</span>
                  </div>
                  <input
                    type="range" min="1" max="20" step="1"
                    value={autoTradeSettings.maxPositionPercent}
                    onChange={(e) => setAutoTradeSettings(s => ({ ...s, maxPositionPercent: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">Maximum % of portfolio per auto-trade</p>
                </div>

                {/* Daily Loss Limit */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300">Daily Loss Limit (Circuit Breaker)</label>
                    <span className="text-sm font-bold text-red-400">{autoTradeSettings.dailyLossLimit}%</span>
                  </div>
                  <input
                    type="range" min="1" max="10" step="1"
                    value={autoTradeSettings.dailyLossLimit}
                    onChange={(e) => setAutoTradeSettings(s => ({ ...s, dailyLossLimit: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">Stop auto-trading if daily loss exceeds this %</p>
                </div>

                {/* Max Trades Per Day */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300">Max Trades Per Day</label>
                    <span className="text-sm font-bold text-amber-400">{autoTradeSettings.maxTradesPerDay}</span>
                  </div>
                  <input
                    type="range" min="1" max="50" step="1"
                    value={autoTradeSettings.maxTradesPerDay}
                    onChange={(e) => setAutoTradeSettings(s => ({ ...s, maxTradesPerDay: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Trading Preferences */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Settings className="w-5 h-5 text-blue-400" /> Trading Preferences</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Trading Style</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['conservative', 'balanced', 'aggressive'].map(s => (
                      <button key={s} onClick={() => setPreferences(p => ({ ...p, tradingStyle: s }))} className={`p-4 rounded-xl border capitalize ${preferences.tradingStyle === s ? 'border-blue-500 bg-blue-500/20 text-blue-400' : 'border-slate-600 bg-slate-700/30 text-slate-300'}`}>{s}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Risk Tolerance</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[{ v: 'conservative', i: Shield, l: 'Low' }, { v: 'moderate', i: Target, l: 'Med' }, { v: 'aggressive', i: Zap, l: 'High' }].map(({ v, i: Icon, l }) => (
                      <button key={v} onClick={() => setPreferences(p => ({ ...p, riskTolerance: v }))} className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${preferences.riskTolerance === v ? 'border-blue-500 bg-blue-500/20 text-blue-400' : 'border-slate-600 bg-slate-700/30 text-slate-300'}`}>
                        <Icon className="w-6 h-6" /><span className="text-sm">{l}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Sectors</label>
                  <div className="flex flex-wrap gap-2">
                    {['Technology', 'Healthcare', 'Financial', 'Consumer', 'Energy'].map(s => (
                      <button key={s} onClick={() => setPreferences(p => ({ ...p, sectors: p.sectors.includes(s) ? p.sectors.filter(x => x !== s) : [...p.sectors, s] }))} className={`px-4 py-2 rounded-lg text-sm font-medium ${preferences.sectors.includes(s) ? 'bg-blue-500 text-white' : 'bg-slate-700/50 text-slate-300'}`}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Summary */}
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/30 p-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><Check className="w-5 h-5 text-purple-400" /> Configuration Summary</h3>
              <p className="text-slate-300 text-sm">
                <strong className="text-white">{preferences.tradingStyle}</strong> trader with <strong className="text-white">{preferences.riskTolerance}</strong> risk.
                Auto-trading is <strong className={autoTradeSettings.enabled ? 'text-purple-400' : 'text-slate-400'}>{autoTradeSettings.enabled ? 'ON' : 'OFF'}</strong>
                {autoTradeSettings.enabled && <> at <strong className="text-purple-400">{autoTradeSettings.confidenceThreshold}%</strong> confidence threshold</>}.
                Max <strong className="text-blue-400">{autoTradeSettings.maxPositionPercent}%</strong> per position,
                circuit breaker at <strong className="text-red-400">{autoTradeSettings.dailyLossLimit}%</strong> daily loss.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Trade Panel Modal */}
      {showTradePanel && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Trade {selectedStock}</h3>
              <button onClick={() => setShowTradePanel(false)} className="text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2">
                <button onClick={() => setTradeSide('buy')} className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${tradeSide === 'buy' ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                  <ArrowUpCircle className="w-5 h-5" /> Buy
                </button>
                <button onClick={() => setTradeSide('sell')} className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${tradeSide === 'sell' ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                  <ArrowDownCircle className="w-5 h-5" /> Sell
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Quantity</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setTradeQty(Math.max(1, tradeQty - 1))} className="w-12 h-12 bg-slate-700 hover:bg-slate-600 rounded-xl text-white text-xl">-</button>
                  <input type="number" value={tradeQty} onChange={(e) => setTradeQty(Math.max(1, parseInt(e.target.value) || 1))} className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white text-center text-xl font-bold" />
                  <button onClick={() => setTradeQty(tradeQty + 1)} className="w-12 h-12 bg-slate-700 hover:bg-slate-600 rounded-xl text-white text-xl">+</button>
                </div>
              </div>
              <div className="flex gap-2">
                {[1, 5, 10, 25, 50, 100].map(q => (
                  <button key={q} onClick={() => setTradeQty(q)} className={`flex-1 py-2 rounded-lg text-sm font-medium ${tradeQty === q ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'}`}>{q}</button>
                ))}
              </div>
              <button onClick={executeQuickTrade} disabled={executingTrade} className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 ${tradeSide === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white disabled:opacity-50`}>
                {executingTrade ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                {tradeSide === 'buy' ? 'Buy' : 'Sell'} {tradeQty} {selectedStock}
              </button>
              <p className="text-slate-400 text-xs text-center">Market order • {mode === 'demo' ? 'Demo' : 'Paper Trading'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Account Modal */}
      {(showAddAccount || editingAccount) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingAccount ? 'Edit Account' : 'Add Account'}
              </h3>
              <button
                onClick={() => { setShowAddAccount(false); setEditingAccount(null); }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Account Name</label>
                <input
                  type="text"
                  value={editingAccount ? editingAccount.name : newAccount.name}
                  onChange={(e) => editingAccount
                    ? setEditingAccount({ ...editingAccount, name: e.target.value })
                    : setNewAccount({ ...newAccount, name: e.target.value })
                  }
                  placeholder="e.g., Roth IRA, Checking"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Account Type</label>
                <select
                  value={editingAccount ? editingAccount.type : newAccount.type}
                  onChange={(e) => editingAccount
                    ? setEditingAccount({ ...editingAccount, type: e.target.value })
                    : setNewAccount({ ...newAccount, type: e.target.value })
                  }
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                  <option value="investment">Investment</option>
                  <option value="retirement">Retirement (IRA/401k)</option>
                  <option value="crypto">Crypto (Ledger/Wallet)</option>
                  <option value="partnership">Investment Partnership</option>
                  <option value="credit">Credit Card</option>
                </select>
              </div>

              {/* Partnership-specific field */}
              {(editingAccount?.type === 'partnership' || newAccount.type === 'partnership') && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Ownership %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingAccount ? editingAccount.ownershipPct : newAccount.ownershipPct}
                    onChange={(e) => editingAccount
                      ? setEditingAccount({ ...editingAccount, ownershipPct: parseFloat(e.target.value) || 0 })
                      : setNewAccount({ ...newAccount, ownershipPct: e.target.value })
                    }
                    placeholder="e.g., 1.8"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Crypto-specific field */}
              {(editingAccount?.type === 'crypto' || newAccount.type === 'crypto') && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Holdings (e.g., BTC, ETH)</label>
                  <input
                    type="text"
                    value={editingAccount ? editingAccount.holdings : newAccount.holdings}
                    onChange={(e) => editingAccount
                      ? setEditingAccount({ ...editingAccount, holdings: e.target.value })
                      : setNewAccount({ ...newAccount, holdings: e.target.value })
                    }
                    placeholder="BTC, ETH, SOL"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Institution</label>
                <input
                  type="text"
                  value={editingAccount ? editingAccount.institution : newAccount.institution}
                  onChange={(e) => editingAccount
                    ? setEditingAccount({ ...editingAccount, institution: e.target.value })
                    : setNewAccount({ ...newAccount, institution: e.target.value })
                  }
                  placeholder="e.g., Fidelity, Chase"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Balance</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input
                    type="number"
                    value={editingAccount ? editingAccount.balance : newAccount.balance}
                    onChange={(e) => editingAccount
                      ? setEditingAccount({ ...editingAccount, balance: parseFloat(e.target.value) || 0 })
                      : setNewAccount({ ...newAccount, balance: e.target.value })
                    }
                    placeholder="0.00"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-8 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  if (editingAccount) {
                    updateAccount(editingAccount.id, editingAccount);
                  } else {
                    addAccount();
                  }
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 rounded-xl"
              >
                {editingAccount ? 'Save Changes' : 'Add Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Debt Modal */}
      {(showAddDebt || editingDebt) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingDebt ? 'Edit Debt' : 'Add Debt'}
              </h3>
              <button
                onClick={() => { setShowAddDebt(false); setEditingDebt(null); }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Debt Name</label>
                <input
                  type="text"
                  value={editingDebt ? editingDebt.name : newDebt.name}
                  onChange={(e) => editingDebt
                    ? setEditingDebt({ ...editingDebt, name: e.target.value })
                    : setNewDebt({ ...newDebt, name: e.target.value })
                  }
                  placeholder="e.g., Mortgage, Student Loan"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Debt Type</label>
                <select
                  value={editingDebt ? editingDebt.type : newDebt.type}
                  onChange={(e) => editingDebt
                    ? setEditingDebt({ ...editingDebt, type: e.target.value })
                    : setNewDebt({ ...newDebt, type: e.target.value })
                  }
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="mortgage">Mortgage</option>
                  <option value="student">Student Loan</option>
                  <option value="auto">Auto Loan</option>
                  <option value="credit">Credit Card</option>
                  <option value="personal">Personal Loan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Lender/Institution</label>
                <input
                  type="text"
                  value={editingDebt ? editingDebt.institution : newDebt.institution}
                  onChange={(e) => editingDebt
                    ? setEditingDebt({ ...editingDebt, institution: e.target.value })
                    : setNewDebt({ ...newDebt, institution: e.target.value })
                  }
                  placeholder="e.g., Wells Fargo, Nelnet"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Balance</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                    <input
                      type="number"
                      value={editingDebt ? editingDebt.balance : newDebt.balance}
                      onChange={(e) => editingDebt
                        ? setEditingDebt({ ...editingDebt, balance: parseFloat(e.target.value) || 0 })
                        : setNewDebt({ ...newDebt, balance: e.target.value })
                      }
                      placeholder="0"
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-8 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Interest Rate</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={editingDebt ? editingDebt.interestRate : newDebt.interestRate}
                      onChange={(e) => editingDebt
                        ? setEditingDebt({ ...editingDebt, interestRate: parseFloat(e.target.value) || 0 })
                        : setNewDebt({ ...newDebt, interestRate: e.target.value })
                      }
                      placeholder="0.0"
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 pr-8 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">%</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Minimum Payment (Monthly)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input
                    type="number"
                    value={editingDebt ? editingDebt.minimumPayment : newDebt.minimumPayment}
                    onChange={(e) => editingDebt
                      ? setEditingDebt({ ...editingDebt, minimumPayment: parseFloat(e.target.value) || 0 })
                      : setNewDebt({ ...newDebt, minimumPayment: e.target.value })
                    }
                    placeholder="0"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-8 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  if (editingDebt) {
                    updateDebt(editingDebt.id, editingDebt);
                  } else {
                    addDebt();
                  }
                }}
                className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-medium py-3 rounded-xl"
              >
                {editingDebt ? 'Save Changes' : 'Add Debt'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Quarterly Report Modal */}
      {showAddReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  Add Quarterly Report
                </h2>
                <button
                  onClick={() => setShowAddReport(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-slate-400 text-sm mt-1">Enter data from your partnership quarterly report</p>
            </div>
            <div className="p-6 space-y-4">
              {/* Period */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Quarter</label>
                  <select
                    value={newReport.quarter}
                    onChange={(e) => setNewReport({ ...newReport, quarter: parseInt(e.target.value) })}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value={1}>Q1</option>
                    <option value={2}>Q2</option>
                    <option value={3}>Q3</option>
                    <option value={4}>Q4</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Year</label>
                  <input
                    type="number"
                    value={newReport.year}
                    onChange={(e) => setNewReport({ ...newReport, year: parseInt(e.target.value) })}
                    placeholder="2025"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              {/* NAV Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Total NAV ($)</label>
                  <input
                    type="number"
                    value={newReport.totalNav}
                    onChange={(e) => setNewReport({ ...newReport, totalNav: e.target.value })}
                    placeholder="10,000,000"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">NAV per Unit ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newReport.navPerUnit}
                    onChange={(e) => setNewReport({ ...newReport, navPerUnit: e.target.value })}
                    placeholder="1,234.56"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              {/* Returns */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Gross Return (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newReport.grossReturn}
                    onChange={(e) => setNewReport({ ...newReport, grossReturn: e.target.value })}
                    placeholder="5.5"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Net Return (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newReport.netReturn}
                    onChange={(e) => setNewReport({ ...newReport, netReturn: e.target.value })}
                    placeholder="4.2"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              {/* Cash Flows */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Distributions ($)</label>
                  <input
                    type="number"
                    value={newReport.distributions}
                    onChange={(e) => setNewReport({ ...newReport, distributions: e.target.value })}
                    placeholder="0"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Capital Calls ($)</label>
                  <input
                    type="number"
                    value={newReport.capitalCalls}
                    onChange={(e) => setNewReport({ ...newReport, capitalCalls: e.target.value })}
                    placeholder="0"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              {/* Fees */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Management Fee ($)</label>
                  <input
                    type="number"
                    value={newReport.managementFee}
                    onChange={(e) => setNewReport({ ...newReport, managementFee: e.target.value })}
                    placeholder="0"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Performance Fee ($)</label>
                  <input
                    type="number"
                    value={newReport.performanceFee}
                    onChange={(e) => setNewReport({ ...newReport, performanceFee: e.target.value })}
                    placeholder="0"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Notes (optional)</label>
                <textarea
                  value={newReport.notes}
                  onChange={(e) => setNewReport({ ...newReport, notes: e.target.value })}
                  placeholder="Any highlights or concerns from the GP letter..."
                  rows={3}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                />
              </div>

              {/* Submit */}
              <button
                onClick={addQuarterlyReport}
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Trip Modal */}
      {showAddTrip && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  ✈️ New Trip
                </h2>
                <button onClick={() => setShowAddTrip(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-slate-400 text-sm mt-1">Track expenses for a vacation or event</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Trip Name</label>
                <input
                  type="text"
                  value={newTrip.name}
                  onChange={(e) => setNewTrip({ ...newTrip, name: e.target.value })}
                  placeholder="Hawaii Vacation 2026"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Start Date</label>
                  <input
                    type="date"
                    value={newTrip.startDate}
                    onChange={(e) => setNewTrip({ ...newTrip, startDate: e.target.value })}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">End Date</label>
                  <input
                    type="date"
                    value={newTrip.endDate}
                    onChange={(e) => setNewTrip({ ...newTrip, endDate: e.target.value })}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Budget (optional)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input
                    type="number"
                    value={newTrip.budget}
                    onChange={(e) => setNewTrip({ ...newTrip, budget: e.target.value })}
                    placeholder="3,000"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-8 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Notes (optional)</label>
                <textarea
                  value={newTrip.notes}
                  onChange={(e) => setNewTrip({ ...newTrip, notes: e.target.value })}
                  placeholder="Anniversary trip, all-inclusive resort..."
                  rows={2}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                />
              </div>
              <button
                onClick={addTrip}
                disabled={!newTrip.name}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Create Trip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plaid Setup Modal */}
      {showPlaidSetup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-400" />
                  Connect Bank Account
                </h2>
                <button onClick={() => setShowPlaidSetup(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-slate-400 text-sm mt-1">Enter your Plaid API credentials</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Environment</label>
                <select
                  value={plaidConfig.environment}
                  onChange={(e) => setPlaidConfig({ ...plaidConfig, environment: e.target.value })}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="sandbox">Sandbox (Testing)</option>
                  <option value="development">Development</option>
                  <option value="production">Production</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Client ID</label>
                <input
                  type="text"
                  value={plaidConfig.clientId}
                  onChange={(e) => setPlaidConfig({ ...plaidConfig, clientId: e.target.value })}
                  placeholder="Enter your Plaid Client ID"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Secret</label>
                <input
                  type="password"
                  value={plaidConfig.secret}
                  onChange={(e) => setPlaidConfig({ ...plaidConfig, secret: e.target.value })}
                  placeholder="Enter your Plaid Secret"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="bg-slate-700/30 rounded-lg p-4 text-sm">
                <p className="text-slate-300 font-medium mb-2">📋 Sandbox Testing</p>
                <p className="text-slate-400 text-xs mb-2">For sandbox mode, use these test credentials when Plaid Link opens:</p>
                <div className="bg-slate-800 rounded p-2 font-mono text-xs text-slate-300">
                  <p>Username: <span className="text-emerald-400">user_good</span></p>
                  <p>Password: <span className="text-emerald-400">pass_good</span></p>
                </div>
              </div>

              <button
                onClick={initPlaidLink}
                disabled={plaidLoading || !plaidConfig.clientId || !plaidConfig.secret}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2"
              >
                {plaidLoading ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Connecting...</>
                ) : (
                  <><Plus className="w-4 h-4" /> Connect with Plaid</>
                )}
              </button>

              <p className="text-xs text-slate-500 text-center">
                Get free API keys at{' '}
                <a href="https://dashboard.plaid.com/signup" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
                  dashboard.plaid.com
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Trade Confirmation Modal */}
      {tradeConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 max-w-md w-full">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${tradeConfirmation.success ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              <Check className={`w-6 h-6 ${tradeConfirmation.success ? 'text-green-400' : 'text-red-400'}`} />
            </div>
            <h3 className={`text-xl font-bold text-center mb-2 ${tradeConfirmation.success ? 'text-green-400' : 'text-red-400'}`}>
              {tradeConfirmation.success ? 'Order Placed!' : 'Failed'}
            </h3>
            <p className="text-slate-300 text-center mb-6">{tradeConfirmation.message}</p>
            <button onClick={() => setTradeConfirmation(null)} className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}