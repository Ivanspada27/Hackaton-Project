import React from 'react';
import { ArrowLeft, TrendingUp, Landmark, Coins, AlertCircle, BarChart3, Calendar, DollarSign, Percent } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AssetDetailProps {
  asset: {
    name: string;
    value: number;
    type: string;
    risk: string;
    yield: number;
    change: number;
  };
  onBack: () => void;
}

function AssetDetail({ asset, onBack }: AssetDetailProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Generate realistic historical data based on risk profile
  const generateHistoricalData = () => {
    const months = 120; // 10 years of monthly data
    const dates = Array.from({ length: months }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (months - 1 - i));
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    });

    let baseValue = asset.value;
    const values = [];
    let currentValue = baseValue;

    // Risk-based parameters
    let volatility: number;
    let annualReturn: number;
    let marketCrashProbability: number;
    let recoveryRate: number;

    switch (asset.risk) {
      case 'Low':
        volatility = 0.02; // 2% monthly volatility
        annualReturn = 0.03; // 3% annual return
        marketCrashProbability = 0.001; // 0.1% crash probability
        recoveryRate = 0.8; // 80% recovery rate
        break;
      case 'Low-Medium':
        volatility = 0.04;
        annualReturn = 0.06;
        marketCrashProbability = 0.005;
        recoveryRate = 0.7;
        break;
      case 'Medium':
        volatility = 0.08;
        annualReturn = 0.09;
        marketCrashProbability = 0.01;
        recoveryRate = 0.6;
        break;
      case 'High':
        volatility = 0.15;
        annualReturn = 0.15;
        marketCrashProbability = 0.02;
        recoveryRate = 0.5;
        break;
      default:
        volatility = 0.05;
        annualReturn = 0.07;
        marketCrashProbability = 0.008;
        recoveryRate = 0.65;
    }

    // Monthly return (geometric mean of annual return)
    const monthlyReturn = Math.pow(1 + annualReturn, 1/12) - 1;

    for (let i = 0; i < months; i++) {
      // Random market movement
      const randomFactor = (Math.random() - 0.5) * 2 * volatility;
      
      // Market crash simulation
      const crashOccurs = Math.random() < marketCrashProbability;
      
      if (crashOccurs) {
        // Simulate market crash
        currentValue *= (1 - volatility * 5);
        // Add recovery period
        const recoveryPeriod = Math.floor(Math.random() * 6) + 3; // 3-8 months recovery
        for (let j = 0; j < recoveryPeriod && i + j < months; j++) {
          currentValue *= (1 + (monthlyReturn + volatility) * recoveryRate);
          values.push(currentValue);
          i++;
        }
      } else {
        // Normal market movement
        currentValue *= (1 + monthlyReturn + randomFactor);
        values.push(currentValue);
      }
    }

    return { dates, values };
  };

  const historicalData = generateHistoricalData();

  const chartData = {
    labels: historicalData.dates,
    datasets: [
      {
        label: 'Asset Value',
        data: historicalData.values,
        fill: true,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `Value: ${formatCurrency(context.raw)}`,
        },
        intersect: false,
        mode: 'index' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: (value: number) => formatCurrency(value),
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 12,
          maxRotation: 0,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  const getAssetIcon = () => {
    switch (asset.type) {
      case 'Government Bond':
        return <Landmark className="h-6 w-6 text-blue-500" />;
      case 'Corporate Bond':
        return <Landmark className="h-6 w-6 text-purple-500" />;
      case 'Commodity':
        return <Coins className="h-6 w-6 text-yellow-500" />;
      default:
        return <TrendingUp className="h-6 w-6 text-pink-500" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'text-blue-600 bg-blue-50';
      case 'Low-Medium':
        return 'text-purple-600 bg-purple-50';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'High':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="text-white hover:bg-blue-500 rounded-lg p-2 transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div className="flex items-center gap-3">
                {getAssetIcon()}
                <h1 className="text-3xl font-bold text-white">{asset.name}</h1>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Key Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-500">Current Value</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  {formatCurrency(asset.value)}
                </span>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Percent className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-500">Annual Yield</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  {asset.yield}%
                </span>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-500">Risk Level</span>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(asset.risk)}`}>
                  {asset.risk}
                </span>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Historical Performance</h2>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Last 10 years</span>
                </div>
              </div>
              <div className="h-[300px]">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* Asset Info */}
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Investment Insights</h3>
                  <p className="text-blue-700">
                    {asset.type === 'Government Bond' && 
                      "Government bonds offer stable, low-risk returns backed by sovereign guarantees. They play a crucial role in portfolio stabilization and provide regular income through interest payments."}
                    {asset.type === 'Corporate Bond' && 
                      "Corporate bonds typically offer higher yields than government bonds but come with moderate credit risk. They provide regular income and can be a good way to diversify fixed-income investments."}
                    {asset.type === 'Stock' && 
                      "Stocks offer potential for capital appreciation and dividends, but come with higher volatility. They're essential for long-term growth but require careful monitoring and risk management."}
                    {asset.type === 'Commodity' && 
                      "Commodities like gold can serve as a hedge against inflation and market volatility. They typically have low correlation with other asset classes, providing portfolio diversification benefits."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssetDetail;