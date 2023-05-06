import async from 'hbs/lib/async.js';
import { productModel } from './models/product.model.js';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';


const {aggregate}= mongoose

export default class ProductManager {

  constructor() {
  }

/**
 * Adds a product to the list of products saved in the path, validating that
 * the product has 'title', 'description', 'price', 'thumbnail', 'code', 'stock',
 * that no field is empty, and that the 'code' field is not repeated in the saved products.
 * It also assigns an id to the product.
 * @param {object} product - Product to be added to the list.
 * @returns -1: Invalid format;
 *          -2: There is already a product with that code
 *          -3: Database connection error
 *          object: Id of the product successfully saved.
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
 * This function verifies that the object passed as a parameter meets the requirements 
 * of the product schema in order to be loaded into the database.
 * @param {object} product - "Product to evaluate"
 * @returns true - if the product meets the conditions.-
 *          false - if it does not meet the conditions.
 */
  #validarFormato = async (product) => {
    try{
      await productModel.validate(product)
      return true 
    }catch(_)
    {
      return false
    }
  }
 

/**
 * Searches the database for all saved products and returns them as a JSON.
 * @returns -1: Error while searching for products in the database -
 *          array: Found products;
 */
  getProducts = async (_) => {  
    try {
      return await productModel.find()
      }
      catch (err) {
        console.log(err);
        return -1
      } 
  }

  
  getProductsIndex = async (limit,page,query,sort) => {  
    try {

      
      //return await productModel.paginate(query,{limit:limit,page:page,sort:sort})
      //const retorno = productModel.aggregate([{$sort:{price:-1}}])
      return await productModel.paginate(query,{limit:limit,page:page,sort:sort!==0?{price:sort}:null})
      
      }
      catch (err) {
        console.log(err);
        return -1
      }
  }
/**
 * Searches the database for all saved products that have the 'status' 
 * property set to true and returns them as a JSON.
 * @returns -1: Error while searching for products in the database -
 *          array: Found products
 */
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
   * Search for a product in the database by passing its id as a parameter.
   * @param id - Product ID to search for.
   * @returns objet: product found
   *          -1: The id passed as a parameter is not an ObjectId.
   *          -2: error in the basedate
   */
  getProductById = async (id) => {
    try {
      if(!ObjectId.isValid(id))
       return -1
      return await productModel.findOne({_id:id})
     
    }
    catch (err) {
      console.error(err)
      return -2
    }
  }

  /**
   * You must pass the ID to be updated and the product to be updated. 
   * It will be searched if the ID matches any product in the database 
   * and that product will be updated.
   * @param id - product ID
   * @param product - Product to update.
   * @returns -1: Invalid product format
   *          -2: Product not found
   *          -3: the 'code' property of the product already exists in another product
   *          -4: Database connection error
   *          object: product updated
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
      return -4
    }

  }

  /**
   * Deletes a product from the database in a logical way, 
   * setting its 'status' property to false.
   * @param {int} id - product ID
   * @returns -1: Product not found
   *          -2: Database error
   *          object: Object of the deleted product
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

  /**
   * Searches for a product in the database and subtracts one 
   * unit from the stock if there is available stock and if 
   * the product is enabled, and then returns the updated product.
   * @param id - product ID
   * @returns -1: Product not found
   *          -2: The product cannot be discounted because it is disabled.
   *          -3:Not enough stock available
   *          -4: Database error
   *          object: Product object
   */
  discountProduct = async(id) =>{
    try {

      const product = await productModel.findOne({_id:id})

      if(!product){
        return -1
      }
      if(!product.status){
        return -2
      }
      if(product.stock<1){
        return -3
      }
      product.stock--
      return await productModel.updateOne({_id:id},product)
    } catch (err) {
      console.error(err);
      return -4
    }
  }
  
categorysProductsc=async ()=>{
  return await productModel.distinct('category')
}

}