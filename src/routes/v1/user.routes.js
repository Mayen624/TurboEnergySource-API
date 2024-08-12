import { Router } from "express";
import main from '#controllers/v1/main.controller.js';
const userController = main.userController;

const route = Router();

route.get('/', userController.getUsers);

route.post('/new_user', userController.createUser);

route.put('/update_user/:id', userController.updateUser);

route.post('/disabled_user/:id', userController.disableUser);

export default route;