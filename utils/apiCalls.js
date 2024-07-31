import axios from "axios";
import { logYellow } from './logColors.js';

// Utility function to delay execution
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Utility function to get a random delay between 2500ms and 5000ms
const randomDelay = Math.floor(Math.random() * (5000 - 2500 + 1)) + 2500;

// Base API URL
const BASE_API_URL = "https://app.0xterminal.game/api";

// Function to make an API call with a specified method, endpoint, and data
async function callAPI(method, endpoint, data, AUTH_TOKEN) {
    const url = `${BASE_API_URL}/${endpoint}`;
    try {
        // await delay(randomDelay);
        // const response = await axios({
        //     method,
        //     url,
        //     data,
        //     headers: {
        //         'Cookie': AUTH_TOKEN,
        //         'content-type': "application/json",
        //         'sec-ch-ua': "\"Chromium\";v=\"123\", \"Not:A-Brand\";v=\"8\"",
        //         'sec-ch-ua-mobile': "?0",
        //         'sec-ch-ua-platform': "\"Windows\"",
        //     }
        // });
        // logYellow(`[INFO] ${method.toUpperCase()} /${endpoint}`);
        // return response.data;
        await delay(randomDelay);
        const config = {
            method,
            url,
            headers: {
                'Cookie': AUTH_TOKEN,
                'sec-ch-ua': "\"Chromium\";v=\"123\", \"Not:A-Brand\";v=\"8\"",
                'sec-ch-ua-mobile': "?0",
                'sec-ch-ua-platform': "\"Windows\"",
            }
        };

        // Add data to config only if it's not null
        if (data !== null) {
            config.data = data;
            config.headers['content-type'] = "application/json";
        }

        const response = await axios(config);
        logYellow(`[INFO] ${method.toUpperCase()} /${endpoint}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        process.exit(1);
    }
}

// API wrappers using the generic callAPI function
async function callLastAPI(AUTH_TOKEN) {
    return callAPI('GET', 'game/last', null, AUTH_TOKEN);
}

async function callCreateAPI(AUTH_TOKEN) {
    return callAPI('POST', 'game/create', null, AUTH_TOKEN);
}

async function callMoveAPI(body, AUTH_TOKEN) {
    return callAPI('POST', 'game/move', body, AUTH_TOKEN);
}

async function callUserAPI(AUTH_TOKEN) {
    return callAPI('GET', 'statistic/user', null, AUTH_TOKEN);
}

export { callCreateAPI, callLastAPI, callMoveAPI, callUserAPI };
