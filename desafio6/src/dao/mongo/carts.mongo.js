import { CartModel } from './models/cart.model.js';
import ProductManager from './products.mongo.js';
import { ObjectId } from 'mongodb';

export default class CartManager {

  #productManager;
  
  constructor() {
    
    this.#productManager = new ProductManager()
  }

  addCart = async () => {

    try {
        return await CartModel().save()._id
    }
    catch (err) {
      console.error(err)
      return -1
    }

  }



  getCarts = async (_) => {
    try
    {
        return CartModel.find().exec()
    }catch(err){
        console.log(err)
        return -1
    }
  }


  getCartById = async (id) => {
    try
    {
        const retorno =  await CartModel.findOne({_id:id})
        return retorno
    }catch(err){
        console.log(err)
        return -1
    }
  }


  addProduc = async(Pid,Cid)=>{
    try {

        let encontrado=false;
        const cart=await this.getCartById(Cid)
        if(!this.#productManager.getProductById(Pid)){
            return -1
        }
        if(!cart){
            return -2
        }
        if(cart.products.length>0)
        cart.products.forEach((element,index) => {
          if(element.idProduct.equals( new ObjectId(Pid) ))
            {
                cart.products[index].quantity++
                encontrado =true;
                return
            }
        });

        if(!encontrado)
        {
            cart.products.push({idProduct: Pid, quantity:1})
        }
        
        this.#productManager.discountProduct(Pid)
        return CartModel.updateOne({_id:Cid},cart).exec()

      }
      catch (err) {
        console.error(err)
      }
  }
}