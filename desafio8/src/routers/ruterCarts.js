import { Router } from 'express';
import mongoose from 'mongoose';
import CartManager from '../dao/mongo/carts.mongo.js';
import {validateObjetID,validateCartObjetID,validateQuantity,validateListProducts} from '../middlewares/validates.js'
/**
 * This is a router responsible for handling 
 * requests related to product carts.
 */
const ruterCarts = Router();
const cartManager = new CartManager();

ruterCarts.post('/', async (req, res) => {
  try {
    const id = await cartManager.addCart()
    res.status(200).send(`carrito creado con exito. id=${id} `)
  }
  catch (err) {
    res.status(500).send(err)
  }
})

/**
 * This route will create a new empty cart without the 
 * need to pass any values as a parameter in the body, 
 * and it will return the ID of the created cart.
 */
ruterCarts.get('/:id',validateObjetID, async (req, res) => {
  try {
    const cart =await cartManager.getCartById(req.params.id)
    let total=0
    const render = cart.products.map(element => {
      total +=element.quantity * element.idProduct.price
      return{
        title: element.idProduct.title,
        description: element.idProduct.description,
        price: element.idProduct.price,
        category:element.idProduct.category,
        subTotal:element.quantity * element.idProduct.price,
        quantity:element.quantity
      }

    })
    res.render('cart',{data:render, total:total})
    //res.status(200).send(cart)
  }
  catch (err) {
    res.status(500).send(err)
  }

})

/**
 * The route for adding products to the cart, 
 * the cart id and product id should be passed 
 * as parameters in the route /:cid/products/:pid, 
 * where cid is the cart id and pid is the product id.
 */
ruterCarts.post('/:cid/products/:pid',validateCartObjetID, async (req, res) => {
  try {

    const retorno = await cartManager.addProduc(req.params.pid, req.params.cid)
    
    if (retorno.acknowledged) {
      return res.status(200).send("Product loaded successfully")
    }
    return res.status(500).send("Failed to load product to cart")
  }
  catch (err) {
    return res.status(500).send(err)
  }

})

ruterCarts.delete('/:cid/products/:pid',validateCartObjetID,async (req, res) =>{
  try {
    const cartUpdate = await cartManager.deleteProduct(req.params.cid,req.params.pid)
    res.status(200).send(cartUpdate)
  }
  catch (err) {
    return res.status(500).send(err)
  }
})

ruterCarts.delete('/:id',validateCartObjetID,async (req, res) =>{
  try {
    const cartUpdate =  await cartManager.deleteCart(req.params.cid)
    res.status(200).send(cartUpdate)
  }
  catch (err) {
    return res.status(500).send(err)
  }
})

ruterCarts.put('/:id',validateCartObjetID,validateListProducts,async (req, res) =>{
  try {
    const cartUpdate =  await cartManager.updateCart(req.params.id,req.body.products)
    res.status(200).send(cartUpdate)  
  }
  catch (err) {
    return res.status(500).send(err)
  }
})

ruterCarts.put('/:cid/products/:pid',validateCartObjetID,validateQuantity,async (req, res) =>{
  try {
    const cartUpdate =  await cartManager.updateQuantityProduct(req.params.cid,req.params.pid,req.body.quantity)
    res.status(200).send(cartUpdate)  
  }
  catch (err) {
    return res.status(500).send(err)
  }
})

export default ruterCarts