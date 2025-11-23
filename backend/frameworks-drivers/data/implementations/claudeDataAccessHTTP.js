const Anthropic = require('@anthropic-ai/sdk');

class ClaudeDataAccessHTTP {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });
  }

  async generateCoachAnalysis(playerData, gameRecords, injuryRiskData) {
    try {
      // Build context from game records
      const gameContext = gameRecords
        .slice(-5) // Last 5 games
        .map(game => `
          Date: ${game.game_date}
          Total Pitches: ${game.total_pitches}
          Avg Release Speed: ${game.release_speed_mean_all?.toFixed(2)} mph
          Spin Rate: ${game.release_spin_rate_mean_all?.toFixed(0)} rpm
          Release Extension: ${game.release_extension_mean_all?.toFixed(2)}
          Vertical Movement: ${game.pfx_z_mean_all?.toFixed(2)} inches
          Horizontal Movement: ${game.pfx_x_mean_all?.toFixed(2)} inches
        `)
        .join('\n');

      const prompt = `You are an expert baseball biomechanics coach analyzing pitcher health and injury risk.

PLAYER: ${playerData.playerName}
ML INJURY RISK: ${(injuryRiskData.injury_risk_prob * 100).toFixed(2)}% probability
RISK LEVEL: ${injuryRiskData.risk_level}

RECENT GAME METRICS (Last 5 games):
${gameContext}

Based on this biomechanical data and our ML model's injury risk assessment, provide a concise coach-friendly analysis:

1. **Current Status** (1-2 sentences): What's happening right now?
2. **Red Flags** (2-3 bullet points): What specific metrics are concerning?
3. **Action Items** (2-3 specific recommendations): What should the coach do?
4. **Timeline** (1 sentence): How urgent is this?

Keep it practical and actionable. A coach with no data science background should understand this immediately.`;

      const message = await this.client.messages.create({
        model: 'claude-opus-4-1-20250805',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      return {
        analysis: message.content[0].text,
        tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
      };
    } catch (error) {
      console.error('Claude API Error:', error);
      throw new Error(`Failed to generate analysis: ${error.message}`);
    }
  }
}

module.exports = ClaudeDataAccessHTTP;