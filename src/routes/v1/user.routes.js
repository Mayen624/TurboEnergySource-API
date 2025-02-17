import { Router } from "express";
import main from '#controllers/v1/main.controller.js';
import {isAuthenticated} from "#middlewares/v1/isAuthenticated.js";
import {CheckUserPermission} from "#middlewares/v1/checkPermission.js"
const userController = main.userController;

const route = Router();

route.get('/', isAuthenticated, CheckUserPermission(['view:user']), userController.getUsers);

route.get('/realtime_users', userController.getUsersBySSE);

route.post('/new_user', isAuthenticated, CheckUserPermission(['create:user']), userController.createUser);

route.post('/get_to_update', isAuthenticated, CheckUserPermission(['edit:user']), userController.getUserToUpdate);

route.put('/update_user/:id', isAuthenticated, CheckUserPermission(['edit:user']), userController.updateUser);

route.put('/enabledOrDesabled/:id', isAuthenticated, CheckUserPermission(['disabled:user', 'enabled:user']), userController.enabledOrDisabled)

export default route;