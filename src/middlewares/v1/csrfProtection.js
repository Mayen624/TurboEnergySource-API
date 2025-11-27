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

        // Log para diagnóstico (TEMPORAL - remover en producción)
        console.log('🔍 CSRF Backend Debug:', {
            endpoint: req.originalUrl,
            header: csrfTokenFromHeader ? `${csrfTokenFromHeader.substring(0, 10)}...` : 'MISSING',
            cookie: csrfTokenFromCookie ? `${csrfTokenFromCookie.substring(0, 10)}...` : 'MISSING',
            match: csrfTokenFromHeader === csrfTokenFromCookie,
            allCookies: Object.keys(req.cookies)
        });

        // Validar que ambos tokens existan
        if (!csrfTokenFromHeader || !csrfTokenFromCookie) {
            return res.status(403).json({
                error: 'CSRF token requerido',
                debug: {
                    hasHeader: !!csrfTokenFromHeader,
                    hasCookie: !!csrfTokenFromCookie
                }
            });
        }

        // Comparar tokens
        if (csrfTokenFromHeader !== csrfTokenFromCookie) {
            return res.status(403).json({
                error: 'CSRF token inválido',
                debug: {
                    headerPrefix: csrfTokenFromHeader.substring(0, 10),
                    cookiePrefix: csrfTokenFromCookie.substring(0, 10)
                }
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
