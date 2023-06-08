import { fileURLToPath } from 'url';
import path from 'path';
import bcrypt from 'bcrypt'

const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10))
const comparePassword = (userPasword,password) => bcrypt.compareSync(password,userPasword)


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export { __filename, __dirname ,comparePassword ,createHash};
