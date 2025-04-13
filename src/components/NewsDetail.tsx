import React from 'react';
import { ArrowLeft, Calendar, Globe, Share2 } from 'lucide-react';

interface NewsDetailProps {
  asset: string;
  title: string;
  onBack: () => void;
}

const newsDetails = {
  "NVIDIA (NVDA)": {
    date: "March 19, 2024",
    content: `NVIDIA has unveiled its latest enterprise AI chips, further cementing its leadership in the artificial intelligence hardware market. The new processors offer unprecedented performance for large language model training and inference, with early benchmarks showing up to 4x improvement over previous generations.

    The announcement comes as demand for AI computing continues to surge, with major cloud providers and enterprises rushing to expand their AI infrastructure. Industry analysts predict this could lead to another strong year for NVIDIA's data center segment.

    The company also introduced new software tools and frameworks designed to simplify AI development and deployment, particularly focusing on enterprise use cases. These developments are expected to help maintain NVIDIA's competitive edge in the rapidly evolving AI chip market.`,
    source: "TechNews Global"
  },
  "Microsoft Corporate Bond 2026": {
    date: "March 18, 2024",
    content: `Major credit rating agencies have upgraded Microsoft's credit outlook, citing the company's strong position in the enterprise AI market and robust cloud business growth. The upgrade reflects Microsoft's successful integration of AI capabilities across its product portfolio and its strategic partnership with OpenAI.

    The improved credit rating could lead to more favorable borrowing terms for Microsoft's future debt issuances. Analysts note that the company's strong cash flow and growing recurring revenue streams from cloud and AI services provide solid support for its debt obligations.

    The bond market has responded positively to the news, with Microsoft's existing bonds, including the 2026 series, trading at tighter spreads. This development highlights the market's confidence in Microsoft's long-term financial stability and growth prospects.`,
    source: "Financial Markets Today"
  },
  "iShares Global Clean Energy ETF": {
    date: "March 20, 2024",
    content: `The clean energy sector has received a significant boost following the announcement of new international policy frameworks supporting renewable energy adoption. The framework includes enhanced incentives for solar and wind power development, as well as new targets for reducing carbon emissions.

    Several key holdings in the iShares Global Clean Energy ETF have seen their stock prices rise on the news. Analysts predict this could lead to increased investment in renewable energy infrastructure and technology development over the next decade.

    The policy changes are expected to accelerate the global transition to renewable energy, potentially benefiting companies across the clean energy value chain, from component manufacturers to utility-scale project developers.`,
    source: "Energy Market Review"
  },
  "Physical Silver (XAG)": {
    date: "March 17, 2024",
    content: `Silver prices have reached new highs as industrial demand continues to grow, particularly from the renewable energy and electric vehicle sectors. The metal's crucial role in solar panel manufacturing and electronic components has led to increased buying pressure from manufacturers.

    Market analysts note that the combination of industrial demand and investment interest has created a favorable environment for silver prices. The growing adoption of clean energy technologies is expected to maintain strong demand for silver in the coming years.

    Additionally, supply constraints from major producing regions have contributed to the price momentum, with some miners reporting lower-than-expected output for the quarter.`,
    source: "Precious Metals Insight"
  }
};

export default function NewsDetail({ asset, title, onBack }: NewsDetailProps) {
  const details = newsDetails[asset as keyof typeof newsDetails];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6">
            <button
              onClick={onBack}
              className="text-white hover:bg-blue-500 rounded-lg p-2 transition-colors mb-4"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm font-medium text-blue-100 bg-blue-500/30 px-3 py-1 rounded-full">
                {asset}
              </span>
            </div>
          </div>

          <div className="p-6">
            {/* Article Metadata */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{details.date}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">{details.source}</span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            {/* Article Content */}
            <div className="prose max-w-none">
              {details.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}