import { productModel } from './models/product.model.js';
import { ObjectId } from 'mongodb';

export default class ProductManager {
/**
 * instancia de la clase ProductManager, si no se pasa un path por parametro se 
 * cargara por defecto "./productos.json"
 * @param {string} path - path donde se guardaran todos los productos
 */
  constructor() {
  }
/**
 * agrega un producto a la lista de productos guardada enel path validando que 
 * el producto tenga 'title','description','price','thumbnail','code','stock' , 
 * que no tenga ningun campo vacio y que el campo code no se repita en los productos
 * guardados. tambien le asigna un id
 * @param {object} product - producto que se agregara a la lista 
 * @returns -1: formato invalido;
 *          -2: ya existe un producto con ese codigo
 *          -3: error de conexcion con basa de datos
 *          cualquier otro valor: id del producto guardado con exito
 */
  addProduct = async (product) => {
    
    try {

      if(! await this.#validarFormato(product))
      {
        return -1;
      }

      if(await productModel.find({code: product.code}).exec().length > 0){
        return -2
      }

      const newProduct = await productModel(product).save()
      return newProduct._id;

    }
    catch (err) {
      console.error(err)
      return -3
    }

  }


/**
 * valida que el prodicto tenga los campos requeridos y que no tenga propiedades con valor 
 * undefined o string vacio
 * @param {object} product - producto a evaluar
 * @returns true - si el producto cumple con las condiciones. false - si no las cumple
 */
  #validarFormato = async (product) => {
    
    console.log(product)
    try{
      await productModel.validate(product)
      return true 
    }catch(_)
    {
      return false
    }
  }
 

/**
 * lee la lista de productos del path guardado y la retorna, si no existe el archivo 
 * o si el archivo esta vacio retorna un array vacio 
 * @returns -1: error al leer la base de datos
 *          array con los productos guardados;
 */
  getProducts = async (_) => {
    
    try {

      return await productModel.find().exec();
      
      }
      catch (err) {
        console.log(err);
        return -1
      }
    
  }

  getProductsEnable = async (_) =>{

    try {

      return await productModel.find({status:true}).exec();
      
      }
      catch (err) {
        console.log(err);
        return -1
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
      if(!ObjectId.isValid(id))
       return 0
      return await productModel.findOne({_id:id})
     
    }
    catch (err) {
      console.error(err)
      return -1
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
      if(! await this.#validarFormato(product))
      {
        return -1;
      }
      const productUpdate = await this.getProductById(id);

      if(!productUpdate){
        return -2
      }

      if(productUpdate.code !== product.code  && await productModel.findOne({code:product.code}) ){
        return -3;
      }
      return await productModel.updateOne({_id:id},product).exec()
      
    }
    catch (err) {
      console.error(err)
      return -3
    }

  }

  /**
   * busca un id en la lista de productos
   * @param {int} id - id a eliminar
   * @returns object - producto eliminado. string - "Not found"
   */
  deleteProduct = async (id) => {
    try {

      const product = await productModel.findOne({_id:id})

      if(!product){
        return -1
      }
      product.status = false
      await productModel.updateOne({_id:id},product)
      return await this.getProductById(id)
    
    } catch (err) {
      console.error(err);
      return -2
    }
  };

  discountProduct = async(id) =>{
    try {

      const product = await productModel.findOne({_id:id})

      if(!product){
        return -1
      }
      product.stock--
      await productModel.updateOne({_id:id},product)
      return 1
    
    } catch (err) {
      console.error(err);
      return -2
    }
  }
  
}