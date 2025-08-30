import React from 'react';
import '../styles/StabilityMeter.css';

interface StabilityMeterProps {
  value: number;
}

const StabilityMeter: React.FC<StabilityMeterProps> = ({ value }) => {
  const getStabilityColor = (stability: number) => {
    if (stability >= 80) return 'var(--ok)';
    if (stability >= 60) return 'var(--accent-2)';
    if (stability >= 40) return 'var(--accent)';
    if (stability >= 20) return '#ffa500';
    return 'var(--danger)';
  };

  const getStabilityText = (stability: number) => {
    if (stability >= 100) return 'Timeline Stable';
    if (stability >= 80) return 'Nearly Stable';
    if (stability >= 60) return 'Moderately Stable';
    if (stability >= 40) return 'Unstable';
    if (stability >= 20) return 'Critical';
    return 'Collapsing';
  };

  const getStabilityIcon = (stability: number) => {
    if (stability >= 100) return '✨';
    if (stability >= 80) return '🌟';
    if (stability >= 60) return '⭐';
    if (stability >= 40) return '⚠️';
    if (stability >= 20) return '🚨';
    return '💥';
  };

  return (
    <div className="stability-meter">
      <div className="meter-header">
        <h3>Timeline Stability</h3>
        <span className="stability-icon">{getStabilityIcon(value)}</span>
      </div>
      
      <div className="meter-container">
        <div className="meter-bar">
          <div 
            className="meter-fill"
            style={{ 
              width: `${value}%`,
              backgroundColor: getStabilityColor(value)
            }}
          />
        </div>
        <div className="meter-value">
          <span className="percentage">{value}%</span>
          <span className="status">{getStabilityText(value)}</span>
        </div>
      </div>
      
      <div className="stability-info">
        <p>
          {value >= 100 
            ? "Perfect! The timeline is fully restored and stable."
            : `Keep adjusting the values to reach 100% stability. Current: ${value}%`
          }
        </p>
      </div>
    </div>
  );
};

export default StabilityMeter;
