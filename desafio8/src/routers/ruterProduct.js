import { Router } from 'express';
import mongoose from 'mongoose';
import app from '../app.js';
import ProductManager from '../dao/mongo/products.mongo.js';
import { validateProductFields, validateStatus, parseProductFromBody, validateObjetID, validateGetProducts } from '../middlewares/validates.js'
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
ruterProducts.get('/', validateGetProducts, async (req, res) => {
  try {
    const { limit, page, query, sort } = req.query
    const categorys = await productManager.categorysProductsc()
    const products = await productManager.getProductsIndex(limit, page, query ? { category: query } : {}, sort)

    const product = products.docs.map(element => {
      return {
        title: element.title,
        description: element.description,
        price: element.price,
        thumbnails: element.thumbnails,
        code: element.code,
        stock: element.stock,
        status: element.status,
        category: element.category,
        _id: element._id
      }
    })

    const respuesta = {
      status: 'success',
      //payload: products.docs,
      payload: product,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: ((products.hasPrevPage) ? `${req.protocol}://${req.get('host')}${req.baseUrl}?limit=${limit}&page=${products.prevPage}&sort=${sort}${query ? `&query=${query}` : ""}` : null),
      nextLink: ((products.hasNextPage) ? `${req.protocol}://${req.get('host')}${req.baseUrl}?limit=${limit}&page=${products.nextPage}&sort=${sort}${query ? `&query=${query}` : ""}` : null)
    }
    categorys.map(element => element = element.replace(/\s+/g, '-'))
    categorys.map(element => element = element.replace(/\s+/g, '-'))

    const data = {
      data: respuesta,
      categorys: categorys.map(element => element = element.replace(/\s+/g, '-')),
      limit: product.limit,
      query: query ? query.replace(/\s+/g, '-') : null
    }
    if (req.session.admin) data.admin = req.session.admin;
    if (req.session.user) {
      data.user = req.session.user
      data.nombre = req.session.userData.nombre
      data.apellido = req.session.userData.apellido
      data.edad = req.session.userData.edad
    }
    //return res.status(200).send(JSON.stringify(respuesta))
    res.status(200).render('products', data)
  }
  catch (err) {
    res.status(500).send(JSON.stringify({ status: 'error', payload: err }))
  }

})

/**
 * Handler for the root route "/", where the 
 * product ID to be searched is passed as a 
 * parameter and the corresponding object is 
 * returned, if it exists.
 */
ruterProducts.get('/:id', validateObjetID, async (req, res) => {
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
ruterProducts.post('/', validateProductFields, validateStatus, parseProductFromBody, async (req, res) => {
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
ruterProducts.put('/:id', validateObjetID, validateProductFields, validateStatus, parseProductFromBody, async (req, res) => {
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
ruterProducts.delete('/:id', validateObjetID, async (req, res) => {
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

