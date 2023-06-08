
const validarSession  = (req,res,next)=>{

   if(req.session.rol === 'admin' || req.session.rol === 'user'){
    return next()
   }
   res.render('error',{
                        message:'no tiene los permisos necesarios para ingresar a la pagina',
                        url:'/session/login',
                        urlMessage:'iniciar sesion'})
  }
const usuarioLogeado  = (req,res,next)=>{

   if(req.session.rol === 'admin' || req.session.rol === 'user'){
       return res.render('error',{
                            message:`Ya exite un usuario logeado`,
                            url:'/products',
                            urlMessage:'productos'})
    }
    return next()
  }

export { 
    validarSession,
    usuarioLogeado
     }