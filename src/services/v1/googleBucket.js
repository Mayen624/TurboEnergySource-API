import path from 'path';
import { __dirname } from '#config/path.js';
import { Storage } from "@google-cloud/storage";

/**
 * Función para subir archivo al bucket
 * @param {Buffer} fileBuffer - Buffer del archivo
 * @param {string} fileName - Nombre del archivo en el bucket
 * @param {string} bucketDirectory - Nombre de la carpeta destino
 */
const uploadFileToBucket = async (fileBuffer, fileName, bucketDirectory) => {
    console.log(fileName)
    try {
        // Configura el cliente de Google Cloud Storage
        // Usa la variable de entorno GOOGLE_APPLICATION_CREDENTIALS
        const gc = new Storage({
            projectId: process.env.GOOGLE_PROJECT_ID
        });

        // Obtén el bucket
        const bucket = gc.bucket('turbo-energy-storage'); // Asegúrate de usar el nombre correcto del bucket

        // Configura el archivo en el bucket
        const file = bucket.file(`uploads/${bucketDirectory}/${fileName}`); // Nombre del archivo en el bucket
        const writeStream = file.createWriteStream({
            resumable: true, // Habilita reanudación de subidas si falla
            contentType: 'auto', // Detecta automáticamente el tipo de archivo
            metadata: {
                cacheControl: 'public, max-age=31536000' // Configura el caché del archivo
            }
        });

        // Usamos una promesa para controlar la escritura
        await new Promise((resolve, reject) => {
            // Maneja los errores en el stream de escritura
            writeStream.on('error', (err) => {
                reject(new Error(`Error al subir el archivo al bucket: ${err.message}`));
            });

            // Escribe el buffer directamente al stream
            writeStream.end(fileBuffer);

            // Maneja el evento de finalización
            writeStream.on('finish', () => {
                resolve(); // Resolución exitosa
            });
        });

        // Si no hubo errores y la promesa se resolvió correctamente, devuelve true
        return true;

    } catch (error) {
        console.error('Error al subir el archivo al bucket:', error);
        return false;
    }
};

export { uploadFileToBucket };
