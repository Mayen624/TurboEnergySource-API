import connection from "#db/v1/connection.js";
import express from "express";
import dotenv from "dotenv"


//Configuration
dotenv.config();
const app = express();

//variables
app.set('PORT', 3000 || 5000);

//Routes
import authRoutes from '#routes/v1/user.routes.js';

app.use('/api/v1/auth', authRoutes);

//Liteting...
app.listen(app.get('PORT'), () => {
    console.log(`API running on port: ${app.get('PORT')}`);
    connection.dbConnect();
});
