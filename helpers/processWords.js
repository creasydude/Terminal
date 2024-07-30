const readline = require('readline');
const { EOL } = require('os');

function parseJsonInput(callback) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let lines = [];
    console.log('To obtain JSON, follow these steps: \n1. Enter the game. \n2. Press F12 in your browser (Open DevTools by any method). \n3. Go to the Network section. \n4. Find the object named last. \n5. Copy all the code that is in the Response tab');
    console.log('If such an element is not present, try exiting the current match and entering again. \nAlso, for each new match, you need to perform this trick again with a new last element');
    console.log("\nEnter JSON (press Enter twice to finish input):");

    rl.on('line', (line) => {
        if (line.trim() === '') {
            rl.close();
        } else {
            lines.push(line);
        }
    });

    rl.on('close', () => {
        const jsonInput = lines.join(EOL);
        try {
            const data = JSON.parse(jsonInput);
            const wordsList = data.words || [];
            callback(wordsList);
        } catch (error) {
            console.log("JSON input error. Please enter valid JSON.");
            callback(null);
        }
    });
}

function keepAndCountVerticalMatchingWords(sortedMatrix, firstWord) {
    const firstWordLetters = Array.from(firstWord);

    function countVerticalMatches(row) {
        return row.reduce((count, letter, i) => 
            i < firstWordLetters.length && letter === firstWordLetters[i] ? count + 1 : count, 0);
    }

    return sortedMatrix.map(row => [...row, countVerticalMatches(row)]);
}

function digStrDel(origString) {
    return origString.replace(/[0-9]/g, '');
}

function dobavlenieVesa(resultMatrix, resultLetterCounts) {
    return resultMatrix.map(row => {
        const rowSum = row.reduce((sum, char) => sum + (resultLetterCounts[char] || 0), 0);
        return [...row, rowSum];
    });
}

function countLetterOccurrences(matrix) {
    const letterCounts = {};

    for (const row of matrix) {
        for (const letter of row) {
            if (/[a-zA-Z]/.test(letter)) {
                letterCounts[letter] = (letterCounts[letter] || 0) + 1;
            }
        }
    }

    return letterCounts;
}

function findUniqueLetters(matrix) {
    const uniqueLetters = new Set();

    for (const row of matrix) {
        for (const letter of row) {
            if (/[A-Z]/.test(letter)) {
                uniqueLetters.add(letter);
            }
        }
    }

    return Array.from(uniqueLetters).sort();
}

function printMatrix(matrix) {
    matrix.forEach(row => console.log(row));
}

function createWordMatrix(words) {
    return words.map(word => Array.from(word));
}

function viborSlova(sortedMatrix, callback) {
    const choice1 = digStrDel(sortedMatrix[0].join(''));
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question(`\nChoose the word ${choice1} and enter the number of matches for the word (number):`, (choiceResult) => {
        rl.close();
        callback(choiceResult);
    });
}

function kolvoSovpad(sortedMatrix, kolvoSovpad) {
    console.log(sortedMatrix, kolvoSovpad);
    return 0;
}

function vivodSovpad(sortedMatrix, kolvoSovpad) {
    const wordsLength = sortedMatrix[0].length - 1;
    return sortedMatrix.filter(word => parseInt(word[wordsLength]) === parseInt(kolvoSovpad));
}

function main() {
    let activityCount = 0;

    parseJsonInput((wordsList) => {
        if (!wordsList) return;

        let resultMatrix = createWordMatrix(wordsList);
        const resultLetterCounts = countLetterOccurrences(resultMatrix);
        resultMatrix = dobavlenieVesa(resultMatrix, resultLetterCounts);
        let sortedMatrix = resultMatrix.sort((a, b) => b[b.length - 1] - a[a.length - 1]);

        console.log("\nSorted matrix by word weight in descending order:");
        printMatrix(sortedMatrix);

        const wordsLength = sortedMatrix[1].length - 1;
        sortedMatrix.forEach(row => row.pop());

        function gameLoop() {
            activityCount++;
            viborSlova(sortedMatrix, (kolvoSovpad) => {
                if (parseInt(kolvoSovpad) === wordsLength) {
                    console.log('You won');
                    return;
                }
                console.log('User actions count:', activityCount);
                if (activityCount === 4) {
                    console.log("You lost");
                    return;
                }

                const filteredMatrix = keepAndCountVerticalMatchingWords(sortedMatrix, sortedMatrix[0]);
                console.log('Options matrix');
                sortedMatrix = vivodSovpad(filteredMatrix, kolvoSovpad);
                printMatrix(sortedMatrix);
                sortedMatrix.forEach(row => row.pop());

                gameLoop();
            });
        }

        gameLoop();
    });
}

main();
