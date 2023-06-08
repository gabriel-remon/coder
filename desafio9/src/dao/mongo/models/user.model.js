
import mongoose from "mongoose";

const collection = 'users'

const schema = new mongoose.Schema({
nombre:{
    type:String, 
    require:true
},
apellido:{
    type: String,
    require:true
},
email:{
    type: String,
    require:true,
    unique: true
},
password:{
    type: String,
    require:true
},
fechaNacimiento: {
    type:Date,
    equire:true
}
})

export const userModel = new mongoose.model(collection,schema)

