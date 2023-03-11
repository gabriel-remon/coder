
import ProductManager from "./producManager.js";

try
{
  //instanciar productos y clase
  let product1 = { title: "cafe", description: "Flavouring - Rum", price: 38, thumbnail: "Room 1760", code: 20, stock: 7 }
  let product2 = { title: "mete", description: "Flavouring - Rum", price: 38, thumbnail: "Room 1760", code: 21, stock: 7 }
  let product3 = { title: "tee", description: "Flavouring - Rum", price: 38, thumbnail: "Room 1760", code: 22, stock: 7 }
  let product4 = { title: "tee", description: "Flavouring - Rum", price: 38, thumbnail: "Room 1760", code: 23, stock: 7 }
  let product5 = { title: "tee", description: "Flavouring - Rum", price: 38, thumbnail: "Room 1760", code: 24, stock: 7 }
  let productMod = { title: "modificado22", description: "modificado", price: 38, thumbnail: "modificado", code: 20, stock: 7 }
  
  //instanciar ProductManager para que los productos sean guardados en "./listaProductos.js"
  const productManager = new ProductManager("./listaProductos.json");
  
  
  (async () => {
    
    //test para ver si retorna un array vacio
    console.log("--------------test 1-------------")
    console.log("lista de productos")
    console.log(await productManager.getProducts())
    
    /*
    //test para saber si agrega un producto
    console.log("\n\n--------------test 2-------------")
    await productManager.addProduct(product1)>0?console.log(`producto agregado`):console.log("no se pudo agregar el producto")
    console.log("\nlista de productos")
    console.log(await productManager.getProducts())
    
    /*
    //test para ver que no vuelva a agregar un producto con el mismo code
    console.log("\n\n--------------test 3-------------")
    await productManager.addProduct(product1)>0?console.log(`producto agregado \n`):console.log("no se pudo agregar el producto\n")
    
    
    /*
    //test para que agregue 4 productos mas  
    console.log("\n\n--------------test 4-------------")
    await productManager.addProduct(product2)>0?console.log(`producto agregado`):console.log("no se pudo agregar")
    await productManager.addProduct(product3)>0?console.log(`producto agregado`):console.log("no se pudo agregar")
    await productManager.addProduct(product4)>0?console.log(`producto agregado`):console.log("no se pudo agregar")
    await productManager.addProduct(product5)>0?console.log(`producto agregado`):console.log("no se pudo agregar")
    console.log("\nlista de productos")
    console.log(await productManager.getProducts())
    
    /*
    //test para que imprima un solo id
    console.log("\n\n--------------test 5-------------")
    console.log("producto con id 2 =")
    console.log(await productManager.getProductById(2))
    
    /*
    //test para eliminar el id anterior
    console.log("\n\n--------------test 6-------------")
    console.log("producto eliminado")
    console.log(await productManager.deleteProduct(3))
    
    /*
    //test para modificar el producto con id 1
    console.log("\n\n--------------test 7-------------")
    console.log("producto 1 antes de ser modificado")
    console.log(await productManager.getProductById(1))
    let mod = await productManager.updateProduct(1,productMod)
    console.log(`se modifico el id: ${mod}`)
    console.log(await productManager.getProductById(1))
    */
  })();
}
catch(err)
{
  console.error(err);
}
