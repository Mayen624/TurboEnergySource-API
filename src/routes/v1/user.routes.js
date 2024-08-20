import { Router } from "express";
import main from '#controllers/v1/main.controller.js';
import {isAuthenticated} from "#middlewares/v1/isAuthenticated.js";
const userController = main.userController;

const route = Router();

route.get('/', isAuthenticated, userController.getUsers);

route.post('/new_user', isAuthenticated, userController.createUser);

route.put('/update_user/:id', isAuthenticated, userController.updateUser);

export default route;