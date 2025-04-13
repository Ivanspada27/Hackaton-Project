import OpenAI from 'openai';

interface Asset {
  name: string;
  value: number;
  type: string;
  volatility: number;
  expectedReturn: number;
  category: string;
  percentage: number;
}

interface AIAnalysisResult {
  personalizedInsight: string;
  riskAnalysis: string;
  recommendations: string[];
  marketContext: string;
}

class AIService {
  private openai: OpenAI | null = null;
  private retryCount: number = 0;
  private maxRetries: number = 3;
  private baseDelay: number = 1000;

  constructor() {
    // Initialize OpenAI only if API key is available
    if (import.meta.env.VITE_OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });
    }
  }

  private async delay(attempt: number): Promise<void> {
    const timeToWait = this.baseDelay * Math.pow(2, attempt);
    return new Promise(resolve => setTimeout(resolve, timeToWait));
  }

  private getFallbackAnalysis(assets: Asset[], riskScore: number, riskLevel: string): AIAnalysisResult {
    const highRiskAssets = assets.filter(a => a.volatility > 20);
    const totalHighRiskPercentage = highRiskAssets.reduce((sum, a) => sum + a.percentage, 0);
    const hasConcentrationRisk = assets.some(a => a.percentage > 20);
    const lowReturnAssets = assets.filter(a => a.expectedReturn < 3).length;
    
    const insights = {
      low: "Your portfolio maintains a conservative risk profile with emphasis on capital preservation.",
      moderate: "Your portfolio balances growth potential with risk management strategies.",
      high: "Your portfolio shows an aggressive growth orientation with elevated risk levels.",
      "very high": "Your portfolio demonstrates a highly speculative approach with significant risk exposure."
    };

    return {
      personalizedInsight: `${insights[riskLevel.toLowerCase()] || insights.moderate} With a risk score of ${riskScore}, ${
        totalHighRiskPercentage > 50 
          ? "there's a notable concentration in high-volatility assets that requires attention."
          : "the overall risk exposure is being managed through diversification."
      }`,
      riskAnalysis: `Current risk assessment highlights: ${[
        hasConcentrationRisk ? "significant position concentration" : "balanced asset distribution",
        totalHighRiskPercentage > 50 ? "high exposure to volatile assets" : "controlled volatility exposure",
        lowReturnAssets > 2 ? "multiple low-yield positions" : "satisfactory return potential",
        assets.some(a => a.expectedReturn < 0) ? "presence of negative return expectations" : "positive return outlook"
      ].filter(Boolean).join(", ")}. This combination of factors contributes to the ${riskLevel.toLowerCase()} risk classification.`,
      recommendations: [
        hasConcentrationRisk 
          ? "Implement position size limits of 20% per asset to improve diversification"
          : "Maintain current diversification levels while monitoring market conditions",
        totalHighRiskPercentage > 50
          ? "Consider reducing high-volatility exposure through strategic reallocation"
          : "Look for opportunities to optimize risk-adjusted returns through tactical adjustments",
        lowReturnAssets > 2
          ? "Review low-yielding positions for potential alternatives with better return profiles"
          : "Continue regular portfolio rebalancing to maintain target allocations"
      ],
      marketContext: "Based on portfolio composition and risk metrics, focus on maintaining alignment with your investment objectives while staying responsive to changing market conditions. Regular consultation with a financial advisor is recommended for detailed market analysis and personalized guidance."
    };
  }

  private async generatePrompt(assets: Asset[], riskScore: number, riskLevel: string): string {
    const portfolioSummary = assets.map(asset => 
      `${asset.name} (${asset.type}): ${asset.percentage.toFixed(1)}% of portfolio, volatility: ${asset.volatility}%, expected return: ${asset.expectedReturn}%`
    ).join('\n');

    return `As a financial advisor, analyze this investment portfolio:

Risk Profile:
- Risk Score: ${riskScore}/100
- Risk Level: ${riskLevel}

Portfolio Composition:
${portfolioSummary}

Provide a detailed analysis including:
1. Personalized portfolio insight focusing on risk-adjusted returns
2. Risk analysis highlighting key concerns and potential vulnerabilities
3. Three specific, actionable recommendations for portfolio improvement
4. Current market context and its impact on this portfolio composition

Format the response in JSON with these keys:
- personalizedInsight (string)
- riskAnalysis (string)
- recommendations (array of 3 strings)
- marketContext (string)`;
  }

  public async analyzePortfolio(
    assets: Asset[], 
    riskScore: number, 
    riskLevel: string
  ): Promise<AIAnalysisResult> {
    // If OpenAI isn't initialized, return fallback analysis
    if (!this.openai) {
      console.log('OpenAI API key not configured, using fallback analysis');
      return this.getFallbackAnalysis(assets, riskScore, riskLevel);
    }

    try {
      const prompt = await this.generatePrompt(assets, riskScore, riskLevel);
      
      while (this.retryCount < this.maxRetries) {
        try {
          const completion = await this.openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
            temperature: 0.7,
            response_format: { type: "json_object" }
          });

          const response = JSON.parse(completion.choices[0].message.content);
          
          return {
            personalizedInsight: response.personalizedInsight,
            riskAnalysis: response.riskAnalysis,
            recommendations: response.recommendations,
            marketContext: response.marketContext
          };
        } catch (error: any) {
          console.error('OpenAI API Error:', error);
          
          if (error?.message?.includes('429')) {
            this.retryCount++;
            if (this.retryCount < this.maxRetries) {
              await this.delay(this.retryCount);
              continue;
            }
          }
          
          throw error;
        }
      }
      
      throw new Error('Maximum retry attempts reached');
    } catch (error) {
      console.error('Error in AI analysis:', error);
      return this.getFallbackAnalysis(assets, riskScore, riskLevel);
    } finally {
      this.retryCount = 0;
    }
  }
}

export const aiService = new AIService();