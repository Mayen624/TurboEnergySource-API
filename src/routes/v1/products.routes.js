import { Router } from "express";
import multer from "multer";
import main from '#controllers/v1/main.controller.js';
import { isAuthenticated } from "#middlewares/v1/isAuthenticated.js";
import {CheckUserPermission} from "#middlewares/v1/checkPermission.js"
const productsController = main.productsController;

const route = Router();
const upload = multer();

route.get('/', isAuthenticated, productsController.getProducts);

route.post('/new_product', isAuthenticated, CheckUserPermission(['add']), upload.single('img'), productsController.addProduct);

route.put('/update_product/:id', isAuthenticated, CheckUserPermission(['update']), productsController.updateProduct);

route.put('/enabledOrDesabled/:id', isAuthenticated, CheckUserPermission(['disabled']), productsController.disabledAndEnabledProduct);

export default route;