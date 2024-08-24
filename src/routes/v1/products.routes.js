import { Router } from "express";
import main from '#controllers/v1/main.controller.js';
import { isAuthenticated } from "#middlewares/v1/isAuthenticated.js";
import {CheckUserPermission} from "#middlewares/v1/checkPermission.js"
const productsController = main.productsController;

const route = Router();

route.get('/', isAuthenticated, productsController.getProdcuts);

route.post('/new_product', isAuthenticated, CheckUserPermission(['add']), productsController.addProduct);

route.put('/update_product/:id', isAuthenticated, CheckUserPermission(['update']), productsController.updateProduct);

route.post('/disabled_product/:id', isAuthenticated, CheckUserPermission(['disabled']), productsController.disabledProduct);

export default route;