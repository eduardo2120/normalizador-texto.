const fs = require('fs');
// Importamos el nuevo SDK oficial de OpenAI
const OpenAI = require('openai');

// 1. Configuramos el cliente de OpenAI
const openai = new OpenAI({
  // ¡LA CLAVE! Apuntamos a nuestro servidor local de LM Studio
  baseURL: 'http://localhost:1234/v1',
  // Usamos una clave API ficticia (requerida por el SDK)
  apiKey: 'not-needed-for-local'
});

// Función principal asíncrona
async function chatearConModeloLocal() {
  try {
    // 2. Leemos el prompt desde nuestro archivo de entrada
    const promptUsuario = fs.readFileSync('entrada.txt', 'utf-8');
    console.log(`Enviando prompt: "${promptUsuario}"`);

    // 3. ¡La nueva forma! Usamos el método 'chat.completions.create'
    const chatCompletion = await openai.chat.completions.create({
      // El formato 'messages' es el estándar de OpenAI
      messages: [
        {
          role: 'system',
          content: 'Eres un analista de negocios experto. Tu trabajo es resumir texto en 3 bullet points clave.'
        },
        {
          role: 'user',
          content: `Genera un resumen de 3 bullet points del siguiente reporte:\n\n${promptUsuario}`
        }
      ],
      model: 'mistral-7b-instruct', // Cambia aquí el nombre del modelo que cargues en LM Studio
      temperature: 1.2 // Controla la creatividad
    });

    // 4. Extraemos y mostramos la respuesta
    const respuesta = chatCompletion.choices[0].message.content;
    console.log('\nRespuesta del modelo:\n');
    console.log(respuesta);

    // 5. Guardamos la respuesta en el archivo de salida
    fs.writeFileSync('salida.txt', respuesta);
    console.log('\n✅ Respuesta guardada en "salida.txt"');
  } catch (error) {
    console.error('\n❌ Ha ocurrido un error:');
    if (error.code === 'ECONNREFUSED') {
      console.error('Error: No se pudo conectar. ¿Iniciaste el servidor en LM Studio?');
    } else {
      console.error(error.message);
    }
  }
}

// Ejecutamos la función
chatearConModeloLocal();
