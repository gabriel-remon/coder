const fs = require('fs')

class ProductManager {
  #path;

  constructor(path) {
    this.#path= ( path ? path : "./productos.json")
  }

  addProduct = async (product) => {
    let id = 1;

    try {
      let products = await this.getProducts();
      if (products.length > 0) id = products[products.length - 1].id + 1;
      
      if (this.#validarFormato(product) && this.#validarCodigo(product, products)) {
        product.id = id;
        products.push(product);
        await fs.promises.writeFile(this.#path, JSON.stringify(products, null, 2))
        return id
      }

      return -1
    }
    catch (err) {
      console.error(err)
    }

  }
  #validarCodigo = (product, products, excluir) => {

    let retorno = true
    products.forEach(element => {
      if (element.code === product.code && !( typeof excluir !=="undefined" && element.code === excluir))
      {
        retorno = false
        return;
      }
      
    })
    return retorno;
  }



  #validarFormato = (product) => {
    
    const validacion= ['title','description','price','thumbnail','code','stock']
    const keys = Object.keys(product)
    const values = Object.values(product).map(element=>{return typeof element === "string"?  element.trim(): element})
    // if (keys.includes('title') && keys.includes('description') && keys.includes('price') && 
    //     keys.includes('thumbnail') && keys.includes('code') && keys.includes('stock') &&
    //     keys.length===6)
    if(keys.length===validacion.length && 
      validacion.every(element=>keys.includes(element))&& 
      values.every(element=>element))
      return true
    return false
  }

  getProducts = async (_) => {
    if (fs.existsSync(this.#path) && fs.statSync(this.#path).size)  {
      try {
        let products = await fs.promises.readFile(this.#path);
        products = JSON.parse(products);
        return products;
      }
      catch (err) {
        throw err;
      }
    }
    else {
      return [];
    }
  }

  getProductById = async (id) => {
    try {
      let retorno = "Not found";
      let products = await this.getProducts();
      if(products.length>0)
      products.forEach((element) => { if (element.id === id) { retorno = element; return } })
      return retorno;
    }
    catch (err) {
      console.error(err)
    }
  }

  updateProduct = async (id, product) => {
    try {
      let products = await this.getProducts();
      const productId= products.findIndex(product => product.id === id)
      if(productId >-1)
      {
        if (this.#validarFormato(product) && this.#validarCodigo(product, products,products[productId].code)) 
        {        
          product.id=id;
          products[productId]=product;
          await fs.promises.writeFile(this.#path,JSON.stringify(products,null,2))
          return id
        }
      }
      
        return "Not found"
      
    }
    catch (err) {
      console.error(err)
    }

  }

  deleteProduct = async (id) => {
    try {
      let products = await this.getProducts();
      const productId = products.findIndex(product => product.id === id)
  
      if (productId >-1) {
         const producDelet = products.splice(productId, 1);
        await fs.promises.writeFile(this.#path, JSON.stringify(products, null, 2));
        return producDelet;
      }
  
      return "Not found";
    } catch (err) {
      console.error(err);
    }
  };
  
}

//-------------------------------------------- tests -----------------------------------


try
{

  //instanciar productos y clase

  let product1 = { title: "cafe", description: "Flavouring - Rum", price: 38, thumbnail: "Room 1760", code: 20, stock: 7 }
  let product2 = { title: "mete", description: "Flavouring - Rum", price: 38, thumbnail: "Room 1760", code: 21, stock: 7 }
  let product3 = { title: "tee", description: "Flavouring - Rum", price: 38, thumbnail: "Room 1760", code: 22, stock: 7 }
  let product4 = { title: "tee", description: "Flavouring - Rum", price: 38, thumbnail: "Room 1760", code: 23, stock: 7 }
  let product5 = { title: "tee", description: "Flavouring - Rum", price: 38, thumbnail: "Room 1760", code: 24, stock: 7 }
  let productMod = { title: "modificado22", description: "modificado", price: 38, thumbnail: "modificado", code: 20, stock: 7 }
  const productManager = new ProductManager();


  (async () => {
    //test para ver si retorna un array vacio
    console.log("Llamada sin datos")
    console.log(await productManager.getProducts())

    //test para saber si agrega un producto
    await productManager.addProduct(product1)>0?console.log(`producto agregado`):console.log("no se pudo agregar")
    console.log("lista de productos")
    console.log(await productManager.getProducts())

    //test para ver que no vuelva a agregar un producto con el mismo code
    await productManager.addProduct(product1)>0?console.log(`producto agregado`):console.log("no se pudo agregar")
    console.log("lista de productos")
    console.log(await productManager.getProducts())

    //test para que agregue 4 productos mas  
    await productManager.addProduct(product2)>0?console.log(`producto agregado`):console.log("no se pudo agregar")
    await productManager.addProduct(product3)>0?console.log(`producto agregado`):console.log("no se pudo agregar")
    await productManager.addProduct(product4)>0?console.log(`producto agregado`):console.log("no se pudo agregar")
    await productManager.addProduct(product5)>0?console.log(`producto agregado`):console.log("no se pudo agregar")
    console.log("lista de productos")
    console.log(await productManager.getProducts())
    
    //test para que imprima un solo id
    console.log("producto con id 2 =")
    console.log(await productManager.getProductById(2))
    
    //test para eliminar el id anterior
    console.log(await productManager.deleteProduct(2))

    //test para modificar el producto con id 1
    let mod = await productManager.updateProduct(1,productMod)
    console.log(mod)
  })();
}
catch(err)
{
  console.error(err);
}

