import { promises as fs } from 'fs';
import path from 'path';
//Utils
import { callLastAPI, callCreateAPI, callMoveAPI, callUserAPI } from "./utils/apiCalls.js";
import { logBlue, logGreen, logRed } from './utils/logColors.js';

//Get Auth Tokens
const filePath = path.join(process.cwd(), 'authTokens.json');
const data = await fs.readFile(filePath, 'utf8');
const authTokens = JSON.parse(data);



// Guess Word Section

logRed("*.*.*.*.*.*.*.*.*.*. BY CREASY .*.*.*.*.*.*.*.*.*.*")
async function main() {
    for (const token of authTokens) {
        //Get The "User" data And Show It To The CLI
        const userResponse = await callUserAPI(token)
        const USER_GAMES_LEFT = userResponse?.info?.gamesLeft;
        const USER_EVM_ADDR = userResponse?.info?.evmAddress;
        const USER_MULTIPLIER = userResponse?.info?.totalMultiplier;
        const USER_WINRATE = userResponse?.statistic?.winrate;
        const USER_TOTAL_GAMES = userResponse?.statistic?.totalGames;
        const USER_TOTAL_SCORE = userResponse?.statistic?.totalScore;

        logGreen(`[INFO] ACCOUNT : ${USER_EVM_ADDR} | GAMES LEFT : ${USER_GAMES_LEFT} | MULTIPLIER : ${USER_MULTIPLIER} | WINRATE : ${USER_WINRATE}% | TOTAL GAMES : ${USER_TOTAL_GAMES} | TOTAL SCORE : ${USER_TOTAL_SCORE} `)

        if (USER_GAMES_LEFT <= 0) {
            logRed("[ERROR] GAMES LEFT 0 ERROR , SKIPPING");
            continue;
        }

        // *.*. Word Detection Section .*.*
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

        //Utils
        function getAmountGuessed(lastResponse, word) {
            const entry = lastResponse.wordGuessHistory.find(item => item.word === word);
            return entry ? entry.amountGuessed : null;
        }


        //Get The Word Array :
        let lastResponse = await callLastAPI(token);
        let wordsArray = lastResponse?.words;
        let words = wordsArray.slice();
        let userGameId = parseInt(lastResponse?.userGameId);
        let status = lastResponse?.status;
        if (words.length === 0) {
            logRed("[ERROR] No words found in the array.");
            process.exit(1);
        }

        for (let i = 1; i <= parseInt(USER_GAMES_LEFT); i++) {
            //Check If It Should Start A New Game
            if (status !== "IN_PROGRESS") {
                await callCreateAPI(token);
                lastResponse = await callLastAPI(token)
                wordsArray = lastResponse?.words;
                words = wordsArray.slice();
                userGameId = parseInt(lastResponse?.userGameId);
                status = lastResponse?.status;
            }

            //Main Word Detection
            while (status == "IN_PROGRESS") {
                logBlue(`[INFO] ${words.join(' | ')}`);
                const positions = getLetterPositions(words);
                const betterPosition = getBetterPosition(positions);

                if (!betterPosition) {
                    logRed("[ERROR] No better position found.");
                    return;
                }

                let betterWord;

                try {
                    betterWord = getBetterWord(words, betterPosition);
                    logGreen(`[INFO] Chosen Word : ${betterWord}`);
                    //API MOVE CALL
                    await callMoveAPI({ userGameId, guessWord: betterWord }, token)

                    words.splice(words.indexOf(betterWord), 1); // Remove the better word from the list
                } catch (e) {
                    logRed(`[ERROR] ${e.message}`);
                    return;
                }

                //Refresh The Last After The Move
                lastResponse = await callLastAPI(token)
                userGameId = parseInt(lastResponse?.userGameId);
                status = lastResponse?.status;

                if (status !== "IN_PROGRESS") {
                    wordsArray = lastResponse?.words;
                    words = wordsArray.slice();
                    continue
                }
                const coincidences = getAmountGuessed(lastResponse, betterWord);
                words = searchForMatchingWords(betterWord, words, parseInt(coincidences));

            }

        }

    }
}

await main()