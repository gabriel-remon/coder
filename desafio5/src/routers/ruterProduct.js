import express from 'express';
import ProductManager from '../utils/productManager.js';

const ruterProducts = express.Router();
const productManager = new ProductManager('./utils/products.json')

const mid1 = (req,res,next)=>{
  const body = req.body
  if(typeof body.thumbnails  === 'undefined') body.thumbnails  = "sin fotos"
  if(typeof body.title === "string" &&
  typeof body.description === "string" &&
  typeof body.code === "string" &&
 !isNaN(body.price) &&
  !isNaN(body.stock) && 
  typeof body.category === "string" && 
  (typeof body.thumbnails === "string" || !body.thumbnails) )
  {
    if(body.status)body.status=JSON.parse(body.status)
    if(typeof req.body.status !== 'boolean') req.body.status=true
    req.body.product = {title: body.title,description: body.description, code: body.code, price: parseInt(body.price), 
                        status: req.body.status, 
                        stock: parseInt( body.stock), category: body.category,thumbnails: body.thumbnails};
    next()
  }
  else

  res.status(400).send("faltan parametros")
}

ruterProducts.get('/', async (req, res) =>{
  try
    {
      
      const products = await productManager.getProducts();
      if(req.query.limit)
           return res.send(products.splice(0,req.query.limit))
      res.status(200).json(products)

    }
     catch(err)
     {
        res.status(500).send(err)
     }

    
  })

  ruterProducts.get('/:id', async (req, res) =>{
    try
    {
        res.status(200).send(await productManager.getProductById(req.params.id))
    }
     catch(err)
     {
        res.status(500).send(err)
     }
     
   })
   
   ruterProducts.post('/',mid1,async (req,res)=>{
    try{
      const id = await productManager.addProduct(req.body.product)
      console.log(id)
      if(id>0)
      {
        res.render('realTimeProducts',{products: await productManager.getProducts()})
        return res.status(200).send(`Producto agregado con id: ${id}`)
      }
      res.status(500).send('No se pudo cargar el producto')
    }  
    catch(err)
    {
      res.status(500).send(err)
    }    

   })

   ruterProducts.put('/:id',mid1,async(req,res)=>{
    try{
      
      const id = await productManager.updateProduct(req.params.id,req.body.product)

      if(typeof id === 'number')
      {
        return res.status(200).send(`Producto ${id} modificado con exito`)
      }
      res.status(500).send(id)
    }  
    catch(err)
    {
      res.status(500).send(err)
    }    
   })



   ruterProducts.delete('/:id', async(req,res)=>{
    try{

      const id = await productManager.deleteProduct(req.params.id)
      if(typeof id === 'number')
      {
        return res.status(200).send(`Producto ${id} eliminado con exito`)
      }
      res.status(500).send(id)
    }  
    catch(err)
    {
      res.status(500).send(err)
    }   
   })

   export default ruterProducts

   