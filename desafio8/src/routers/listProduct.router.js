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
    const data =  { products: products }
    if(req.session.admin)data.admin=req.session.admin;
    if(req.session.user){
        data.user=req.session.user
        data.nombre=req.session.userData.nombre
        data.apellido=req.session.userData.apellido
        data.edad=req.session.userData.edad
    }

    res.render('realTimeProducts', data)

    app.io.on('connection', socket => {
        socket.emit('load-list', { products })
    })
})

export default routerListProducts