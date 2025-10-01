const { spawnSync } = require('child_process');
const path = require('path');
const appConfig = require('../config/app.json');

function getToday() {
    const now = new Date();
    return { day: now.getDate(), month: now.getMonth() + 1, year: now.getFullYear() };
}

function generateFileName(serial) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    
    return `AFD${serial}${year}${month}${day}${hour}${minute}${second}.txt`;
}

async function fetchAFD(ip, serial) {
    let currentRetry = 0;
    
    while (currentRetry <= appConfig.maxRetries) {
        try {
            console.log(`[${ip}] Tentativa ${currentRetry + 1}/${appConfig.maxRetries + 1}`);
            
            const filename = generateFileName(serial);
            const outputPath = path.join(appConfig.basePath, filename);

            const login = spawnSync('curl', [
                '-k', '-s', '-X', 'POST',
                '-H', 'Content-Type: application/json',
                '-d', JSON.stringify({ login: "admin", password: "14e13y5a" }),
                `https://${ip}/login.fcgi`
            ]);

            const loginOutput = login.stdout.toString();
            console.log(`[${ip}] Resposta login:`, loginOutput);

            let session;
            try {
                const loginData = JSON.parse(loginOutput);
                session = loginData.session;
                if (!session) throw new Error('Login falhou, sessão não retornada');
            } catch (err) {
                throw new Error(`Erro parse login: ${err.message}`);
            }

            await new Promise(resolve => setTimeout(resolve, 3000));
            
            const today = getToday();
            const body = JSON.stringify({ initial_date: today });

            const afd = spawnSync('curl', [
                '-k', '-s', '-X', 'POST',
                '-H', 'Content-Type: application/json',
                '-d', body,
                `https://${ip}/get_afd.fcgi?session=${session}&mode=671`,
                '-o', outputPath
            ]);

            if (afd.error) throw afd.error;

            console.log(`[${ip}] AFD salvo em: ${outputPath}`);
            return outputPath;
            
        } catch (error) {
            currentRetry++;
            
            if (currentRetry > appConfig.maxRetries) {
                throw new Error(`Falha após ${appConfig.maxRetries + 1} tentativas: ${error.message}`);
            }
            
            console.log(`[${ip}] Erro na tentativa ${currentRetry}: ${error.message}`);
            console.log(`[${ip}] Aguardando ${appConfig.retryDelay}ms antes da próxima tentativa...`);
            
            await new Promise(resolve => setTimeout(resolve, appConfig.retryDelay));
        }
    }
}

module.exports = { fetchAFD };