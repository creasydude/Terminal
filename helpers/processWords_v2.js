import readline from "readline"

const wordsArray = [
    "INHIBITORS", "CAMOUFLAGE", "PROTECTIVE", "FLOURISHES", "CEREMONIES",
    "BEDRAGGLED", "PERFORMERS", "UNDERGOING", "DELIVERING", "DETERMINED",
    "APARTMENTS", "PERCENTAGE", "REINFORCED", "SCULPTURES", "COMPLETELY"
];

function getLetterPositions(words) {
    const positions = {};
    words.forEach(word => {
        for (let letter = 0; letter < word.length; letter++) {
            const key = `${word[letter]}${letter}`;
            if (positions[key]) {
                positions[key]++;
            } else {
                positions[key] = 1;
            }
        }
    });
    return positions;
}

function getBetterPosition(positions) {
    let betterPosition = null;
    let countPosition = 0;
    for (const [position, count] of Object.entries(positions)) {
        if (count > countPosition) {
            betterPosition = position;
            countPosition = count;
        }
    }
    return betterPosition;
}

function getBetterWord(words, betterPosition) {
    const betterWords = words.filter(word => word[parseInt(betterPosition[1])] === betterPosition[0]);
    
    if (betterWords.length === 0) {
        throw new Error("No words match the better position criteria.");
    }
    
    return betterWords[Math.floor(Math.random() * betterWords.length)];
}

function searchForMatchingWords(target, words, n) {
    return words.filter(word => {
        if (word === target) return false;
        let coincidences = 0;
        for (let letter = 0; letter < word.length; letter++) {
            if (word[letter] === target[letter]) {
                coincidences++;
            }
        }
        return coincidences === n;
    });
}

async function main() {
    let words = wordsArray.slice(); // Copy the array to avoid modifying the original

    if (words.length === 0) {
        console.error("[ERROR] No words found in the array.");
        return;
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const question = (query) => new Promise(resolve => rl.question(query, resolve));

    while (words.length > 0) {
        console.log(`[INFO] ${words.join(' | ')}`);
        const positions = getLetterPositions(words);
        const betterPosition = getBetterPosition(positions);

        if (!betterPosition) {
            console.error("[ERROR] No better position found.");
            rl.close();
            return;
        }

        try {
            const betterWord = getBetterWord(words, betterPosition);
            console.log(betterWord);
            words.splice(words.indexOf(betterWord), 1); // Remove the better word from the list
        } catch (e) {
            console.error(`[ERROR] ${e.message}`);
            rl.close();
            return;
        }

        const coincidences = await question(">");
        if (coincidences !== "!") {
            words = searchForMatchingWords(betterWord, words, parseInt(coincidences));
        } else {
            rl.close();
            return;
        }
    }

    rl.close();
}

main();
