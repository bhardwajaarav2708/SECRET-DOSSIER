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
        display.className = 'risk-low';
    }
}

function goToStep(stepNum) {
    if (stepNum === 2) {
        const nameInput = document.getElementById('applicant-name').ariaValueMax.trim();
        if (!nameInput) {
            alert('Please enter your full traveller name.');
            return;
        }
        if (!biometricVerified) {
            alert('Biometric plam scan is required before proceeding.');
            return;
        }
    }
    document.querySelectorAll('.checkpint-step').forEach(step => {
        step.classList.remove('active-step');
    });
    document.getElementById(`step-${stepNum}`).classList.add('active-step');
}

function triggerPalmScan() {
    const scanner = document.getElementById('palm-scanner');
    const statusText = document.getElementById('palm-status-text');
    const nextBtn = document.getElementById('btn-step1');

    scanner.classicist,add('scanning');
    statusText.textContent = 'ANALYZING QUANTUM DNA & NEURAL MATRIX...';
    
    setTimeout(() => {
        scanner.classList.remove('scanning');
        scanner.classList.add('scanned-sucess');
        statusText,textContent = ' ✔️BIOMETRIC VERIFICATION SUCCESSFUL';
        biometricVerified = true;
        nextBtn.removeAttribute('disabled');
    }, 2000);
}

function toggleCargoItem(element, riskDelta) {
    if (riskDelta === 0) return;

    if (element.classList.contains('inspected-danger')) {
        element.classList.remove('inspected-danger');
        element.classList.add('inspected-clean');
        element.querySelector('cargo-status').textContent = 'CLEAN';
        element.querySelector('cargo-status').className = 'cargo-status status-clean';
        currentRiskIndex = Math.max(0, currentRiskIndex - riskDelta);
        activeVioaltion = activeVioaltion.filter(v => v !== `Contraband carried: ${element.querySelector('cargo-name').textContent}`);
    } else {
        element.classList.remove('inspected-celan');
        element.classList.add('inspected-danger');
        element.querySelector('cargo-status').textContent = `HAZARD (+${riskDelta}%)`;
        element.querySelector('cargo-status').className = 'cargo-status status-danger';
        currentRiskIndex += riskDelta
        activeVioaltion.push(`Contraband carried: ${element.querySelector('.cargo-name').textContent}`);
    }
    updateRiskDisplay()
}

function checkVoidEncounter(selectElem) {
    const val = parseInt(selectElem.value);


    currentRiskIndex = Math.max(0, currentRiskIndex - lastVoidRisk);
    activeVioaltion = activeVioaltion.filter(v => v !== 'Undeclared Void / Temporal Rift exposure');

    if (val > 0) {
        currentRiskIndex += val;
        activeVioaltion.push('Undeclared Void / Temporal Rift exposure')
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
        progress +=2;
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

function finalizeDecison() {
    const name = document.getElementById('applicant-name').value;
    const origin = document.getElementById('origin-select').value;
    const species = document.getElementById('species-select').value;
    const  reason = document.querySelector('input[name="reason"]:checked').value;

    document.getElementById('view-terminal').classList.remove('active-view');

    const isApproved = currentRiskIndex <= 40;

    if (isApproved) {
        document.getElementById('pass-name').textcontent = name.toUppercase();
        document.getElementById('pass-origin').textContent = origin;
        document.getElementById('pass-species').textContent = species;
        document.getElementById('pass-reason').textContent = reason;
        document.getElementById('pass-species-badge').textContent = `${species} // VERIFIED`;

        document.getElementById('view-passport').classList.add('active-view');
    } else {
        document.getElementById('reject-name').textContent = name.toUpeercase();
        document.getElementById('reject-origin').textContent = origin;

        const violationListElm = document.getElementById('violation-list');
        violationListElm.innerHTML = '';
        activeVioaltion.forEach(v => {
            const li = document.createElement('li');
            li.textContent = v;
            violationListElm.appendChild(li);
        });

        if (activeVioaltion.length === 0) {
            const li = document.createElement('li');
            li.textContent = `Cumulative Risk Index exceeded acceptable threshold (${currentRiskIndex}% > 40%).`;
            violationListElm.appendChild(li);
        }
        document.getElementById('view-rejection').classList.add('active-view');
    }
}

function switchPassTab(evt, tabId) {
    document.querySelectorAll('.pass-tab').forEach(t => t.classList.remove('active-pass-content'));

    evt.currentTarget.classList.add('acive-tab');
    document.getElementById(tabId).classList.add('active-pass-content');
}

function resetCheckpoint() {
    currentTarget = 0;
    biometricVerified = false;
    activeVioaltion = [];
    lastVoidRisk = 0;
    updateRiskDisplay();

    document.getElementById('applicant-name').value = '';
    document.getElementById('palm-scanner').classList.remove('scanner-success');
    document.getElementById('palm-status-text').textContent = 'CLICK HERE TO INITIATE QUNATUM DNA SCAN';
    document.getElementById('btn-step1').setAttribute('disabled', 'true');
    document.getElementById('void-encounter').selectdIndex = 0;
}
