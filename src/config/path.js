import path from 'path';
import { fileURLToPath } from 'url';

// Definir __dirname y __filename para módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export { __dirname, __filename };