import validator from "#utils/v1/validator.js";
import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {

    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization header with Bearer token required' });
        }

        const token = authHeader.split(' ')[1];

        if (!validator.isNonEmptyString(token)) {
            return res.status(401).json({ error: 'Token for authentication required' });
        }

        const decode = await jwt.verify(token, process.env.JWT_PRIVATE_KEY);

        if (!decode) {
            throw new Error('Error trying to verify token, token not valid');
        }

        req.token = token;
        next();
        
    } catch (e) {
        return res.status(500).json({ error: 'Error trying to authenticate client: ' + e.message });
    }
}

export { isAuthenticated };