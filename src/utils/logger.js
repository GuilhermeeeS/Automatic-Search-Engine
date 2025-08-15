const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../../logs/execution.log');

function logSuccess(message) {
    const log = `[SUCCESS] ${new Date().toISOString()} - ${message}\n`;
    console.log(log);
    fs.appendFileSync(logFile, log);
}

function logError(message) {
    const log = `[ERROR] ${new Date().toISOString()} - ${message}\n`;
    console.error(log);
    fs.appendFileSync(logFile, log);
}

module.exports = { logSuccess, logError };
