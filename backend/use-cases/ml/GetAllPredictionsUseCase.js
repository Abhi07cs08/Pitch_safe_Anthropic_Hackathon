class GetAllPredictionsUseCase {
  constructor(mlDataAccess, outputBoundary) {
    this.mlDataAccess = mlDataAccess;
    this.outputBoundary = outputBoundary;
  }

  async execute(inputData) {
    try {
      const { csvPath, topKRatio = 0.10, startDate = '2024-04-01' } = inputData;

      if (!csvPath) {
        throw new Error('CSV path is required');
      }

      console.log('📊 Getting predictions from ML service...');
      
      // Call ML service
      const predictions = await this.mlDataAccess.getPredictionsFromML(
        csvPath,
        topKRatio,
        startDate
      );

      console.log(`📊 Received ${predictions.length} predictions from ML`);

      // Convert to player-keyed format
      const playerRiskMap = {};
      predictions.forEach(pred => {
        const playerName = pred.player_name;
        // Keep most recent prediction per player
        if (!playerRiskMap[playerName] || 
            new Date(pred.game_date) > new Date(playerRiskMap[playerName].game_date)) {
          playerRiskMap[playerName] = {
            player_name: playerName,
            injury_risk_prob: pred.injury_risk_prob,
            risk_level: pred.risk_level,
            game_date: pred.game_date,
            result: pred.result
          };
        }
      });

      console.log(`✅ Converted ${Object.keys(playerRiskMap).length} players to risk map`);
      this.outputBoundary.presentPredictionsSuccess(playerRiskMap);

    } catch (error) {
      console.error('❌ Error in GetAllPredictionsUseCase:', error);
      this.outputBoundary.presentPredictionsError(error.message);
    }
  }
}

module.exports = GetAllPredictionsUseCase;