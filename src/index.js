require('dotenv').config();
const { fetchAFD } = require('./services/afdFetcher');
const { logSuccess, logError } = require('./utils/logger');
const { sendEmail } = require('./utils/mailer');
const config = require('../config/config.json');

async function main() {
    for (const ip of config.ipList) {
        try {
            const file = await fetchAFD(ip, process.env.USER_RELOGIO, process.env.PASS_RELOGIO);
            logSuccess(`AFD baixado com sucesso do IP ${ip}: ${file}`);
        } catch (err) {
            logError(`Erro ao baixar AFD do IP ${ip}: ${err.message}`);
            await sendEmail(`Erro AFD - IP ${ip}`, err.message); // aqui só printa
        }
    }
    console.log('Execução finalizada.');
}

main();
