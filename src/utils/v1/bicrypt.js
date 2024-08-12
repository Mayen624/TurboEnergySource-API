import bcrypt from 'bcrypt';

/**
 * Generate an hash by a text
 * @param {string} text - Value to validate
 * @returns {string}
 */
const generateHash = async (text) => {
    const salts = await bcrypt.genSalt(10);
    return bcrypt.hash(text, salts);
}

/**
 * Compare a plain text with a hash to comprovate if it´s authenticate
 * @param {string, string} req.body - Values to validate
 * @returns {boolean} 
 */
const compareHash = async (key, hashedKey) => {
    return await bcrypt.compare(key, hashedKey);
}

export default { generateHash, compareHash }