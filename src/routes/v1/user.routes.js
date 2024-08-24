import { Router } from "express";
import main from '#controllers/v1/main.controller.js';
import {isAuthenticated} from "#middlewares/v1/isAuthenticated.js";
import {CheckUserPermission} from "#middlewares/v1/checkPermission.js"
const userController = main.userController;

const route = Router();

route.get('/', isAuthenticated, CheckUserPermission(['add', 'update', 'disabled']), userController.getUsers);

route.post('/new_user', isAuthenticated, userController.createUser);

route.put('/update_user/:id', isAuthenticated, userController.updateUser);

export default route;