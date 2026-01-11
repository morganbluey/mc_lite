import * as logic from './gameLogic.js';
import * as ui from './ui.js';

async function init() {
    await logic.loadGameData()
    setupEventListeners();
    if (logic.gameData && logic.gameData.length > 0) {
        renderNextUnsolved(); 
    } else {
        console.error("No cryptic clues available, sorry!");
    }
}

function renderNextUnsolved() {
    const index = logic.gameData.findIndex(r => !r.solved);
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
    ui.updateButtonState(false);
}

function handleCheck() {
    const riddle = logic.gameData[logic.currentDisplayIndex];
    if (!riddle) return;

    const inputs = document.querySelectorAll('.letter-box');
    let guess = "";
    inputs.forEach(i => guess += i.value);

    const cleanAnswer = riddle.answer.replace(/\s/g, "").toLowerCase();

    if (guess.toLowerCase() === cleanAnswer) {
        logic.setSolved();
        ui.showSuccessEffect();
        ui.updateButtonState(true);

        const inputs = document.querySelectorAll('.letter-box');
        inputs.forEach(input => {
            input.classList.add('correct');
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
    
    document.getElementById('nextButton').addEventListener('click', renderNextUnsolved);

    document.getElementById('skipButton').addEventListener('click', () => {
        let idx = logic.gameData.findIndex((r, i) => i > logic.currentDisplayIndex && !r.solved);
        if (idx === -1) idx = logic.gameData.findIndex(r => !r.solved);
        if (idx !== -1) displayRiddle(idx);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (document.activeElement !== document.getElementById('clue')) {
                e.preventDefault();
                handleCheck();
            } else {
                clueElement.blur();
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', init);

