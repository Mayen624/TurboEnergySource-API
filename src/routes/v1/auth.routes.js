import { Router } from "express";
import main from '#controllers/v1/main.controller.js';
const authController = main.authControler;

const route = Router();

route.get('/', authController.authenticateClient);


export default route;