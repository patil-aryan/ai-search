"use client";

import React, { useMemo } from 'react';
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

// Define default mock stock data
const DEFAULT_MOCK_STOCK: StockData = {
  symbol: "MOCKIDX",
  price: 150.75,
  change: 5.25,
  changePercent: (5.25 / (150.75 - 5.25)) * 100,
  name: "Sample Market Index",
};

// Generate mock historical data for chart
const generateHistoricalData = (currentPrice: number, change: number) => {
  const data = [];
  const basePrice = currentPrice - change;
  // Ensure basePrice is a valid number, default to currentPrice if change is problematic
  const validBasePrice = isNaN(basePrice) ? currentPrice : basePrice;

  for (let i = 0; i < 24; i++) {
    const hour = i;
    // Ensure variance calculation doesn't lead to NaN if currentPrice is 0
    const variance = (Math.random() - 0.5) * (currentPrice * 0.02 || 0.01); 
    // Ensure change multiplication is valid
    const price = validBasePrice + (change * (i / 23) || 0) + variance;
    
    data.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      price: Math.max(price, 0), // Ensure price is not negative
      volume: Math.floor(Math.random() * 1000000) + 500000,
    });
  }
  
  return data;
};

const StockChart: React.FC<StockChartProps> = ({ stocks }) => {
  // Memoize chart data and determine which stock to display
  const { displayStock, chartData } = useMemo(() => {
    let stockToUse = DEFAULT_MOCK_STOCK; // Default to mock stock

    if (stocks && stocks.length > 0 && stocks[0]) {
      const firstStock = stocks[0];
      // Check if the first stock has valid price and change numbers
      if (typeof firstStock.price === 'number' && 
          !isNaN(firstStock.price) &&
          typeof firstStock.change === 'number' &&
          !isNaN(firstStock.change)) {
        stockToUse = firstStock;
      }
    }
    
    const generatedData = generateHistoricalData(stockToUse.price, stockToUse.change);
    return { displayStock: stockToUse, chartData: generatedData };
  }, [stocks]);

  return (
    <div className="space-y-4">
      {/* Main Chart */}
      <Card className="border-neutral-200/80 rounded-lg bg-white shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-black flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              {displayStock.name} ({displayStock.symbol})
            </CardTitle>
            <Badge 
              variant={displayStock.change >= 0 ? "default" : "destructive"} 
              className={`text-[10px] px-1.5 py-0.5 ${
                displayStock.change >= 0 
                  ? 'bg-green-100 text-green-700 border-green-200' 
                  : 'bg-red-100 text-red-700 border-red-200'
              }`}
            >
              {displayStock.change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {displayStock.change >= 0 ? '+' : ''}{displayStock.changePercent.toFixed(2)}%
            </Badge>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-black">${displayStock.price.toFixed(2)}</span>
            <span className={`text-sm font-medium ${displayStock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {displayStock.change >= 0 ? '+' : ''}${displayStock.change.toFixed(2)}
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
                      stopColor={displayStock.change >= 0 ? "#22c55e" : "#ef4444"}
                      stopOpacity={0.4}
                    />
                    <stop 
                      offset="95%" 
                      stopColor={displayStock.change >= 0 ? "#22c55e" : "#ef4444"}
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                <XAxis 
                  dataKey="time" 
                  axisLine={{ stroke: '#9ca3af' }}
                  tickLine={{ stroke: '#9ca3af' }}
                  tick={{ fontSize: 10, fill: '#374151' }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  axisLine={{ stroke: '#9ca3af' }}
                  tickLine={{ stroke: '#9ca3af' }}
                  tick={{ fontSize: 10, fill: '#374151' }}
                  domain={['dataMin - dataMin * 0.01', 'dataMax + dataMax * 0.01']}
                  tickFormatter={(value) => `$${Number(value).toLocaleString()}`} 
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
                  stroke={displayStock.change >= 0 ? "#16a34a" : "#dc2626"}
                  strokeWidth={2}
                  fill="url(#colorPrice)"
                  activeDot={{ r: 5, strokeWidth: 2, fill: displayStock.change >= 0 ? "#22c55e" : "#ef4444" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Stock Grid */}
      {stocks && stocks.length > 1 && ( // Added a check to ensure there are stocks to slice
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
      )}
    </div>
  );
};

export default StockChart;