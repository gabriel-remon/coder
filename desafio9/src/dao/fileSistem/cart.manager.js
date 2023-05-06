import  fs  from 'fs';
import { pid } from 'process';
import ProductManager from './product.manager.js';

export default class CartManager {

  #productManager;
  #pathCarts;

  constructor(pathProducts,pathCarts) {
    if(!pathProducts) throw new Error("no se definio la ruta de productos")

    this.#pathCarts= ( pathCarts ? pathCarts : "./productos.json")
    this.#productManager = new ProductManager(pathProducts)
  }
/**
 * agrega una lista de productos la cual solo contara con el id y el el numero de ejemplares
 * de cada producto. se deveran agregar en forma de array y se verificada que cada producto tenga
 * los campos id y quantity exclusivamente
 * @param {object} products - array de productos
 * @returns retorna el id que se cargo y si no fue posible retorna -1
 */
  addCart = async () => {

    try {
        let id = 1;
      let carts = await this.getCarts();
      let cart={products:[]};

    console.log(carts)
      if (carts.length > 0) id = carts[carts.length - 1].id + 1;
      
        cart.id = id;
        carts.push(cart);
        await fs.promises.writeFile(this.#pathCarts, JSON.stringify(carts, null, 2))
        return id
    }
    catch (err) {
      console.error(err)
    }

  }



  getCarts = async (_) => {
    if (fs.existsSync(this.#pathCarts) && fs.statSync(this.#pathCarts).size)  {
      try {
        let carts = await fs.promises.readFile(this.#pathCarts);
        carts = JSON.parse(carts);
        return carts;
      }
      catch (err) {
        throw err;
      }
    }
    else {
      return [];
    }
  }

  /**
   * buscar un carrito dentro de la lista de carritos guardada con el mismo id
   * si lo encuentra devuelve el objeto del producto sino retorna "Not found"
   * @param {int o string} id -id a buscar
   * @returns objeto del producto encontrado o string "Not found" 
   */
  getCartById = async (id) => {
    try {
      let retorno = "Not found";
      let carts = await this.getCarts();
      id=parseInt(id)
      if(carts.length>0)
      carts.forEach((element) => {if (element.id === id) { retorno = element; return } })
      return retorno;
    }
    catch (err) {
      console.error(err)
    }
  }

/**
 * aprega un nuevo producto al carrito y lo descuenta de la lista de productos
 * @param {*} Pid 
 * @param {*} Cid 
 * @returns 
 */
  addProduc = async(Pid,Cid)=>{
    try {
        Pid=parseInt(Pid);
        Cid=parseInt(Cid)

        let carts = await this.getCarts(Cid)
        const cartId= carts.findIndex(element => element.id === Cid)

       
        let product= await this.#productManager.getProductById(Pid)
        let encontrado=false;

      
        if(cartId>-1 && product !=="Not found")
        {
            carts[cartId].products.forEach(element=>{if(element.product===Pid)
                {
                    element.quantity++;
                    encontrado=true
                    return
                }})
            if(!encontrado) carts[cartId].products.push({product: Pid, quantity:1})

            product.stock--
           
            let cambio=await this.#productManager.updateProduct(Pid,product)
            
            await fs.promises.writeFile(this.#pathCarts, JSON.stringify(carts, null, 2))

            return "producto agregado al carrito con exito"
        }
        return "Not found"
      }
      catch (err) {
        console.error(err)
      }
  }
}