import { Router } from "express";
import ProductManager from "../utils/productManager.js";

const viewsRouter = Router()
const productManager = new ProductManager("./utils/products.json")


viewsRouter.get('/', async (req, res) => {
    const products = await productManager.getProducts()
    
    res.render('realTimeProducts',{products: products})
})

export default viewsRouter