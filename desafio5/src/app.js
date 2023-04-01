import express from 'express';
import handlebars from 'express-handlebars';
import {__dirname} from './utils.js';
import {Server} from 'socket.io'
import viewsRouter from "./routers/view.router.js";
import ruterProducts from './routers/ruterProduct.js';

import bodyParser from 'body-parser';

const app = express();
const PORT= 8080;

const httpServer = app.listen(PORT, (_)=> console.log(`Server iniciado en puerto ${PORT}`));
const io = new Server(httpServer);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('handlebars', handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');
app.use(express.static(__dirname+'/public'))
app.use('/',viewsRouter)
app.use('/products',ruterProducts)
io.on('connection', (socket)=> {
    console.log('Usuario conectado');
    
    socket.on('new-product', ()=>{
        console.log('apregando producto');
    })
})