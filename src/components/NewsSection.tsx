import React from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';

interface NewsItem {
  asset: string;
  title: string;
}

const newsItems: NewsItem[] = [
  {
    asset: "NVIDIA (NVDA)",
    title: "NVIDIA's AI Dominance Grows with New Enterprise Chips"
  },
  {
    asset: "Microsoft Corporate Bond 2026",
    title: "Microsoft's Credit Rating Upgraded on AI Leadership"
  },
  {
    asset: "iShares Global Clean Energy ETF",
    title: "Clean Energy Sector Surges on New Policy Framework"
  },
  {
    asset: "Physical Silver (XAG)",
    title: "Silver Prices Rise on Industrial Demand Surge"
  }
];

interface NewsSectionProps {
  onNewsClick: (asset: string, title: string) => void;
}

export default function NewsSection({ onNewsClick }: NewsSectionProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper className="h-5 w-5 text-blue-500" />
        <h2 className="text-lg font-semibold text-gray-900">Latest Market News</h2>
      </div>
      <div className="space-y-2">
        {newsItems.map((item, index) => (
          <div 
            key={index}
            onClick={() => onNewsClick(item.asset, item.title)}
            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full min-w-fit">
                {item.asset}
              </span>
              <span className="text-gray-900 group-hover:text-blue-600 transition-colors">
                {item.title}
              </span>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
}