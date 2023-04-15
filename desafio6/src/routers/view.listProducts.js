import { Router } from "express";
import ProductManager from "../utils/productManager.js";
import app from "../app.js";
import { __dirname } from "../utils.js";

const routerListProducts = Router()
const productManager = new ProductManager(__dirname+"/utils/products.json")


routerListProducts.get('/', async (req, res) => {
    const products = await productManager.getProductsEnable()
    res.render('realTimeProducts',{products: products})

    app.io.on('connection',socket =>{
        socket.emit('load-list',{products})
    })
})

export default routerListProducts