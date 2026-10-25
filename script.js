let currentRiskIndex = 0;
let biometricVerified = false;
let activeVioaltion = [];
let lastVoidRisk = 0;

function updateRiskDisplay() {
    const display = document.getElementById('risk-display');
    display.textContent = `${currentRiskIndex}% (${currentRiskIndex > 40 ? 'ELEVATED' : 'OPTIMAL'})`;
    if (currentRiskIndex > 40) {
        display.className = 'risk-high';
    } else {
      display.className= 'risk-low'    
    }
}
