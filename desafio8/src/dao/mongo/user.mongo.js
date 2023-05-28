import async from 'hbs/lib/async.js';
import { userModel } from './models/user.model.js';
import { ObjectId } from 'mongodb';

export default class UserManager {

    constructor() {
    }

    addUser = async (product) => {

        try {

            if (! await this.#validarFormato(product)) {
                return { code: -1, message: 'el formato ingresado no es valido' };
            }


            if (await userModel.findOne({ email: product.email }).exec()) {
                return { code: -2, message: 'el email ya existe en la base de datos' }
            }

            const newProduct = await userModel(product).save()
            return { code: 0, message: newProduct._id }

        }
        catch (err) {
            return { code: -3, message: err }
        }

    }


    #validarFormato = async (product) => {
        try {
            await userModel.validate(product)
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
            if (! await this.#validarFormato(product)) {
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

            const user = await userModel.findOne({ email: email, pasword: password })
            if (user) {
                const edad = Math.floor( 
                    (new Date() - new Date(user.fechaNacimiento))/ 1000 / 60 / 60 / 24 / 365.25
                    )  
                return {
                    code: 0, message: {
                        email: user.email,
                        nombre: user.nombre,
                        apellido: user.apellido,
                        edad :edad
                    }
                }
            } else {
                return { code: -1, message: 'usuario no encontrado' }
            }
        }
        catch (err) {
            console.error(err)
            return -2
        }
    }

}