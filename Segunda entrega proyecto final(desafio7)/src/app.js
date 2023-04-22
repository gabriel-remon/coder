import bodyParser from 'body-parser';
import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import indexRouter from './routers/index.router.js';
import { __dirname } from './utils.js';
import {objetConfig} from './utils/connect.mongo.js'

const app = express();
const PORT= 8080;

const httpServer = app.listen(PORT, (_)=> console.log(`Server iniciado en puerto ${PORT}`));
app.io = new Server(httpServer);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('handlebars', handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');

app.use(express.static(__dirname+'/public'))

//Connection to the MongoDB database.
objetConfig.connectDB()

//Integration of all routes that the app will handle
app.use(indexRouter)

//Handler for the connection and disconnection events of web sockets
app.io.on('connection',socket =>{
    console.log('Nuevo cliente conectado id: '+socket.id);
    socket.on('disconnect', (_)=>{
        console.log('cliente desconectado id: '+socket.id);
    })
})


export default app