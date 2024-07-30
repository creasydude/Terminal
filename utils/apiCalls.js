import axios from "axios";

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const randomDelay = Math.floor(Math.random() * (5000 - 2500 + 1)) + 2500;


async function callLastAPI(AUTH_TOKEN) {
    const LAST_API_URL = "https://app.0xterminal.game/api/game/last"
    try {
        await delay(randomDelay);
        const response = await axios.get(LAST_API_URL, {
            headers: {
                'Cookie': AUTH_TOKEN,
                'sec-ch-ua': "\"Chromium\";v=\"123\", \"Not:A-Brand\";v=\"8\"",
                'sec-ch-ua-mobile': "?0",
                'sec-ch-ua-platform': "\"Windows\"",
            }
        });
        // console.log("LAST API response:", response.data);
        console.log("[INFO] GET /last");
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        process.exit(1)
    }
}

async function callCreateAPI(AUTH_TOKEN) {
    const CREATE_API_URL = "https://app.0xterminal.game/api/game/create"
    try {
        await delay(randomDelay);
        const response = await axios.post(CREATE_API_URL, null, {
            headers: {
                'Cookie': AUTH_TOKEN,
                'content-type': "application/json",
                'sec-ch-ua': "\"Chromium\";v=\"123\", \"Not:A-Brand\";v=\"8\"",
                'sec-ch-ua-mobile': "?0",
                'sec-ch-ua-platform': "\"Windows\"",
            }
        });
        // console.log("CREATE API response:", response.data);
        console.log("[INFO] POST /create");
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        process.exit(1)
    }
}

async function callMoveAPI(body, AUTH_TOKEN) {
    const MOVE_API_URL = "https://app.0xterminal.game/api/game/move"
    try {
        await delay(randomDelay);
        const response = await axios.post(MOVE_API_URL, body, {
            headers: {
                'Cookie': AUTH_TOKEN,
                'content-type': "application/json",
                'sec-ch-ua': "\"Chromium\";v=\"123\", \"Not:A-Brand\";v=\"8\"",
                'sec-ch-ua-mobile': "?0",
                'sec-ch-ua-platform': "\"Windows\"",
            }
        });
        // console.log("MOVE API response:", response.data);
        console.log("[INFO] POST /move");
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        process.exit(1)
    }
}

async function callUserAPI(AUTH_TOKEN) {
    const USER_API_URL = "https://app.0xterminal.game/api/statistic/user"
    try {
        await delay(randomDelay);
        const response = await axios.get(USER_API_URL, {
            headers: {
                'Cookie': AUTH_TOKEN,
                'sec-ch-ua': "\"Chromium\";v=\"123\", \"Not:A-Brand\";v=\"8\"",
                'sec-ch-ua-mobile': "?0",
                'sec-ch-ua-platform': "\"Windows\"",
            }
        });
        // console.log("LAST API response:", response.data);
        console.log("[INFO] GET /user");
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        process.exit(1)
    }
}

export { callCreateAPI, callLastAPI, callMoveAPI, callUserAPI }