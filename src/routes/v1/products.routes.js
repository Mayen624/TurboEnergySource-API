import { Router } from "express";
import multer from "multer";
import main from '#controllers/v1/main.controller.js';
import { isAuthenticated } from "#middlewares/v1/isAuthenticated.js";
import {CheckUserPermission} from "#middlewares/v1/checkPermission.js";
import {csrfProtection} from "#middlewares/v1/csrfProtection.js";
const productsController = main.productsController;

const route = Router();
const upload = multer();

// Public endpoint - no authentication required
route.get('/public', productsController.getPublicProducts);

route.get('/', isAuthenticated, csrfProtection, productsController.getProducts);

route.get('/:id', isAuthenticated, csrfProtection, CheckUserPermission(['view:user']), productsController.getProductById);

route.post('/new_product', isAuthenticated, csrfProtection, CheckUserPermission(['create:product']), upload.single('img'), productsController.addProduct);

route.put('/:id', isAuthenticated, csrfProtection, CheckUserPermission(['edit:product']), upload.single('img'), productsController.updateProduct);

route.put('/enabledOrDesabled/:id', isAuthenticated, csrfProtection, CheckUserPermission(['disabled:product', 'enabled:product']), productsController.disabledAndEnabledProduct);

export default route;