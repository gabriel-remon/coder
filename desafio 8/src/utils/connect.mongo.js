import {connect} from 'mongoose'

const url='mongodb+srv://coderHouse:gabriel12@coderhouse.5svhlr3.mongodb.net/eComers'

export const objetConfig = {
    connectDB: async ()=>{
        try{
            await connect(url)
            console.log('base de datos conectada')
        }catch(err){
            console.log(err)
        }

    }
}

