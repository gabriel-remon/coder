import express from 'express';
import CartManager from '../utils/cartManager.js';

const ruterCarts = express.Router();
const cartManager = new CartManager('./utils/products.json','./utils/carts.json');

ruterCarts.post('/', async (req, res) =>{
  try
    {
      const id = await cartManager.addCart(req.body.products)
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
      if(retorno !== "Not found")
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