import { Router } from "express";
import ProductManager from "../dao/mongo/products.mongo.js";
import { __dirname } from "../utils.js";

/**
 * Router in charge of handling the static views of the application
 */
const routerViews = Router()

const productManager = new ProductManager()

/**
 * This function handles GET requests to the root of the website
 * and displays a list of enabled products by passing them to 
 * the index template. The function creates a safe list of products 
 * and then passes it as a local variable to the template for rendering 
 * using the Handlebars template engine.
 */
routerViews.get('/', async (req, res) => {



    res.render('login')

})

export default routerViews