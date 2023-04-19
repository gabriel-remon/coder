import { Router } from "express";
import ProductManager from "../dao/mongo/products.mongo.js";
import { __dirname } from "../utils.js";

const routerViews = Router()
const productManager = new ProductManager()


routerViews.get('/', async (req, res) => {
    const products = await productManager.getProductsEnable()
    let productSeguros = [];
    products.forEach(element => {
        productSeguros.push(
            {title: element.title,
            description: element.description,
            price: element.price,
            stock: element.stock,
            code: element.code,
            id: element._id
            })
    });

    res.render('index',{products: productSeguros})

})

export default routerViews