class MLController {
  constructor(getInjuryRiskUseCase, getAllPredictionsUseCase, viewModel) {
    this.getInjuryRiskUseCase = getInjuryRiskUseCase;
    this.getAllPredictionsUseCase = getAllPredictionsUseCase;
    this.viewModel = viewModel;
  }

  async getInjuryRisk(req, res) {
    try {
      const { csvPath, topKRatio, startDate } = req.body;

      await this.getInjuryRiskUseCase.execute({
        csvPath,
        topKRatio,
        startDate
      });

      const result = this.viewModel.getResponse();
      res.status(result.success ? 200 : 500).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllPredictions(req, res) {
    try {
      const { csvPath, topKRatio = 0.10, startDate = '2024-04-01' } = req.query;

      await this.getAllPredictionsUseCase.execute({
        csvPath,
        topKRatio: parseFloat(topKRatio),
        startDate,
      });

      const result = this.viewModel.getResponse();
      res.status(result.success ? 200 : 500).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = MLController;