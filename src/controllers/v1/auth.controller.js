import validator from "#utils/v1/validator.js";
import userShemma from "#models/v1/users.js";
import bicrypt from "#utils/v1/bicrypt.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const authenticateClient = async (req, res) => {

    try {
        const {email, password} = req.body;

        if(!validator.isNonEmptyString(email) || !validator.isNonEmptyString(password)){
            return res.status(400).json({error: 'Email o contraseña no valida '});
        }

        const user = await userShemma.findOne({email: email}).populate('idRole');

        if(!user){
            return res.status(404).json({error: 'El usuario no se encuentra o no existe'});
        }

        if(!user.enabled){
            return res.status(403).json({error: 'Usuario deshabilitado'});
        }

        const match = await bicrypt.compareHash(password, user.password);

        if(!match){
            return res.status(400).json({error: 'Autenticacion fallida'});
        }

        // Payload JWT reducido - solo datos esenciales
        const tokenPayload = {
            userId: user._id,
            roleId: user.idRole._id,
            email: user.email
        };

        // Access token - 8 horas (jornada laboral)
        const accessToken = jwt.sign(tokenPayload, process.env.JWT_PRIVATE_KEY, { expiresIn: '28800s' });

        // CSRF Token
        const csrfToken = crypto.randomBytes(32).toString('hex');

        // IMPORTANTE: Limpiar TODAS las variantes de cookies antiguas
        // Las cookies pueden haber sido creadas con diferentes configuraciones
        const clearOptions = [
            // Opción 1: Con dominio .turboenergysource.com y path /
            { path: '/', domain: '.turboenergysource.com' },
            // Opción 2: Con dominio .turboenergysource.com sin path explícito
            { domain: '.turboenergysource.com' },
            // Opción 3: Sin dominio con path /
            { path: '/' },
            // Opción 4: Sin dominio ni path
            {},
        ];

        // Intentar limpiar con todas las combinaciones
        clearOptions.forEach(opts => {
            res.clearCookie('authToken', opts);
            res.clearCookie('csrfToken', opts);
        });

        // Configurar cookie httpOnly para Access Token
        res.cookie('authToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' permite cross-site en producción
            domain: process.env.NODE_ENV === 'production' ? '.turboenergysource.com' : undefined, // Compartir entre subdominios
            path: '/', // Asegurar que se sobrescriba correctamente
            maxAge: 8 * 60 * 60 * 1000 // 8 horas
        });

        // Enviar CSRF token al cliente (NO en cookie httpOnly)
        res.cookie('csrfToken', csrfToken, {
            httpOnly: false, // Accesible por JavaScript
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' permite cross-site en producción
            domain: process.env.NODE_ENV === 'production' ? '.turboenergysource.com' : undefined, // Compartir entre subdominios
            path: '/', // Asegurar que se sobrescriba correctamente
            maxAge: 8 * 60 * 60 * 1000 // 8 horas
        });

        return res.status(200).json({
            success: 'Autenticacion exitosa',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.idRole.name
            },
            csrfToken: csrfToken
        });

    } catch (e) {
        return res.status(500).json({error: e.message});
    }

}

const logout = async (req, res) => {
    try {
        // Limpiar cookies (debe incluir mismo domain que al crearlas)
        const cookieOptions = {
            path: '/',
            domain: process.env.NODE_ENV === 'production' ? '.turboenergysource.com' : undefined
        };

        res.clearCookie('authToken', cookieOptions);
        res.clearCookie('csrfToken', cookieOptions);

        return res.status(200).json({ success: 'Sesión cerrada exitosamente' });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
};

const authController = {authenticateClient, logout};

export default authController;

