import { Router } from "express";
import main from '#controllers/v1/main.controller.js';
const productsController = main.productsController;

const route = Router();

route.get('/', productsController.getProdcuts);

route.post('/new_product', productsController.addProduct);

route.put('/update_product/:id', productsController.updateProduct);

route.post('/disabled_product/:id', productsController.disabledProduct);

export default route;