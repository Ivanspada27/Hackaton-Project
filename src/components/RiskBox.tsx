import React from 'react';

interface RiskBoxProps {
  title: string;
  value: number;
  riskLevel: string;
}

export default function RiskBox({ title, value, riskLevel }: RiskBoxProps) {
  const getColorClasses = (value: number, title: string) => {
    // Reverse color logic for Risk Affinity
    if (title === "Risk Affinity") {
      if (value >= 70) {
        return 'bg-blue-50 border-blue-200 text-blue-700';
      }
      if (value >= 40) {
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      }
      return 'bg-red-50 border-red-200 text-red-700';
    }
    
    // Regular color logic for other risk metrics
    if (value < 40) {
      return 'bg-blue-50 border-blue-200 text-blue-700';
    }
    if (value < 70) {
      return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    }
    return 'bg-red-50 border-red-200 text-red-700';
  };

  const getValueColor = (value: number, title: string) => {
    // Reverse color logic for Risk Affinity
    if (title === "Risk Affinity") {
      if (value >= 70) return 'text-blue-600';
      if (value >= 40) return 'text-yellow-600';
      return 'text-red-600';
    }
    
    // Regular color logic for other risk metrics
    if (value < 40) return 'text-blue-600';
    if (value < 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`rounded-xl border p-4 text-center ${getColorClasses(value, title)}`}>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <div className="flex items-center justify-center gap-2">
        <span className={`text-3xl font-bold ${getValueColor(value, title)}`}>
          {value}{title === "Risk Affinity" ? "%" : ""}
        </span>
        <span className="text-sm opacity-75">
          ({riskLevel})
        </span>
      </div>
    </div>
  );
}