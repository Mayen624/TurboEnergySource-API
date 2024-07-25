import { Router } from "express";
import main from '../controller/main.controller';
const userController = main.userController;

const route = Router();

route.get('/', userController.getUsers);

route.post('/new_user', userController.createUser);

route.put('/update_user/:id', userController.updateUser);

route.post('/disabled_user/:id', userController.disableUser);