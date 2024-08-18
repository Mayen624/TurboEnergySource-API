import connection from "./src/db/v1/connection.js";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";


//Configuration
const app = express();
dotenv.config();
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//variables
app.set('PORT', 3000 || 5000);

//Routes
import authRoutes from './src/routes/v1/auth.routes.js';
import userRoutes from './src/routes/v1/user.routes.js';
import actionsRoutes from './src/routes/v1/action.routes.js';
import rolesRoutes from './src/routes/v1/role.routes.js';
import productsRoutes from './src/routes/v1/products.routes.js';
import servicesRoutes from './src/routes/v1/services.routes.js';

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/actions', actionsRoutes);
app.use('/api/v1/roles', rolesRoutes);
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/services', servicesRoutes);

//Liteting...
app.listen(app.get('PORT'), () => {
    console.log(`API running on port: ${app.get('PORT')}`);
    connection.dbConnect();
});
