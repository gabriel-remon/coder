
import mongoose from "mongoose";

const collection = 'message'

const schema = new mongoose.Schema({
message:{
    type:String, 
    require:true
},
user:{
    type: String,
    require:true
},
date: {type:Date,
    default: Date.now}
})

export const messageModel = new mongoose.model(collection,schema)

