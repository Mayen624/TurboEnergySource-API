import connection from "./src/db/v1/connection.js";
import express from "express";
import multer from "multer";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";


//Configuration
dotenv.config(); 

const app = express();
const upload = multer();

// CORS Configuration - Soporta múltiples orígenes
const allowedOrigins = process.env.CORS_ORIGIN? process.env.CORS_ORIGIN.split(',') : ['http://localhost:4321']; // Fallback para desarrollo local

const corsOptions = {
    origin: function (origin, callback) {
        // Permitir requests sin origin (como mobile apps, curl, Postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.warn(`❌ CORS blocked request from origin: ${origin}`);
            console.warn(`   Allowed origins: ${allowedOrigins.join(', ')}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Permite cookies y headers de autenticación
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
};
app.use(morgan('dev'));
// Aumentar límite de body para soportar imágenes grandes (10MB)
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use(cors(corsOptions));
app.use(cookieParser());



//variables
app.set('PORT', 3000 || 5000);

//Routes
import authRoutes from './src/routes/v1/auth.routes.js';
import userRoutes from './src/routes/v1/user.routes.js';
import actionsRoutes from './src/routes/v1/action.routes.js';
import rolesRoutes from './src/routes/v1/role.routes.js';
import productsRoutes from './src/routes/v1/products.routes.js';
import servicesRoutes from './src/routes/v1/services.routes.js';
import contactRoutes from './src/routes/v1/contact.routes.js';

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/actions', actionsRoutes);
app.use('/api/v1/roles', rolesRoutes);
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/services', servicesRoutes);
app.use('/api/v1/contacts', contactRoutes);

//Liteting...
app.listen(app.get('PORT'), () => {
    console.log(`API running on port: ${app.get('PORT')}`);
    connection.dbConnect();
});
