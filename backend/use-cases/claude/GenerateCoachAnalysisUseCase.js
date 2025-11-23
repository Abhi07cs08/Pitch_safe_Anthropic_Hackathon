class GenerateCoachAnalysisUseCase {
  constructor(claudeDataAccess, gameDataAccess, outputBoundary) {
    this.claudeDataAccess = claudeDataAccess;
    this.gameDataAccess = gameDataAccess;
    this.outputBoundary = outputBoundary;
  }

  async execute(inputData) {
    try {
      const { playerId, playerName, injuryRiskData } = inputData;

      if (!playerId || !playerName || !injuryRiskData) {
        throw new Error('Missing required player or risk data');
      }

      // Fetch player's recent game records
      const gameRecords = await this.gameDataAccess.getPlayerGameRecordsByID(playerId);

      if (!gameRecords || gameRecords.length === 0) {
        throw new Error('No game records found for this player');
      }

      // Get Claude analysis
      const result = await this.claudeDataAccess.generateCoachAnalysis(
        { playerName },
        gameRecords,
        injuryRiskData
      );

      this.outputBoundary.presentCoachAnalysisSuccess(result);
    } catch (error) {
      this.outputBoundary.presentCoachAnalysisError(error.message);
    }
  }
}

module.exports = GenerateCoachAnalysisUseCase;