
import { userModel } from './models/user.model.js';
import { ObjectId } from 'mongodb';
import { comparePassword, createHash } from '../../utils.js';

export default class UserManager {

    constructor() {
    }

    addUser = async (user) => {

        try {

            if (! await this.#validarFormato(user)) {
                return { code: -1, message: 'el formato ingresado no es valido' };
            }


            if (await userModel.findOne({ email: user.email }).exec()) {
                return { code: -2, message: 'el email ya existe en la base de datos' }
            }
            user.password= createHash( user.password)
            const newProduct = await userModel(user).save()
            return { code: 0, message: newProduct._id ,user:newProduct}

        }
        catch (err) {
            return { code: -3, message: err }
        }

    }


    #validarFormato = async (user) => {
        try {
            await userModel.validate(user)
            return true
        } catch (_) {
            return false
        }
    }



    getUsers = async (_) => {
        try {
            return await userModel.find()
        }
        catch (err) {
            console.log(err);
            return -1
        }
    }



    getUserByEmail = async (email) => {
        try {
            return await userModel.findOne({ email: email })
        }
        catch (err) {
            console.error(err)
            return -1
        }
    }


    getUserById = async (id) => {
        try {
            if (!ObjectId.isValid(id))
                return -1
            return await userModel.findOne({ _id: id })

        }
        catch (err) {
            console.error(err)
            return -2
        }
    }

    updateUser = async (id, user) => {
        try {
            if (! await this.#validarFormato(user)) {
                return -1;
            }
            const userUpdate = await this.getUserById(id);

            if (!userUpdate) {
                return -2
            }

            if (userUpdate.email !== user.email && await userModel.findOne({ email: user.email })) {
                return -3;
            }
            return await userModel.updateOne({ _id: id }, user).exec()

        }
        catch (err) {
            console.error(err)
            return -4
        }

    }

    validarUser = async (email, password) => {
        try {

            const user = await userModel.findOne({ email: email})
            if(!comparePassword(user.password,password))return { code: -2, message: 'password incorrecta' }
            
            if (user) {
                const edad = Math.floor( 
                    (new Date() - new Date(user.fechaNacimiento))/ 1000 / 60 / 60 / 24 / 365.25
                    )  
                return {
                    code: 0, message: {
                        id:user._id,
                        email: user.email,
                        nombre: user.nombre,
                        apellido: user.apellido,
                        edad :edad
                    }
                }
            } else {
                return { code: -2, message: 'usuario no encontrado' }
            }
        }
        catch (err) {
            console.error(err)
            return -3
        }
    }

}