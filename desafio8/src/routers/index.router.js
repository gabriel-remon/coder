import {Router} from "express";
import routerListProducts from "./listProduct.router.js";
import routerMessage from "./message.router.js";
import routerViews from "./view.router.js";
import ruterCarts from "./ruterCarts.js";
import ruterProducts from "./ruterProduct.js";

const indexRouter = Router();

indexRouter.use('/',routerViews)
indexRouter.use('/products',ruterProducts)
indexRouter.use('/realTimeProducts',routerListProducts)
indexRouter.use('/chat',routerMessage)
indexRouter.use('/cart',ruterCarts)

export default indexRouter