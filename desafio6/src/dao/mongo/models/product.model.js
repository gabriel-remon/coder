import mongoose from "mongoose";

const collection = 'products'

const schema = new mongoose.Schema({
title: {type: String, required: true},
description:{type: String, required: true},
price:{type: Number, required: true},
thumbnails: String,
code:{type: String, required: true, unique: true},
stock:{type: Number, required: true},
status:{type: Boolean, default: true},
category:{type: String, required: true}
})

export const productModel = new mongoose.model(collection,schema)

