// Risk calculation constants with stricter thresholds
const RISK_THRESHOLDS = {
  LOW: 30,           // Lowered threshold for low risk
  MODERATE: 45,      // Lowered threshold for moderate risk
  HIGH: 60,          // Lowered threshold for high risk
};

const VOLATILITY_WEIGHTS = {
  LOW: 1.5,         // Increased weight for low volatility
  MEDIUM: 2.5,      // Increased weight for medium volatility
  HIGH: 3.5         // Increased weight for high volatility
};

interface Asset {
  name: string;
  value: number;
  type: string;
  volatility: number;
  expectedReturn: number;
  category: string;
}

interface PortfolioMetrics {
  totalValue: number;
  riskScore: number;
  riskLevel: string;
  comment: string;
  assets: EnhancedAsset[];
}

interface EnhancedAsset extends Asset {
  percentage: number;
  insight: string;
  suggestion: string;
}

export class RiskAssessmentService {
  private calculatePortfolioConcentration(assets: Asset[]): number {
    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
    const concentrationScore = assets.reduce((score, asset) => {
      const percentage = (asset.value / totalValue) * 100;
      // Stricter concentration scoring
      return score + (percentage > 20 ? (percentage - 20) * 1.5 : 0);
    }, 0);
    return Math.min(concentrationScore + 35, 100); // Higher baseline score
  }

  private calculateVolatilityScore(assets: Asset[]): number {
    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
    const baseScore = assets.reduce((score, asset) => {
      const weight = asset.value / totalValue;
      let volatilityMultiplier;
      
      if (asset.volatility <= 8) {
        volatilityMultiplier = VOLATILITY_WEIGHTS.LOW;
      } else if (asset.volatility <= 20) {
        volatilityMultiplier = VOLATILITY_WEIGHTS.MEDIUM;
      } else {
        volatilityMultiplier = VOLATILITY_WEIGHTS.HIGH;
      }
      
      return score + (asset.volatility * weight * volatilityMultiplier);
    }, 0);
    
    return Math.min(baseScore + 30, 100); // Higher baseline score
  }

  private calculateRiskScore(assets: Asset[]): number {
    const concentrationScore = this.calculatePortfolioConcentration(assets);
    const volatilityScore = this.calculateVolatilityScore(assets);
    
    // More emphasis on volatility
    const weightedScore = (concentrationScore * 0.4) + (volatilityScore * 0.6);
    return Math.min(Math.round(weightedScore), 100);
  }

  private getRiskLevel(score: number): string {
    if (score < RISK_THRESHOLDS.LOW) return "Low";
    if (score < RISK_THRESHOLDS.MODERATE) return "Moderate";
    if (score < RISK_THRESHOLDS.HIGH) return "Moderate-High";
    return "High";
  }

  private generateInsight(asset: Asset): string {
    const insights = {
      'Government Bond': {
        low: "Stable fixed income component providing portfolio foundation",
        high: "Core position with moderate duration exposure"
      },
      'Corporate Bond': {
        low: "Quality credit exposure with attractive yield",
        high: "Balanced yield and credit risk profile"
      },
      'Stock': {
        low: "Well-positioned equity with growth potential",
        high: "Growth-oriented position with managed risk"
      },
      'Commodity': {
        low: "Strategic portfolio diversifier",
        high: "Alternative asset providing market hedge"
      }
    };

    const riskLevel = asset.volatility > 15 ? 'high' : 'low';
    return insights[asset.type]?.[riskLevel] || "Position aligned with portfolio strategy";
  }

  private generateSuggestion(asset: Asset, percentage: number): string {
    if (percentage > 25) {
      return "Consider rebalancing";
    }
    if (asset.volatility > 30) {
      return "Monitor volatility";
    }
    if (asset.expectedReturn < 2) {
      return "Review yield profile";
    }
    if (asset.volatility < 10 && asset.expectedReturn > 3) {
      return "Maintain position";
    }
    return "Hold and monitor";
  }

  private generateComment(riskScore: number, assets: Asset[]): string {
    const highVolAssets = assets.filter(a => a.volatility > 30).length;
    const concentration = this.calculatePortfolioConcentration(assets);
    const lowReturnAssets = assets.filter(a => a.expectedReturn < 2).length;

    const observations = [];

    if (riskScore > RISK_THRESHOLDS.HIGH) {
      observations.push("Portfolio shows elevated risk metrics");
    }
    if (concentration > 60) {
      observations.push("Consider broader diversification");
    }
    if (highVolAssets > 1) {
      observations.push("Monitor higher volatility positions");
    }
    if (lowReturnAssets > 1) {
      observations.push("Review low-yield positions");
    }

    if (observations.length > 0) {
      return `Portfolio Review: ${observations.join(". ")}. Regular monitoring recommended.`;
    }

    return "Portfolio composition appears well-balanced. Continue regular review of positions and market conditions.";
  }

  public async analyzePortfolio(assets: Asset[]): Promise<PortfolioMetrics> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
    const riskScore = this.calculateRiskScore(assets);
    const riskLevel = this.getRiskLevel(riskScore);

    const enhancedAssets = assets.map(asset => {
      const percentage = (asset.value / totalValue) * 100;
      return {
        ...asset,
        percentage,
        insight: this.generateInsight(asset),
        suggestion: this.generateSuggestion(asset, percentage)
      };
    });

    return {
      totalValue,
      riskScore,
      riskLevel,
      comment: this.generateComment(riskScore, assets),
      assets: enhancedAssets
    };
  }
}

export const riskAssessmentService = new RiskAssessmentService();