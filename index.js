require('dotenv').config();
const { fetchAFD } = require('./services/afdFetcher');
const { validateAndCreatePath } = require('./services/pathValidator');
const { logSuccess, logError, logInfo } = require('./utils/logger');
const devicesConfig = require('./config/devices.json');
const appConfig = require('./config/app.json');

async function main() {
    logInfo('='.repeat(50));
    logInfo('Iniciando sistema de download de AFDs');
    logInfo(`Data/Hora: ${new Date().toLocaleString('pt-BR')}`);
    logInfo('='.repeat(50));
    
    try {
        if (appConfig.validatePath) {
            logInfo(`Validando caminho: ${appConfig.basePath}`);
            const pathValidation = await validateAndCreatePath(appConfig.basePath);
            
            if (!pathValidation.success) {
                logError(`Validação de caminho falhou: ${pathValidation.message}`);
                process.exit(1);
            }
            
            logSuccess(`Caminho validado: ${appConfig.basePath}`);
        }
        
        logInfo(`Total de dispositivos para processar: ${devicesConfig.devices.length}`);
        
        let successCount = 0;
        let errorCount = 0;
        
        for (const device of devicesConfig.devices) {
            try {
                logInfo(`Processando dispositivo ${device.ip} (Serial: ${device.serial})`);
                
                const file = await fetchAFD(
                    device.ip, 
                    device.serial, 
                    process.env.USER_RELOGIO, 
                    process.env.PASS_RELOGIO
                );
                
                logSuccess(`AFD baixado com sucesso: ${device.ip} → ${file}`);
                successCount++;
                
            } catch (err) {
                logError(`Erro ao processar ${device.ip}: ${err.message}`);
                errorCount++;
            }
        }
        
        logInfo('='.repeat(50));
        logInfo('RELATÓRIO FINAL');
        logInfo(`Total processados: ${devicesConfig.devices.length}`);
        logSuccess(`Sucessos: ${successCount}`);
        if (errorCount > 0) {
            logError(`Erros: ${errorCount}`);
        }
        logInfo('Sistema finalizado');
        logInfo('='.repeat(50));
        
        if (errorCount > 0 && successCount === 0) {
            process.exit(1);
        } else if (errorCount > 0) {
            process.exit(2);
        } else {
            process.exit(0);
        }
        
    } catch (err) {
        logError(`Erro crítico no sistema: ${err.message}`);
        process.exit(1);
    }
}

main();