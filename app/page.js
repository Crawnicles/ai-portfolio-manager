'use client';

import React, { useState, useEffect } from 'react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Circle, Brain, Zap, Shield, Target, Settings, RefreshCw, ChevronRight, Check, Briefcase, BarChart3, Sparkles, Play, Lock, Eye, EyeOff, Search, X, ShoppingCart, ArrowUpCircle, ArrowDownCircle, History, AlertTriangle, Power, Gauge, Bot, Clock, Newspaper, Calendar, ThumbsUp, ThumbsDown, Minus, Activity, FileText, Users, Radio, Layers } from 'lucide-react';

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

            <nav className="flex gap-1">
              {['dashboard', 'research', 'trade', 'suggestions', 'history', 'settings'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${activeTab === tab ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}>
                  {tab}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
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