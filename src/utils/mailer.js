async function sendEmail(subject, text) {
    // Apenas imprime no console para testar
    console.log('=== ALERTA (TESTE) ===');
    console.log('Assunto:', subject);
    console.log('Mensagem:', text);
    console.log('=======================');
}

module.exports = { sendEmail };
