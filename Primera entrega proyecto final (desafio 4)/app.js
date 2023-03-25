import ruterCarts from './routers/ruterCarts.js';
import ruterProducts from './routers/ruterProduct.js';
import express from 'express';
import bodiParser from 'body-parser'

//const productManager = new ProductManager("./utils/products.json")
const PORT=8080;
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodiParser.json())


app.use("/api/products",ruterProducts)
app.use("/api/carts",ruterCarts)

app.listen(PORT,()=>{console.log(`Servidor iniciado en el puerto ${PORT}`)});
