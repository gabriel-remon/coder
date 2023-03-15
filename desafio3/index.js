import ProductManager from "./producManager.js";
import express  from "express";

const app =express()
const PORT= 8080;
const producManager = new ProductManager("./productsTest.json")

app.get("/products", async (req,res)=>{
const products = await producManager.getProducts();
if(req.query.limit)
{
    return res.send(products.splice(0,req.query.limit))
}
res.send(products)
})

app.get("/products/:Pid", async (req,res)=>{
res.send(await producManager.getProductById(req.params.Pid))
})

app.listen(PORT,(_)=>console.log(`Server iniciado en puerto= ${PORT}`))