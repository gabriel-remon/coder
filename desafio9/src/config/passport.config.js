import passport from 'passport'
import local from 'passport-local'
import UserManager from '../dao/mongo/user.mongo.js'

const LocalStrategy = local.Strategy;

const initializatePassport = () => {
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true },
        async function (req, username, password2, done) {
            try {
                const userManager = new UserManager();
                const { nombre, apellido, email, password, nacimiento } = req.body
                const newId = await userManager.addUser({
                    nombre: nombre,
                    apellido: apellido,
                    email: email,
                    password: password,
                    fechaNacimiento: nacimiento
                })

                if (newId.code == 0) {
                    done(null, newId.user)
                } else {
                    done(newId.message)
                }


            } catch (err) {

                done(`eror al general el registro ${err}`)
            }
        })
    )
    

    passport.use('prueba', new LocalStrategy(
         function (username, password, done) {
            console.log('prueba')
            try {
                done(null,true)

            } catch (err) {

                done(`eror al general el registro ${err}`)
            }
        })
    )

    
    passport.use('login', new LocalStrategy(
        {
            usernameField: 'email'
        },
        async (username, password, done) => {

            let user = {}
            if (username == 'adminCoder@coder.com' && password == 'adminCod3r123') {
                user.rol = 'admin'
                user.admin = true
            }

            const userGuardado = await userManager.validarUser(username, password)
            if (user.code < 0) {
                return done(userGuardado.message)
            } else {
                user = userGuardado.message
                user.rol = 'user'
                user.user = true
            }
            done(null, user)
        })
    )

    passport.use('gitHub', new LocalStrategy(
        {},
        () => {

        })
    )

    passport.serializeUser((user, done) => {
        console.log('serializar')
        done(null, user._id)
        
    })
    passport.deserializeUser(async (id, done) => {
        try {
            console.log('deserializar')
            let user = await userManager.getUserById(id)
            done(null, user)
        } catch (err) {
            done(`eror al deserializar: ${err}`)
        }

    })
    
}

export default initializatePassport