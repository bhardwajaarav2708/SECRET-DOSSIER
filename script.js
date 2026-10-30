let currentRiskIndex = 0;
let biometricVerified = false;
let activeViolation = [];
let lastVoidRisk = 0;

function updateRiskDisplay() {
    const display = document.getElementById('risk-display');
    display.textContent = `${currentRiskIndex}% (${currentRiskIndex > 40 ? 'ELEVATED' : 'OPTIMAL'})`;
    if (currentRiskIndex > 40) {
        display.className = 'risk-high';
    } else {
        display.className = 'risk-low';
    }
}

function goToStep(stepNum) {
    if (stepNum === 2) {
        const nameInput = document.getElementById('applicant-name').value.trim();
        if (!nameInput) {
            alert('Please enter your full traveller name.');
            return;
        }
        if (!biometricVerified) {
            alert('Biometric palm scan is required before proceeding.');
            return;
        }
    }
    document.querySelectorAll('.checkpoint-step').forEach(step => {
        step.classList.remove('active-step');
    });
    document.getElementById(`step-${stepNum}`).classList.add('active-step');
}

function triggerPalmScan() {
    const scanner = document.getElementById('palm-scanner');
    const statusText = document.getElementById('palm-status-text');
    const nextBtn = document.getElementById('btn-step1');

    scanner.classList.add('scanning');
    statusText.textContent = 'ANALYZING QUANTUM DNA & NEURAL MATRIX...';
    
    setTimeout(() => {
        scanner.classList.remove('scanning');
        scanner.classList.add('scanned-success');
        statusText.textContent = '✔️ BIOMETRIC VERIFICATION SUCCESSFUL';
        biometricVerified = true;
        nextBtn.removeAttribute('disabled');
    }, 2000);
}

function toggleCargoItem(element, riskDelta) {
    if (riskDelta === 0) return;

    if (element.classList.contains('inspected-danger')) {
        element.classList.remove('inspected-danger');
        element.classList.add('inspected-clean');
        element.querySelector('.cargo-status').textContent = 'CLEAN';
        element.querySelector('.cargo-status').className = 'cargo-status status-clean';
        currentRiskIndex = Math.max(0, currentRiskIndex - riskDelta);
        activeViolation = activeViolation.filter(v => v !== `Contraband carried: ${element.querySelector('.cargo-name').textContent}`);
    } else {
        element.classList.remove('inspected-clean');
        element.classList.add('inspected-danger');
        element.querySelector('.cargo-status').textContent = `HAZARD (+${riskDelta}%)`;
        element.querySelector('.cargo-status').className = 'cargo-status status-danger';
        currentRiskIndex += riskDelta;
        activeViolation.push(`Contraband carried: ${element.querySelector('.cargo-name').textContent}`);
    }
    updateRiskDisplay();
}

function checkVoidEncounter(selectElem) {
    const val = parseInt(selectElem.value);

    currentRiskIndex = Math.max(0, currentRiskIndex - lastVoidRisk);
    activeViolation = activeViolation.filter(v => v !== 'Undeclared Void / Temporal Rift exposure');

    if (val > 0) {
        currentRiskIndex += val;
        activeViolation.push('Undeclared Void / Temporal Rift exposure');
    }

    lastVoidRisk = val;
    updateRiskDisplay();
}

function startFinalEvaluation() {
    goToStep(4);
    const log = document.getElementById('terminal-log-output');
    const bar = document.getElementById('progress-bar-fill');

    const logs = [
        "Decrypting interstellar database...",
        "Cross-referencing quantum criminal records...",
        "Calculating final security risk coefficient...",
        "Evaluating High Council decree protocol..."
    ];

    let progress = 0;
    let logIdx = 0;

    const interval = setInterval(() => {
        progress += 2;
        bar.style.width = `${progress}%`;

        if (progress % 25 === 0 && logIdx < logs.length) {
            log.textContent = logs[logIdx];
            logIdx++;
        }

        if (progress >= 100) {
            clearInterval(interval);
            finalizeDecision();
        }
    }, 40);
}

function finalizeDecision() {
    const name = document.getElementById('applicant-name').value;
    const origin = document.getElementById('origin-select').value;
    const species = document.getElementById('species-select').value;
    const reason = document.querySelector('input[name="reason"]:checked').value;

    document.getElementById('view-terminal').classList.remove('active-view');

    const isApproved = currentRiskIndex <= 40;

    if (isApproved) {
        document.getElementById('pass-name').textContent = name.toUpperCase();
        document.getElementById('pass-origin').textContent = origin;
        document.getElementById('pass-species').textContent = species;
        document.getElementById('pass-reason').textContent = reason;
        document.getElementById('pass-species-badge').textContent = `${species} // VERIFIED`;

        document.getElementById('view-passport').classList.add('active-view');
    } else {
        document.getElementById('reject-name').textContent = name.toUpperCase();
        document.getElementById('reject-origin').textContent = origin;

        const violationListElm = document.getElementById('violation-list');
        violationListElm.innerHTML = '';
        activeViolation.forEach(v => {
            const li = document.createElement('li');
            li.textContent = v;
            violationListElm.appendChild(li);
        });

        if (activeViolation.length === 0) {
            const li = document.createElement('li');
            li.textContent = `Cumulative Risk Index exceeded acceptable threshold (${currentRiskIndex}% > 40%).`;
            violationListElm.appendChild(li);
        }
        document.getElementById('view-rejection').classList.add('active-view');
    }
}

function switchPassTab(evt, tabId) {
    document.querySelectorAll('.pass-tab').forEach(t => t.classList.remove('active-tab'));
    document.querySelectorAll('.pass-tab-content').forEach(c => c.classList.remove('active-pass-content'));

    evt.currentTarget.classList.add('active-tab');
    document.getElementById(tabId).classList.add('active-pass-content');
}

function resetCheckpoint() {
    currentRiskIndex = 0;
    biometricVerified = false;
    activeViolation = [];
    lastVoidRisk = 0;
    updateRiskDisplay();

    document.getElementById('applicant-name').value = '';
    document.getElementById('palm-scanner').classList.remove('scanned-success');
    document.getElementById('palm-status-text').textContent = 'CLICK HERE TO INITIATE QUANTUM DNA SCAN';
    document.getElementById('btn-step1').setAttribute('disabled', 'true');
    document.getElementById('void-encounter').selectedIndex = 0;

    document.querySelectorAll('.cargo-item').forEach(item => {
        item.classList.remove('inspected-danger', 'inspected-clean');
        item.querySelector('.cargo-status').textContent = 'CLEAN';
        item.querySelector('.cargo-status').className = 'cargo-status status-clean';
    });

    document.getElementById('view-passport').classList.remove('active-view');
    document.getElementById('view-rejection').classList.remove('active-view');
    document.getElementById('view-terminal').classList.add('active-view');
    goToStep(1);
}