import mongoose from "mongoose";

const collection = 'cart'
const ref= 'products'

const schema = new mongoose.Schema({
products: [
    { 
        idProduct: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: ref,
            require:true
        },
        quantity:{
            type:Number,
            require:true
        } 
    }]
})

export const CartModel = new mongoose.model(collection,schema)

