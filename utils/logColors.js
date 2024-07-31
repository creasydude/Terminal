// Function to log messages in yellow
function logYellow(message) {
    console.log(`\x1b[33m%s\x1b[0m`, message); // ANSI escape code for yellow text
}

// Function to log messages in green
function logGreen(message) {
    console.log(`\x1b[32m%s\x1b[0m`, message); // ANSI escape code for green text
}

// Function to log messages in blue
function logBlue(message) {
    console.log(`\x1b[34m%s\x1b[0m`, message); // ANSI escape code for blue text
}

// Function to log messages in red
function logRed(message) {
    console.error(`\x1b[31m%s\x1b[0m`, message); // ANSI escape code for red text
}

export { logYellow, logBlue, logGreen, logRed }