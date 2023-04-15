import { Router } from "express";
import ProductManager from "../utils/productManager.js";
import { __dirname } from "../utils.js";

const routerViews = Router()
const productManager = new ProductManager(__dirname+"/utils/products.json")


routerViews.get('/', async (req, res) => {
    const products = await productManager.getProductsEnable()
    res.render('index',{products: products})
})

export default routerViews