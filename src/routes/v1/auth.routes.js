import { Router } from "express";
import rateLimit from "express-rate-limit";
import main from '#controllers/v1/main.controller.js';
const authController = main.authControler;

const route = Router();

// Rate limiter: máximo 5 intentos de login por IP cada 15 minutos
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // 5 intentos
    message: { error: 'Demasiados intentos de inicio de sesión. Por favor, intenta de nuevo en 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false,
});

route.post('/', loginLimiter, authController.authenticateClient);
route.post('/logout', authController.logout);


export default route;