import  fs  from 'fs';
import mongoose, { Error } from 'mongoose'
import { productModel } from './models/product.model.js';
import { error } from 'console';

export default class ProductManager {
/**
 * instancia de la clase ProductManager, si no se pasa un path por parametro se 
 * cargara por defecto "./productos.json"
 * @param {string} path - path donde se guardaran todos los productos
 */
  constructor(collection) {
    this.#collection= ( collection ? collection : "products")
  }
/**
 * agrega un producto a la lista de productos guardada enel path validando que 
 * el producto tenga 'title','description','price','thumbnail','code','stock' , 
 * que no tenga ningun campo vacio y que el campo code no se repita en los productos
 * guardados. tambien le asigna un id
 * @param {object} product - producto que se agregara a la lista 
 * @returns retorna el id que se cargo y si no fue posible retorna -1
 */
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

  /**
   * valida que el "code" de produc no sea el mismo que ninguno de los productos guardados
   * si excluir no es undefined toma como valido que se pueda cargar un nuevo producto con un 
   * "code" repetido
   * @param {object} product -producto que se evaluara
   * @param {object} products -lista de productos
   * @param excluir 
   * @returns true - si el producto es valido. false - si no lo es
   */
  #validarCodigo = (product, products, excluir) => {

    let retorno = true
    products.forEach(element => {
       
      if (element.code === product.code && !( excluir  && element.code === excluir))
      {
        retorno = false
        return;
      }
      
    })
    return retorno;
  }


/**
 * valida que el prodicto tenga los campos requeridos y que no tenga propiedades con valor 
 * undefined o string vacio
 * @param {object} product - producto a evaluar
 * @returns true - si el producto cumple con las condiciones. false - si no las cumple
 */
  #validarFormato = (product) => {
    
    
    delete product.id
    const validacion= ['title','description','price','thumbnails','code','stock','status','category']
    const keys = Object.keys(product)
    const values = Object.values(product).map(element=>{return typeof element === "string"?  element.trim(): element})
    
    //if(typeof product.thumbnails  === 'undefined') product.thumbnails  = "sin fotos"
    
    if(keys.length===validacion.length && 
      validacion.every(element=>keys.includes(element))&& 
      values.every(element=> typeof element !== 'undefined'))
      return true
    return false
  }
 

/**
 * lee la lista de productos del path guardado y la retorna, si no existe el archivo 
 * o si el archivo esta vacio retorna un array vacio 
 * @returns lista de productos o array vacio
 */
  getProducts = async (_) => {
    
    try {
        let products = []
        productModel.find({},function(err,products){
          if(err){
            products = err
          }else
          {
            products = products
          }
        })
        return products;
      }
      catch (err) {
        throw err;
      }
    
  }

  getProductsEnable = async (_) =>{

    try {
      let products = []
      productModel.find({status:true},function(err,products){
        if(err){
          products = err
        }else
        {
          products = products
        }
      })
      return products;
    }
    catch (err) {
      throw err;
    }
  }

  /**
   * buscar un producto dentro de la lista de productos guardada con el mismo id
   * si lo encuentra devuelve el objeto del producto sino retorna "Not found"
   * @param {int o string} id -id a buscar
   * @returns objeto del producto encontrado o string "Not found" 
   */
  getProductById = async (id) => {
    try {
      let retorno = "Not found";
      let products = await this.getProducts();
      id=parseInt(id)
      if(products.length>0)
      products.forEach((element) => {if (element.id === id) { retorno = element; return } })
      return retorno;
    }
    catch (err) {
      console.error(err)
    }
  }

  /**
   * busca un id dentro de la lista de productos, si lo encuentra cambia todo el contenido de 
   * ese id (sin modificar el id) por los datos del producto enviado por parametro. tambien verifica
   * lo mismo que addProduct solo que esta funcion permite que se ingrese un code existente si y solo si
   * el producto que se cambiara comparte codigo con el nuevo producto
   * @param {int} id - id que sera cambiado
   * @param {object} product - producto que se guardara
   * @returns id del producto cambiado - string "Not found" si no se encontro el id
   */
  updateProduct = async (id, product) => {
    try {
      id=parseInt(id)
      
      let products = await this.getProducts();
      
      const productId= products.findIndex(product => product.id === id)
      
      if(productId >-1)
      {
       // console.log(product)
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

  /**
   * busca un id en la lista de productos
   * @param {int} id - id a eliminar
   * @returns object - producto eliminado. string - "Not found"
   */
  deleteProduct = async (id) => {
    try {
      let products = await this.getProducts();
      id=parseInt(id)
      const productId = products.findIndex(product => product.id === id)
  
      if (productId >-1) {
         //const producDelet = products.splice(productId, 1);
        products[productId].status = false;
        await fs.promises.writeFile(this.#path, JSON.stringify(products, null, 2));
        return products[productId];
      }
  
      return "Not found";
    } catch (err) {
      console.error(err);
    }
  };
  
}