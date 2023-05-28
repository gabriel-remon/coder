import { Router } from "express";
import UserManager from "../dao/mongo/user.mongo.js";
import { usuarioLogeado } from "../middlewares/auth.js";

const routerSession = Router()
const userManager = new UserManager()

routerSession.get('/login',usuarioLogeado, async (req, res) => {
    res.render('login')
})

routerSession.post('/login', async (req, res) => {
    const {email,password} = req.body
    if(email=='adminCoder@coder.com' && password=='adminCod3r123'){
        req.session.rol='admin'
        req.session.admin=true
        return res.json({code:0,message:'admin'})
    }

    const user = await userManager.validarUser(email,password)
    if(user.code<0){
        res.json(user)
    }else{
        req.session.userData=user.message
        req.session.rol='user'
        req.session.user=true
        res.json(user)
    }
})

routerSession.get('/register', async (req, res) => {
    res.render('register')
})

routerSession.post('/register', async (req, res) => {
    const {nombre,apellido,email,password,nacimiento} = req.body
    const newId = await userManager.addUser({
        nombre:nombre,
        apellido:apellido,
        email,email,
        pasword:password,
        fechaNacimiento:nacimiento
    })
    res.json(newId)
    /*
    if(newId.code<0){
        res.json(newId)
    }else{
        res.render('login')
    }
    */
})

routerSession.get('/logout', async (req, res) => {
    req.session.destroy(err=>{
        if(!err)
        res.render('login')
        else
        res.code(500).send('error al salir de la sesion')
    })
})


routerSession.get('/', async (req, res) => {
})


export default routerSession