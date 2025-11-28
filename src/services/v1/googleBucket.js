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
    console.log('[GoogleBucket] Uploading:', fileName);
    console.log('[DEBUG] Environment variables:');
    console.log('  - GOOGLE_PROJECT_ID:', process.env.GOOGLE_PROJECT_ID);
    console.log('  - GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
    console.log('  - GOOGLE_CLIENT_EMAIL exists:', !!process.env.GOOGLE_CLIENT_EMAIL);
    console.log('  - GOOGLE_PRIVATE_KEY exists:', !!process.env.GOOGLE_PRIVATE_KEY);

    try {
        // Verificar si el archivo existe
        if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            const fs = await import('fs');
            const path = process.env.GOOGLE_APPLICATION_CREDENTIALS;
            console.log('[DEBUG] Checking if credentials file exists at:', path);
            try {
                const stats = fs.statSync(path);
                console.log('[DEBUG] File exists! Size:', stats.size, 'bytes');
            } catch (err) {
                console.error('[DEBUG] File does NOT exist:', err.message);
            }
        }

        // Configura el cliente de Google Cloud Storage
        let gc;

        // Si hay credenciales explícitas en variables de entorno, úsalas
        if (process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_CLIENT_EMAIL) {
            console.log('[DEBUG] Using explicit credentials from environment variables');
            gc = new Storage({
                projectId: process.env.GOOGLE_PROJECT_ID,
                credentials: {
                    client_email: process.env.GOOGLE_CLIENT_EMAIL,
                    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
                }
            });
        } else {
            console.log('[DEBUG] Using GOOGLE_APPLICATION_CREDENTIALS file');
            // Si no, deja que el SDK use GOOGLE_APPLICATION_CREDENTIALS automáticamente
            // No pasamos credentials, el SDK detectará la variable de entorno
            gc = new Storage({
                projectId: process.env.GOOGLE_PROJECT_ID
            });
        }

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
