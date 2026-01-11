const defaultRiddles = [
    { "id": 1, clue: "Double-ended arc during open accessed Killer Whale", answer: "orca", solved: false },
    { "id": 2, clue: "Devious retrogressed Live", answer: "evil", solved: false }
];

export let gameData = [];
export let currentDisplayIndex = 0;

export async function loadGameData() {
    const saved = localStorage.getItem('myRiddleProgress');
    if (saved) {
        gameData = JSON.parse(saved);
        return;
    }
        try {
            const response = await fetch('riddles.json');
            if (!response.ok) throw new Error("File not found");
            gameData = await response.json();
        } catch (error) {
            console.error("Error during load (now using fallback):", error);
            gameData = defaultRiddles; 
        }
}

export function updateCurrentIndex(index) {
    currentDisplayIndex = index;
}

export function setSolved() {
    gameData[currentDisplayIndex].solved = true;
    localStorage.setItem('myRiddleProgress', JSON.stringify(gameData));
}