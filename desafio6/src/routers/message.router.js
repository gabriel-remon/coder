import { Router } from "express";
import app from "../app.js";
import { __dirname } from "../utils.js";
import MessageManager from "../dao/mongo/messages.mongo.js";

const routerMessage = Router()

routerMessage.get('/', async (req, res) => {
    const messages = await MessageManager.getMessages()
    
    res.render('chat')
    
    app.io.on('connection',socket =>{
        
        let user;
        socket.emit('list-message',messages)
        socket.emit('login');
        
        socket.on('user-loger',(data)=>user=new MessageManager(data))
        socket.on('message-send',async (data)=>{
            try
            {
                await user.saveMessage(data)
                app.io.emit('new-message', await MessageManager.getLastMessage())
            }catch(err){
                socket.emit('message-error',err)
                console.error(err)
            }

        })
    })
})

export default routerMessage