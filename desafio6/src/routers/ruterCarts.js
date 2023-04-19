import express from 'express';
//import CartManager from '../utils/cartManager.js';
import { __dirname } from '../utils.js';

import CartManager from '../dao/mongo/carts.mongo.js'
import mongoose from 'mongoose';

const ruterCarts = express.Router();
const cartManager = new CartManager();

ruterCarts.post('/', async (req, res) =>{
  try
    {
      const id = await cartManager.addCart()
      res.status(200).send(`carrito creado con exito. id=${id} `)
    }
     catch(err)
     {
        res.status(500).send(err)
     }

    
  })

  ruterCarts.get('/:id', async (req, res) =>{
    try
    {
        res.status(200).send(await cartManager.getCartById(req.params.id))
    }
     catch(err)
     {
        res.status(500).send(err)
     }
     
   })
   
   ruterCarts.post('/:cid/products/:pid',async (req,res)=>{
    try{
      const retorno = await cartManager.addProduc(req.params.pid,req.params.cid)
      if(mongoose.Types.ObjectId.isValid(retorno))
      {
         res.status(200)
      }
      res.status(500)
      return res.send(retorno)
    }  
    catch(err)
    {
      return res.status(500).send(err)
    }    

   })

   export default ruterCarts