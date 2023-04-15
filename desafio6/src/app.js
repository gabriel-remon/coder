import express from 'express';
import handlebars from 'express-handlebars';
import {__dirname} from './utils.js';
import {Server} from 'socket.io'
import routerViews from "./routers/view.router.js";
import ruterProducts from './routers/ruterProduct.js';
import routerListProducts from './routers/view.listProducts.js';
import bodyParser from 'body-parser';

const app = express();
const PORT= 8080;

const httpServer = app.listen(PORT, (_)=> console.log(`Server iniciado en puerto ${PORT}`));
const io = new Server(httpServer);
app.io= io;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('handlebars', handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');
app.use(express.static(__dirname+'/public'))

app.use('/',routerViews)
app.use('/products',ruterProducts)
app.use('/realTimeProducts',routerListProducts)


io.on('connection',socket =>{
    console.log('Nuevo cliente conectado id: '+socket.id);
    socket.on('disconnect', _ =>{
        console.log('cliente desconectado id: '+socket.id);
    })
})


export default app;