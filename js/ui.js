export function createPhrase(phrase) {
    const container = document.getElementById('answerRow');
    const phraseLengthDisplay = document.querySelector('.length-indicator');

    if (phraseLengthDisplay) {
        const lengths = phrase.split(" ").map(w => w.length).join(", ");
        phraseLengthDisplay.innerText = `(${lengths})`;
    }

    container.innerHTML = '';
    const words = phrase.split(" ");

    words.forEach((word, wordIndex) => {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'word-container';

        word.split('').forEach((letter, letterIndex) => {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'letter-box';
            input.maxLength = 1;
            input.name = `letter-${wordIndex}-${letterIndex}`;
            input.autocomplete = 'off';

            input.addEventListener('input', (e) => {
                if (e.target.value.length === 1) {
                    let next = input.nextElementSibling;
                    if (!next && wordDiv.nextElementSibling) {
                        next = wordDiv.nextElementSibling.querySelector('.letter-box');
                    }
                    if (next) next.focus();
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && e.target.value === '') {
                    let prev = input.previousElementSibling;
                    if (!prev && wordDiv.previousElementSibling) {
                        prev = wordDiv.previousElementSibling.querySelector('.letter-box:last-child');
                    }
                    if (prev) prev.focus();
                }
            });

            input.addEventListener('focus', () => input.select());
            wordDiv.appendChild(input);
        });
        container.appendChild(wordDiv);
    });

    const firstInput = container.querySelector('.letter-box');
    if (firstInput) firstInput.focus();
}

export function showSuccessEffect() {
    const modal = document.getElementById('successModal');
    const modalContent = modal.querySelector('.modal-content');
    modal.classList.add('modal-show');
    
    setTimeout(() => {
        modalContent.classList.add('modal-exit');
        setTimeout(() => {
            modal.classList.remove('modal-show');
            modalContent.classList.remove('modal-exit');
        }, 400);
    }, 1200);
}

export function applyShake() {
    const container = document.getElementById('answerRow');
    container.classList.add('apply-shake');
    setTimeout(() => container.classList.remove('apply-shake'), 300);
}

export function updateButtonState(isCorrect) {
    const skipBtn = document.getElementById('skipButton');
    const checkBtn = document.getElementById('checkButton');
    const nextBtn = document.getElementById('nextButton');

    skipBtn.disabled = isCorrect;
    if (isCorrect) {
        checkBtn.classList.add('hidden');
        nextBtn.classList.remove('hidden');
    } else {
        checkBtn.classList.remove('hidden');
        nextBtn.classList.add('hidden');
    }
}