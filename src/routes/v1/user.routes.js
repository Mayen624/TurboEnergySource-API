import { Router } from "express";
import main from '#controllers/v1/main.controller.js';
import {isAuthenticated} from "#middlewares/v1/isAuthenticated.js";
import {CheckUserPermission} from "#middlewares/v1/checkPermission.js"
const userController = main.userController;

const route = Router();

route.get('/', isAuthenticated, userController.getUsers);

route.get('/realtime_users', userController.getUsersBySSE);

route.post('/new_user', isAuthenticated, CheckUserPermission(['add', 'addUser']), userController.createUser);

route.put('/update_user/:id', isAuthenticated, CheckUserPermission(['update', 'updateUser']), userController.updateUser);

route.put('/enabledOrDesabled/:id', isAuthenticated, CheckUserPermission(['update', 'disabled', 'updateUser', 'disabledUser']), userController.enabledOrDisabled)

export default route;