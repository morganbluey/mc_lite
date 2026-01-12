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
                if (input.value.length > 1) {
                    input.value = input.value.slice(-1);
                }

                if (input.value !== "") {
                    const next = input.nextElementSibling;
                    if (next && next.classList.contains('letter-box')) {
                        next.focus();
                    }
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace') {
                    if (input.value !== "") {
                        input.value = "";
                    } else {
                        const prev = input.previousElementSibling;
                        if (prev && prev.classList.contains('letter-box')) {
                            prev.focus();
                            prev.value = "";
                        }
                    }
                    e.preventDefault();
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