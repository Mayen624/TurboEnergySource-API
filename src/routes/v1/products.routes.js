import { Router } from "express";
import multer from "multer";
import main from '#controllers/v1/main.controller.js';
import { isAuthenticated } from "#middlewares/v1/isAuthenticated.js";
import {CheckUserPermission} from "#middlewares/v1/checkPermission.js";
import {csrfProtection} from "#middlewares/v1/csrfProtection.js";
const productsController = main.productsController;

const route = Router();
const upload = multer();

route.get('/', isAuthenticated, csrfProtection, productsController.getProducts);

route.post('/new_product', isAuthenticated, csrfProtection, CheckUserPermission(['create:product']), upload.single('img'), productsController.addProduct);

route.put('/update_product/:id', isAuthenticated, csrfProtection, CheckUserPermission(['edit:product']), productsController.updateProduct);

route.put('/enabledOrDesabled/:id', isAuthenticated, csrfProtection, CheckUserPermission(['disabled:product', 'enabled:product']), productsController.disabledAndEnabledProduct);

export default route;