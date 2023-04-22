import { Router } from 'express';
import mongoose from 'mongoose';
import app from '../app.js';
import ProductManager from '../dao/mongo/products.mongo.js';
import { validateProductFields,validateStatus,parseProductFromBody, validateObjetID, validateGetProducts } from '../middlewares/validates.js'
/**
 * Router handling the main route for products.
 */
const ruterProducts = Router();
const productManager = new ProductManager()

/**
 * Handler for the root route "/", which returns a JSON 
 * of all saved products. It is also possible to limit 
 * the number of products displayed by passing a 'limit' 
 * query parameter.
 */
ruterProducts.get('/',validateGetProducts, async (req, res) => {
  try {
    console.log('hola')
    const {limit,page,query,sort} = req.params
    return res.status(200).send(await productManager.getProductsIndex(limit,page,query,sort))
  }
  catch (err) {
    res.status(500).send(err)
  }

})

/**
 * Handler for the root route "/", where the 
 * product ID to be searched is passed as a 
 * parameter and the corresponding object is 
 * returned, if it exists.
 */
ruterProducts.get('/:id',validateObjetID, async (req, res) => {
  try {
    
    res.status(200).send(await productManager.getProductById(req.params.id))
  }
  catch (err) {
    res.status(500).send(err)
  }

})

/**
 * Handler for the root "/" where the necessary parameters 
 * to create a new product will be passed in the body. 
 * If successful, the ID of the generated product will be returned. 
 * The following parameters must be included in the body: 
 * title, description, price, thumbnails, code, stock, status, and category.
 */
ruterProducts.post('/', validateProductFields,validateStatus,parseProductFromBody, async (req, res) => {
  try {
    const id = await productManager.addProduct(req.body.product)

    if (mongoose.Types.ObjectId.isValid(id)) {
      app.io.emit('new-product', { product: req.body.product })
      return res.status(200).send(`New product added, with id: ${id}`)
    }
    return res.status(500).send('Error when trying to load the product.')
  }
  catch (err) {
    res.status(500).send(err)
  }
})

/**
 * This handler updates a product by its id, using the 
 * data provided in the request body. The request must 
 * contain the updated fields of the product, including 
 * title, description, price, thumbnails, code, stock, status, 
 * and category.
 */
ruterProducts.put('/:id',validateObjetID,validateProductFields,validateStatus,parseProductFromBody, async (req, res) => {
  try {
    const id = await productManager.updateProduct(req.params.id, req.body.product)

    if (mongoose.Types.ObjectId.isValid(id)) {
      app.io.emit('product-update', { product: req.body.product, id: id })
      return res.status(200).send(`Product successfully updated. Id: ${id}`)
    }
    res.status(500).send(id)
  }
  catch (err) {
    res.status(500).send(err)
  }
})


/**
 * Deletes a product by passing the product id 
 * as a parameter, the deletion is logical by 
 * setting the "status" value to false.
 */
ruterProducts.delete('/:id',validateObjetID, async (req, res) => {
  try {

    const product = await productManager.deleteProduct(req.params.id)

    if (mongoose.Types.ObjectId.isValid(product._id)) {
      app.io.emit('product-deleted', { title: product.title, id: product._id })

      return res.status(200).send(`Product successfully deleted. Id:  ${product._id}`)
    }
    res.status(500).send(product)
  }
  catch (err) {
    res.status(500).send(err)
  }
})

export default ruterProducts

