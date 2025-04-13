import React, { useEffect, useState } from 'react';
import { FileDown, AlertCircle, ArrowLeft, TrendingUp, TrendingDown, CheckCircle2, Landmark, Coins, Loader2, Brain } from 'lucide-react';
import { riskAssessmentService } from './services/riskAssessmentService';
import { aiService } from './services/aiService';
import RiskBox from './components/RiskBox';

interface RiskAssessmentProps {
  onBack: () => void;
}

interface AIAnalysis {
  personalizedInsight: string;
  riskAnalysis: string;
  recommendations: string[];
  marketContext: string;
}

function RiskAssessment({ onBack }: RiskAssessmentProps) {
  const [assessmentData, setAssessmentData] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(true);
  const [aiError, setAiError] = useState<string | null>(null);

  const portfolioData = {
    investments: [
      {
        name: "Swiss Government Bond 2030",
        value: 15000,
        type: "Government Bond",
        category: "Fixed Income",
        volatility: 3.2,
        expectedReturn: 2.1,
        maxDrawdown: 2.8,
      },
      {
        name: "Microsoft Corporate Bond 2026",
        value: 12000,
        type: "Corporate Bond",
        category: "Fixed Income",
        volatility: 4.8,
        expectedReturn: 3.5,
        maxDrawdown: 4.2,
      },
      {
        name: "NVIDIA (NVDA)",
        value: 28000,
        type: "Stock",
        category: "Technology",
        volatility: 35.6,
        expectedReturn: 15.2,
        maxDrawdown: 28.5,
      },
      {
        name: "iShares Global Clean Energy ETF",
        value: 10000,
        type: "Stock",
        category: "Clean Energy",
        volatility: 28.4,
        expectedReturn: 11.5,
        maxDrawdown: 22.3,
      },
      {
        name: "Physical Silver (XAG)",
        value: 9000,
        type: "Commodity",
        category: "Precious Metals",
        volatility: 22.3,
        expectedReturn: 6.8,
        maxDrawdown: 18.7,
      }
    ]
  };

  useEffect(() => {
    const analyzePortfolio = async () => {
      try {
        const result = await riskAssessmentService.analyzePortfolio(portfolioData.investments);
        setAssessmentData({
          client_name: "Mario Rossi",
          ...result
        });

        const aiResult = await aiService.analyzePortfolio(
          result.assets,
          result.riskScore,
          result.riskLevel
        );
        setAiAnalysis(aiResult);
        setAiError(null);
      } catch (error: any) {
        console.error('Error analyzing portfolio:', error);
        setAiError(error?.message || 'An error occurred during analysis');
      } finally {
        setLoading(false);
        setAiLoading(false);
      }
    };

    analyzePortfolio();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'Government Bond':
        return <Landmark className="h-5 w-5 text-blue-500" />;
      case 'Corporate Bond':
        return <Landmark className="h-5 w-5 text-purple-500" />;
      case 'Commodity':
        return <Coins className="h-5 w-5 text-yellow-500" />;
      default:
        return <TrendingUp className="h-5 w-5 text-pink-500" />;
    }
  };

  const getSuggestionIcon = (suggestion: string) => {
    switch (suggestion.toLowerCase()) {
      case 'increase':
      case 'buy':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'reduce':
      case 'sell':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'hold':
      case 'maintain':
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRiskLevel = (score: number) => {
    if (score < 40) return "Low";
    if (score < 70) return "Moderate";
    return "High";
  };

  const calculateRiskAffinity = (actualRisk: number, desiredRisk: number): number => {
    const difference = Math.abs(actualRisk - desiredRisk);
    const affinity = (1 - difference / 99) * 100;
    return Math.round(affinity * 100) / 100;
  };

  if (loading || !assessmentData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Loading Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={onBack}
                  className="text-white hover:bg-blue-500 rounded-lg p-2 transition-colors"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <div className="h-8 bg-blue-500/50 rounded-lg w-64 animate-pulse"></div>
              </div>
            </div>

            <div className="p-8">
              {/* Loading Animation */}
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Analyzing Portfolio</h2>
                <p className="text-gray-500 text-center max-w-md">
                  Please wait while we evaluate your investments and generate personalized recommendations...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const desiredRisk = 80;
  const actualRisk = assessmentData.riskScore;
  const riskAffinity = calculateRiskAffinity(actualRisk, desiredRisk);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
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
              <h1 className="text-3xl font-bold text-white" id="client-name">
                Risk Assessment for {assessmentData.client_name}
              </h1>
            </div>
          </div>

          <div className="p-8">
            {/* Risk Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <RiskBox
                title="Risk Desired"
                value={desiredRisk}
                riskLevel={getRiskLevel(desiredRisk)}
              />
              <RiskBox
                title="Risk Affinity"
                value={riskAffinity}
                riskLevel={getRiskLevel(riskAffinity)}
              />
              <RiskBox
                title="Actual Risk"
                value={actualRisk}
                riskLevel={getRiskLevel(actualRisk)}
              />
            </div>

            {/* Risk Summary */}
            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Portfolio Insights</h3>
                  <p className="text-blue-700" id="risk-comment">
                    {assessmentData.comment}
                  </p>
                </div>
              </div>
            </div>

            {/* AI Analysis Section */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <Brain className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-purple-900 mb-4">AI-Powered Portfolio Analysis</h3>
                  
                  {aiLoading ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-5 w-5 text-purple-600 animate-spin" />
                      <span className="text-purple-700">Generating AI analysis...</span>
                    </div>
                  ) : aiError ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-700">{aiError}</p>
                      <button 
                        onClick={() => window.location.reload()}
                        className="mt-2 text-red-600 hover:text-red-800 font-medium"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : aiAnalysis ? (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-md font-medium text-purple-800 mb-2">Personalized Insight</h4>
                        <p className="text-purple-700">{aiAnalysis.personalizedInsight}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-md font-medium text-purple-800 mb-2">Risk Analysis</h4>
                        <p className="text-purple-700">{aiAnalysis.riskAnalysis}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-md font-medium text-purple-800 mb-2">AI Recommendations</h4>
                        <ul className="list-disc list-inside text-purple-700 space-y-2">
                          {aiAnalysis.recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-md font-medium text-purple-800 mb-2">Market Context</h4>
                        <p className="text-purple-700">{aiAnalysis.marketContext}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-purple-700">AI analysis unavailable. Please try again later.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Assets Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset Name</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Volatility</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Max Drawdown</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Exp. Return</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insight</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suggestion</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {assessmentData.assets.map((asset, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getAssetIcon(asset.type)}
                            <div className="ml-2">
                              <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                              <div className="text-xs text-gray-500">{asset.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          {formatCurrency(asset.value)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          {asset.percentage.toFixed(1)}%
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          {asset.volatility.toFixed(1)}%
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-red-600">
                          -{asset.maxDrawdown.toFixed(1)}%
                        </td>
                        <td className={`px-4 py-4 whitespace-nowrap text-sm text-right ${asset.expectedReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {asset.expectedReturn >= 0 ? '+' : ''}{asset.expectedReturn.toFixed(1)}%
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 max-w-xs">
                          {asset.insight}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            {getSuggestionIcon(asset.suggestion)}
                            <span className="text-sm text-gray-600">{asset.suggestion}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Download Button */}
            <div className="flex justify-center">
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors duration-150 text-lg flex items-center gap-2"
                onClick={() => alert('Download feature coming soon!')}
              >
                <FileDown className="h-5 w-5" />
                Download PDF Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RiskAssessment;