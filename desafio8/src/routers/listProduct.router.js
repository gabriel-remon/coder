import { Router } from "express";
import app from "../app.js";
import ProductManager from "../dao/mongo/products.mongo.js";

const routerListProducts = Router()
const productManager = new ProductManager()

/**
 * Route responsible for displaying a list of products via WebSocket. 
 * This list will be automatically updated whenever any aspect 
 * of the product list is modified.
 */
routerListProducts.get('/', async (req, res) => {
    const products = await productManager.getProductsEnable()
    res.render('realTimeProducts', { products: products })

    app.io.on('connection', socket => {
        socket.emit('load-list', { products })
    })
})

export default routerListProducts