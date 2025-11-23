class MLPresenter {
  constructor(viewModel) {
    this.viewModel = viewModel;
  }

  presentInjuryRiskSuccess(playerRiskMap) {
    this.viewModel.setResponse({
      success: true,
      data: playerRiskMap,
      timestamp: new Date().toISOString(),
    });
  }

  presentInjuryRiskError(errorMessage) {
    this.viewModel.setResponse({
      success: false,
      error: errorMessage,
    });
  }

  presentPredictionsSuccess(playerRiskMap) {
    this.viewModel.setResponse({
      success: true,
      predictions: playerRiskMap,
      timestamp: new Date().toISOString(),
    });
  }

  presentPredictionsError(errorMessage) {
    this.viewModel.setResponse({
      success: false,
      error: errorMessage,
    });
  }
}

module.exports = MLPresenter;