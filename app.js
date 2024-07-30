import express from "express";
import dotenv from "dotenv"
import {dbConnect, dbDesconnect} from "./src/db/database";

//Configuration
dotenv.config();
const app = express();

//variables
app.set('PORT', 3000 || 5000);

//Liteting...
app.listen(app.get('PORT'), () => {
    console.log(`API running on port: ${app.get('PORT')}`);
});
