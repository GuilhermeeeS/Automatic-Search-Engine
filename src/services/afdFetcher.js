const { spawnSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

function getToday() {
    const now = new Date();
    return { day: now.getDate(), month: now.getMonth() + 1, year: now.getFullYear() };
}

async function fetchAFD(ip, user, pass) {
    const folder = path.join('AFDs', ip);
    fs.ensureDirSync(folder);

    const today = getToday();
    const filename = `AFD_${today.year}-${today.month}-${today.day}.txt`;
    const outputPath = path.join(folder, filename);

    // LOGIN
    const login = spawnSync('curl', [
        '-k', '-s', '-X', 'POST',
        '-H', 'Content-Type: application/json',
        '-d', JSON.stringify({ login: user, password: pass }),
        `https://${ip}/login.fcgi`
    ]);

    const loginOutput = login.stdout.toString();
    console.log(`Resposta login do IP ${ip}:`, loginOutput);

    let session;
    try {
        session = JSON.parse(loginOutput).session;
        if (!session) throw new Error('Login falhou, sessão não retornada');
    } catch (err) {
        throw new Error(`Erro parse login IP ${ip}: ${err.message}`);
    }

    // Delay de 3 segundos antes de baixar o AFD
    await new Promise(resolve => setTimeout(resolve, 3000));

    // BODY para o get_afd
    const body = JSON.stringify({ initial_date: today });

    // DOWNLOAD DO AFD
    const afd = spawnSync('curl', [
        '-k', '-s', '-X', 'POST',
        '-H', 'Content-Type: application/json',
        '-d', body,
        `https://${ip}/get_afd.fcgi?session=${session}&mode=671`,
        '-o', outputPath
    ]);

    if (afd.error) throw afd.error;

    console.log(`AFD salvo em: ${outputPath}`);
    return outputPath;
}

module.exports = { fetchAFD }