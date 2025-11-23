class ClaudeController {
  constructor(generateCoachAnalysisUseCase, viewModel) {
    this.generateCoachAnalysisUseCase = generateCoachAnalysisUseCase;
    this.viewModel = viewModel;
  }

  async generateCoachAnalysis(req, res) {
    try {
      const { playerId, playerName, injuryRiskData } = req.body;

      await this.generateCoachAnalysisUseCase.execute({
        playerId,
        playerName,
        injuryRiskData,
      });

      const viewModelState = this.viewModel.getViewModel();
      res.status(200).json(viewModelState);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = ClaudeController;