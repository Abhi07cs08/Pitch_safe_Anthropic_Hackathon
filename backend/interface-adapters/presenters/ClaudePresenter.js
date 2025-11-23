class ClaudePresenter {
  constructor(viewModel) {
    this.viewModel = viewModel;
  }

  presentCoachAnalysisSuccess(result) {
    this.viewModel.setResponse({
      success: true,
      analysis: result.analysis,
      tokensUsed: result.tokensUsed,
      timestamp: new Date().toISOString(),
    });
  }

  presentCoachAnalysisError(errorMessage) {
    this.viewModel.setResponse({
      success: false,
      error: errorMessage,
    });
  }
}

module.exports = ClaudePresenter;