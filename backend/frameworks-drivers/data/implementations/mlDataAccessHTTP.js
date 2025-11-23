// backend/frameworks-drivers/data/implementations/mlDataAccessHTTP.js
const axios = require('axios');

class MLDataAccessHTTP {
  constructor(baseURL = process.env.ML_API_URL || 'http://ml_api:5002') {
    this.baseURL = baseURL;
    console.log(`MLDataAccessHTTP initialized with baseURL: ${this.baseURL}`);
  }

  async getInjuryRiskPredictions(csvPath, topKRatio = 0.10, startDate = '2024-04-01') {
    try {
      const response = await axios.post(`${this.baseURL}/predict`, {
        csv_path: csvPath,
        top_k_ratio: topKRatio,
        start_date: startDate
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'ML prediction failed');
      }
    } catch (error) {
      if (error.response) {
        throw new Error(`ML Service Error: ${error.response.data.error || error.message}`);
      }
      throw new Error(`ML Service Error: ${error.message}`);
    }
  }

  // Claude API realted
  async getPredictionsFromML(csvPath, topKRatio, startDate) {
    try {
      console.log(`Calling ML service at http://pitchsafe-ml:5002/predict`);
      
      const response = await fetch('http://pitchsafe-ml:5002/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          csv_path: csvPath,
          top_k_ratio: topKRatio,
          start_date: startDate,
        }),
      });

      if (!response.ok) {
        throw new Error(`ML service error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'ML service returned error');
      }

      return data.data || [];
    } catch (error) {
      console.error('ML Data Access Error:', error);
      throw error;
    }
  }

  async healthCheck() {
    try {
      const response = await axios.get(`${this.baseURL}/health`);
      return response.data.status === 'ok';
    } catch (error) {
      console.error(`ML Health check failed: ${error.message}`);
      return false;
    }
  }
}

module.exports = MLDataAccessHTTP;