import validator from "#utils/v1/validator.js";
import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {

    try {
        // Obtener token de la cookie httpOnly
        const token = req.cookies.authToken;

        if (!validator.isNonEmptyString(token)) {
            return res.status(401).json({ error: 'Token de autenticación requerido' });
        }

        // Verificar JWT
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

        if (!decoded) {
            throw new Error('Token no válido');
        }

        // Guardar información del usuario decodificada en la request
        req.user = {
            userId: decoded.userId,
            roleId: decoded.roleId,
            email: decoded.email
        };

        req.token = token;
        next();

    } catch (e) {
        // Token expirado o inválido
        if (e.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado' });
        }
        if (e.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token inválido' });
        }
        return res.status(500).json({ error: 'Error al autenticar: ' + e.message });
    }
}

export { isAuthenticated };