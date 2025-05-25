"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  name: string;
}

interface StockChartProps {
  stocks: StockData[];
}

// Generate mock historical data for chart
const generateHistoricalData = (currentPrice: number, change: number) => {
  const data = [];
  const basePrice = currentPrice - change;
  
  for (let i = 0; i < 24; i++) {
    const hour = i;
    const variance = (Math.random() - 0.5) * (currentPrice * 0.02);
    const price = basePrice + (change * (i / 23)) + variance;
    
    data.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      price: Math.max(price, 0),
      volume: Math.floor(Math.random() * 1000000) + 500000,
    });
  }
  
  return data;
};

const StockChart: React.FC<StockChartProps> = ({ stocks }) => {
  if (!stocks || stocks.length === 0) {
    return (
      <Card className="border-neutral-200/80 rounded-lg bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-black flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Stock Market
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-neutral-400">Loading stock data...</p>
        </CardContent>
      </Card>
    );
  }

  // Get the first stock for the main chart
  const primaryStock = stocks[0];
  const chartData = generateHistoricalData(primaryStock.price, primaryStock.change);

  return (
    <div className="space-y-4">
      {/* Main Chart */}
      <Card className="border-neutral-200/80 rounded-lg bg-white shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-black flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              {primaryStock.name} ({primaryStock.symbol})
            </CardTitle>
            <Badge 
              variant={primaryStock.change >= 0 ? "default" : "destructive"} 
              className={`text-[10px] px-1.5 py-0.5 ${
                primaryStock.change >= 0 
                  ? 'bg-green-100 text-green-700 border-green-200' 
                  : 'bg-red-100 text-red-700 border-red-200'
              }`}
            >
              {primaryStock.change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {primaryStock.change >= 0 ? '+' : ''}{primaryStock.changePercent.toFixed(2)}%
            </Badge>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-black">${primaryStock.price.toFixed(2)}</span>
            <span className={`text-sm font-medium ${primaryStock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {primaryStock.change >= 0 ? '+' : ''}${primaryStock.change.toFixed(2)}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop 
                      offset="5%" 
                      stopColor={primaryStock.change >= 0 ? "#10b981" : "#ef4444"} 
                      stopOpacity={0.3}
                    />
                    <stop 
                      offset="95%" 
                      stopColor={primaryStock.change >= 0 ? "#10b981" : "#ef4444"} 
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  domain={['dataMin - 1', 'dataMax + 1']}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value: any) => [`$${value.toFixed(2)}`, 'Price']}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={primaryStock.change >= 0 ? "#10b981" : "#ef4444"}
                  strokeWidth={2}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Stock Grid */}
      <div className="grid grid-cols-2 gap-3">
        {stocks.slice(1, 5).map((stock, idx) => (
          <Card key={stock.symbol} className="border-neutral-200/80 rounded-lg bg-white shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <DollarSign className={`w-3 h-3 ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                  <span className="font-semibold text-xs text-black truncate">{stock.symbol}</span>
                </div>
                <Badge 
                  variant={stock.change >= 0 ? "default" : "destructive"} 
                  className={`text-[9px] px-1 py-0.5 ${
                    stock.change >= 0 
                      ? 'bg-green-100 text-green-700 border-green-200' 
                      : 'bg-red-100 text-red-700 border-red-200'
                  }`}
                >
                  {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(1)}%
                </Badge>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-bold text-sm text-black">${stock.price.toFixed(2)}</span>
                <span className={`text-[10px] font-medium ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)}
                </span>
              </div>
              <p className="text-[9px] text-neutral-400 mt-0.5 truncate">{stock.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StockChart; 