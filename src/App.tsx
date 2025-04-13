import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Wallet, Info } from 'lucide-react';
import RiskAssessment from './RiskAssessment';
import AssetDetail from './AssetDetail';
import NewsSection from './components/NewsSection';
import NewsDetail from './components/NewsDetail';

ChartJS.register(ArcElement, Tooltip, Legend);

interface NewsState {
  asset: string;
  title: string;
}

function App() {
  const [showRiskAssessment, setShowRiskAssessment] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<null | any>(null);
  const [selectedNews, setSelectedNews] = useState<NewsState | null>(null);

  const clientData = {
    client_id: "1234",
    first_name: "Mario",
    last_name: "Rossi",
    portfolio: {
      total_value: 74000,
      risk_profile: "Moderate",
      investments: [
        {
          name: "Swiss Government Bond 2030",
          value: 15000,
          yield: 2.1,
          type: "Government Bond",
          risk: "Low",
          change: 0.3,
          category: "Fixed Income",
          volatility: 3.2,
          expectedReturn: 2.1,
          insight: "Stable sovereign debt with reliable income",
          action: "Hold - Core position for portfolio stability"
        },
        {
          name: "Microsoft Corporate Bond 2026",
          value: 12000,
          yield: 3.5,
          type: "Corporate Bond",
          risk: "Low-Medium",
          change: 0.5,
          category: "Fixed Income",
          volatility: 4.8,
          expectedReturn: 3.5,
          insight: "High-grade corporate bond with strong credit rating",
          action: "Accumulate on yield spikes"
        },
        {
          name: "NVIDIA (NVDA)",
          value: 28000,
          yield: 0.1,
          type: "Stock",
          risk: "High",
          change: 2.8,
          category: "Technology",
          volatility: 35.6,
          expectedReturn: 15.2,
          insight: "Market leader in AI and graphics technology",
          action: "Monitor position size"
        },
        {
          name: "iShares Global Clean Energy ETF",
          value: 10000,
          yield: 0.8,
          type: "Stock",
          risk: "Medium",
          change: -0.5,
          category: "Clean Energy",
          volatility: 28.4,
          expectedReturn: 11.5,
          insight: "Diversified exposure to renewable energy sector",
          action: "Hold for long-term growth"
        },
        {
          name: "Physical Silver (XAG)",
          value: 9000,
          yield: 0,
          type: "Commodity",
          risk: "Medium",
          change: 0.6,
          category: "Precious Metals",
          volatility: 22.3,
          expectedReturn: 6.8,
          insight: "Portfolio hedge against market uncertainty",
          action: "Maintain as portfolio hedge"
        }
      ]
    }
  };

  const chartData = {
    labels: clientData.portfolio.investments.map(inv => inv.name),
    datasets: [
      {
        data: clientData.portfolio.investments.map(inv => inv.value),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',   // Government Bond - Blue
          'rgba(147, 51, 234, 0.8)',   // Corporate Bond - Purple
          'rgba(236, 72, 153, 0.8)',   // Tech Stock - Pink
          'rgba(34, 197, 94, 0.8)',    // Clean Energy ETF - Green
          'rgba(234, 179, 8, 0.8)',    // Silver - Yellow
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(147, 51, 234, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(234, 179, 8, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (showRiskAssessment) {
    return <RiskAssessment onBack={() => setShowRiskAssessment(false)} />;
  }

  if (selectedAsset) {
    return <AssetDetail asset={selectedAsset} onBack={() => setSelectedAsset(null)} />;
  }

  if (selectedNews) {
    return (
      <NewsDetail 
        asset={selectedNews.asset}
        title={selectedNews.title}
        onBack={() => setSelectedNews(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Wallet className="h-8 w-8" />
                Portfolio of {clientData.first_name} {clientData.last_name}
              </h1>
              <div className="text-right">
                <span className="block text-blue-100 text-sm">Total Portfolio Value</span>
                <span className="text-2xl font-bold text-white">
                  {formatCurrency(clientData.portfolio.total_value)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Chart and Portfolio Grid */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Chart */}
              <div className="bg-white p-6 rounded-xl border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Asset Distribution</h2>
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Click segments for details</span>
                  </div>
                </div>
                <Pie data={chartData} options={{ 
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                          size: 12
                        }
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const value = context.raw as number;
                          const percentage = (value / clientData.portfolio.total_value) * 100;
                          return [
                            `Value: ${formatCurrency(value)}`,
                            `Allocation: ${percentage.toFixed(1)}%`
                          ];
                        }
                      }
                    }
                  }
                }} />
              </div>

              {/* Simplified Portfolio Table */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 overflow-hidden">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Overview</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {clientData.portfolio.investments.map((investment, index) => {
                        const weight = (investment.value / clientData.portfolio.total_value) * 100;
                        return (
                          <tr 
                            key={index}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => setSelectedAsset(investment)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{investment.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                              {formatCurrency(investment.value)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                              {weight.toFixed(1)}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* News Section */}
            <div className="mb-8">
              <NewsSection 
                onNewsClick={(asset, title) => setSelectedNews({ asset, title })}
              />
            </div>

            {/* Evaluate Button */}
            <div className="flex justify-center">
              <button 
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors duration-150 text-lg"
                onClick={() => setShowRiskAssessment(true)}
              >
                Evaluate Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;