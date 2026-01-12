import * as logic from './gameLogic.js';
import * as ui from './ui.js';

async function init() {
    await logic.loadGameData()
    setupEventListeners();
    if (logic.gameData && logic.gameData.length > 0) {
        displayRiddle(logic.currentDisplayIndex);
    } else {
        console.error("No cryptic clues available, sorry!");
    }
}

function renderNextUnsolved(startIndex = 0) {
    const index = logic.gameData.findIndex((r, i) => i >= startIndex && !r.solved);

    if (index === -1) {
        index = logic.gameData.findIndex(r => !r.solved);
    }

    if (index !== -1) {
        displayRiddle(index);
    } else {
        showFinalScreen();
    }
}

function displayRiddle(index) {
    logic.updateCurrentIndex(index);
    const riddle = logic.gameData[index];
    document.getElementById('clue').innerText = riddle.clue;
    ui.createPhrase(riddle.answer);
    if (riddle.solved) {
        ui.updateButtonState(true);
        const inputs = document.querySelectorAll('.letter-box');
        inputs.forEach((input, i) => {
            input.value = riddle.answer.replace(/\s/g, "")[i] || "";
            input.classList.add('correct');
            input.disabled = true;
        });
    } else {
        ui.updateButtonState(false);
    }
    document.getElementById('checkButton').disabled = false;
}

export function handleCheck() {
    const riddle = logic.gameData[logic.currentDisplayIndex];
    if (!riddle || riddle.solved) return;

    const inputs = document.querySelectorAll('.letter-box');
    let guess = "";
    inputs.forEach(i => guess += i.value);

    const cleanAnswer = riddle.answer.replace(/\s/g, "").toLowerCase();

    if (guess.toLowerCase() === cleanAnswer) {
        logic.setSolved();
        ui.showSuccessEffect();

        const checkBtn = document.getElementById('checkButton');
        checkBtn.disabled = true;

        ui.updateButtonState(true);

        const inputs = document.querySelectorAll('.letter-box');

        if (document.activeElement) {
            document.activeElement.blur();
        }

        inputs.forEach(input => {
            input.classList.add('correct');
            input.disabled = true;
        });
    } else {
        ui.applyShake();
    }
}

function showFinalScreen() {
    document.getElementById('clue').innerText = "Congratulations! You solved all cryptic clues.";
    document.getElementById('answerRow').innerHTML = "";
    document.querySelector('.button-container').style.display = "none";
    document.querySelector('.length-indicator').innerText = "";
}

function setupEventListeners() {
    const clueElement = document.getElementById('clue');
    const checkBtn = document.getElementById('checkButton');

    if (checkBtn) {
        checkBtn.addEventListener('click', handleCheck);
    }

    document.getElementById('nextButton').addEventListener('click', () => {
        renderNextUnsolved(logic.currentDisplayIndex + 1);
    });

    document.getElementById('skipButton').addEventListener('click', () => {
        let idx = logic.gameData.findIndex((r, i) => i > logic.currentDisplayIndex && !r.solved);
        if (idx === -1) idx = logic.gameData.findIndex(r => !r.solved);
        if (idx !== -1) displayRiddle(idx);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const nextBtn = document.getElementById('nextButton');
            const modal = document.getElementById('successModal');

            if (modal && modal.classList.contains('modal-show')) {
                modal.classList.remove('modal-show');
                nextBtn.click();
                return;
            }

            if (nextBtn && !nextBtn.classList.contains('hidden')) {
                nextBtn.click();
            } else {
                handleCheck();
            }
            e.preventDefault();
        }
    });
}

document.addEventListener('DOMContentLoaded', init);

