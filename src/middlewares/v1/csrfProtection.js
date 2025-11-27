/**
 * Middleware de protección CSRF
 * Verifica que el token CSRF en el header coincida con el de la cookie
 */
const csrfProtection = (req, res, next) => {
    try {
        // Obtener CSRF token del header
        const csrfTokenFromHeader = req.headers['x-csrf-token'];

        // Obtener CSRF token de la cookie
        const csrfTokenFromCookie = req.cookies.csrfToken;

        // Validar que ambos tokens existan
        if (!csrfTokenFromHeader || !csrfTokenFromCookie) {
            return res.status(403).json({
                error: 'CSRF token requerido'
            });
        }

        // Comparar tokens
        if (csrfTokenFromHeader !== csrfTokenFromCookie) {
            return res.status(403).json({
                error: 'CSRF token inválido'
            });
        }

        // Token válido, continuar
        next();

    } catch (e) {
        return res.status(500).json({
            error: 'Error al validar CSRF token: ' + e.message
        });
    }
};

export { csrfProtection };
