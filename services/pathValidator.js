const fs = require('fs-extra');
const path = require('path');

async function validateAndCreatePath(basePath) {
    try {
        await fs.ensureDir(basePath);
        
        const testFile = path.join(basePath, '.test_write_access');
        await fs.writeFile(testFile, 'test');
        await fs.remove(testFile);
        
        return { success: true, message: `Caminho validado: ${basePath}` };
    } catch (error) {
        return { 
            success: false, 
            message: `Erro ao validar caminho ${basePath}: ${error.message}` 
        };
    }
}

module.exports = { validateAndCreatePath };

