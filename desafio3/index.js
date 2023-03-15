import ProductManager from "./producManager.js";
import express from "express";

const app = express()
const PORT = 8080;
const producManager = new ProductManager("./productsTest.json")

app.get("/products", async (req, res) => {
    try {
        const products = await producManager.getProducts();
        if (req.query.limit) {
            return res.send(products.splice(0, req.query.limit))
        }
        res.send(products)

    } catch (err) {
        return res.send(err)
    }
})

app.get("/products/:Pid", async (req, res) => {
    try {
        res.send(await producManager.getProductById(req.params.Pid))
    } catch (err) {
        return res.send(err)
    }
})

app.listen(PORT, (_) => console.log(`Server iniciado en puerto= ${PORT}`))