const fs = require('fs');
const path = require('path');
const appConfig = require('../config/app.json');

const logFile = path.join(appConfig.basePath, 'logs', 'afd-system.log');

function ensureLogDir() {
    const logDir = path.dirname(logFile);
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
}

function logSuccess(message) {
    ensureLogDir();
    const log = `[SUCCESS] ${new Date().toISOString()} - ${message}\n`;
    console.log(log.trim());
    fs.appendFileSync(logFile, log);
}

function logError(message) {
    ensureLogDir();
    const log = `[ERROR] ${new Date().toISOString()} - ${message}\n`;
    console.error(log.trim());
    fs.appendFileSync(logFile, log);
}

function logInfo(message) {
    ensureLogDir();
    const log = `[INFO] ${new Date().toISOString()} - ${message}\n`;
    console.log(log.trim());
    fs.appendFileSync(logFile, log);
}

module.exports = { logSuccess, logError, logInfo };