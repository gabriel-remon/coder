import express from 'express';
import handlebars from 'express-handlebars';
import {__dirname} from './utils.js';
import {Server} from 'socket.io'
import routerViews from "./routers/view.router.js";
import ruterProducts from './routers/ruterProduct.js';
import routerListProducts from './routers/view.listProducts.js';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import routerMessage from './routers/message.router.js';
import ruterCarts from './routers/ruterCarts.js';

const app = express();
const PORT= 8090;

const httpServer = app.listen(PORT, (_)=> console.log(`Server iniciado en puerto ${PORT}`));
const io = new Server(httpServer);
app.io= io;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('handlebars', handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');
app.use(express.static(__dirname+'/public'))

mongoose.connect('mongodb+srv://coderHouse:gabriel12@coderhouse.5svhlr3.mongodb.net/eComers')
.then(()=>console.log('Base de datos conetada'))
.catch((err)=>{
    if(err)
    {
        console.log('Error al conectar la base de datos: '+ err);
        process.exit()
    }
})

app.use('/',routerViews)
app.use('/products',ruterProducts)
app.use('/realTimeProducts',routerListProducts)
app.use('/chat',routerMessage)
app.use('/cart',ruterCarts)


io.on('connection',socket =>{
    console.log('Nuevo cliente conectado id: '+socket.id);
    socket.on('disconnect', _ =>{
        console.log('cliente desconectado id: '+socket.id);
    })
})


export default app;