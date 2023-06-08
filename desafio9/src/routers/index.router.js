import {Router} from "express";
import routerListProducts from "./listProduct.router.js";
import routerMessage from "./message.router.js";
import routerViews from "./view.router.js";
import ruterCarts from "./ruterCarts.js";
import ruterProducts from "./ruterProduct.js";
import routerSession from "./session.router.js";
import { validarSession } from "../middlewares/auth.js";

const indexRouter = Router();

indexRouter.use('/',routerViews)
indexRouter.use('/products',validarSession,ruterProducts)
indexRouter.use('/realTimeProducts',validarSession,routerListProducts)
indexRouter.use('/chat',routerMessage)
indexRouter.use('/cart',validarSession,ruterCarts)
indexRouter.use('/session',routerSession)

export default indexRouter