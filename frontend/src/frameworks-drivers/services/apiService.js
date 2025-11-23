// frontend/src/frameworks-drivers/services/apiService.js
class ApiService {
  constructor(baseURL = 'http://localhost:5001') {
    this.baseURL = baseURL;
  }

  async get(endpoint) {
    const response = await fetch(`${this.baseURL}${endpoint}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async post(endpoint, data) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || `HTTP error! status: ${response.status}`);
    }

    return responseData;
  }

  // for Claude coach analysis
  async generateCoachAnalysis(playerId, playerName, injuryRiskData) {
    return this.post('/api/claude/coach-analysis', {
      playerId,
      playerName,
      injuryRiskData,
    });
  }

  async getMLPredictions(csvPath, topKRatio = 0.10, startDate = '2024-04-01') {
    return this.get(
      `/api/ml/get-all-predictions?csvPath=${encodeURIComponent(csvPath)}&topKRatio=${topKRatio}&startDate=${startDate}`
    );
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();