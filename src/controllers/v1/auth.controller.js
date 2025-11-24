import validator from "#utils/v1/validator.js";
import userShemma from "#models/v1/users.js";
import bicrypt from "#utils/v1/bicrypt.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const authenticateClient = async (req, res) => {

    try {
        const {email, password} = req.body;
        console.log('🔐 Intento de login para:', email);

        if(!validator.isNonEmptyString(email) || !validator.isNonEmptyString(password)){
            return res.status(400).json({error: 'Email o contraseña no valida '});
        }

        console.log('✅ Validación OK, buscando usuario en DB...');
        console.log('📊 Estado de conexión MongoDB:', require('mongoose').connection.readyState); // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting

        const user = await userShemma.findOne({email: email}).populate('idRole');
        console.log('✅ Usuario encontrado:', user ? 'Sí' : 'No');

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

        // Configurar cookie httpOnly para Access Token
        res.cookie('authToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 8 * 60 * 60 * 1000 // 8 horas
        });

        // Enviar CSRF token al cliente (NO en cookie httpOnly)
        res.cookie('csrfToken', csrfToken, {
            httpOnly: false, // Accesible por JavaScript
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
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
        // Limpiar cookies
        res.clearCookie('authToken', { path: '/' });
        res.clearCookie('csrfToken', { path: '/' });

        return res.status(200).json({ success: 'Sesión cerrada exitosamente' });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
};

const authController = {authenticateClient, logout};

export default authController;

