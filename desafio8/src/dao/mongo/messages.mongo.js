import { messageModel } from "./models/messages.model.js";

export default class MessageManager {

  #user;
  
  constructor(user) {
        this.#user= user
  }

  saveMessage = async (message) => {

    try {
        const message2=  messageModel({message:message,user:this.#user})
        
        return await message2.save()
    }
    catch (err) {
      console.error(err)
      return -1
    }

  }



  static getMessages = async (_) => {
    try
    {
        return messageModel.find().exec()
    }catch(err){
        console.log(err)
        return -1
    }
  }

 
  static getMessageById = async (id) => {
    try
    {
        return messageModel.find({_id:id}).exec()
    }catch(err){
        console.log(err)
        return -1
    }
  }

  static getLastMessage = async (_)=>{
    try
    {
        return await messageModel.findOne().sort({_id: -1}).limit(1);
    }catch(err){
        console.log(err)
        return -1
    }
  }
}