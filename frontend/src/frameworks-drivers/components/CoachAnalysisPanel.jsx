import React, { useState } from 'react';
import { apiService } from '../services/apiService';

const CoachAnalysisPanel = ({ 
  playerName, 
  playerId, 
  injuryRiskData,
  playerFullName 
}) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleGenerateAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🤖 handleGenerateAnalysis called');
      console.log('  playerName:', playerName);
      console.log('  playerId:', playerId);
      console.log('  playerFullName:', playerFullName);
      
      // DEMO MODE: Use mock data for hackathon demo
      const mockRiskData = {
        injury_risk_prob: 0.75,
        risk_level: 'high',
        game_date: '2024-04-11'
      };
      
      console.log('✅ Using MOCK data for demo:', mockRiskData);
      console.log('📤 Calling API with:', { playerId, playerName, mockRiskData });
      
      // Mock API response for demo
      console.log('🎭 DEMO MODE: Generating mock analysis...');
      
      const mockAnalysis = `INJURY RISK ANALYSIS FOR ${playerName}
================================

Current Status:
This pitcher is presenting early signs of fatigue that correlate with rotator cuff injury risk. Over 20 biomechanical metrics show concerning patterns.

Red Flags:
• Release point has shifted 1.2 inches forward (indicates shoulder strain)
• Spin rate inconsistency increased 18% over last 3 games
• Release extension decreased 0.35 inches (reduced external rotation)

Action Items:
1. Reduce throwing volume by 15-20% for next 2 games
2. Increase shoulder mobility work (band work, sleeper stretches)
3. Monitor release height daily - red flag if drops below 5.8 feet

Timeline:
URGENT - Recommend 2-3 days rest before next start. Early intervention now could prevent 6-8 week injury.

ML Confidence: 75% probability of injury if current mechanics continue.`;

      setAnalysis(mockAnalysis);
      setIsExpanded(true);
      console.log('✅ Demo analysis displayed');


    } catch (err) {
      console.error('❌ Exception caught:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
      color: 'white',
      border: '2px solid rgba(255,255,255,0.2)',
    }}>
      <button
        onClick={handleGenerateAnalysis}
        disabled={loading}
        style={{
          width: '100%',
          padding: '16px',
          background: loading 
            ? 'rgba(255,255,255,0.3)' 
            : 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '700',
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          transition: 'all 0.3s ease',
          opacity: loading ? 0.7 : 1,
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(255,107,107,0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (!loading) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }
        }}
      >
        <span>{loading ? '⏳ Generating Analysis...' : '🤖 Get AI Coach Analysis'}</span>
      </button>

      {error && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: 'rgba(231, 76, 60, 0.3)',
          border: '1px solid rgba(231, 76, 60, 0.6)',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#FFB3B3',
        }}>
          ⚠️ {error}
        </div>
      )}

      {analysis && isExpanded && (
        <div style={{
          marginTop: '16px',
          padding: '16px',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '8px',
          fontSize: '14px',
          lineHeight: '1.6',
          whiteSpace: 'pre-wrap',
          fontFamily: '"Courier New", monospace',
          maxHeight: '500px',
          overflowY: 'auto',
          animation: 'slideDown 0.3s ease-out',
        }}>
          {analysis}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default CoachAnalysisPanel;