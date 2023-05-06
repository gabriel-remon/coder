import { ObjectId } from "mongodb";

const validateListProducts = ()=>{
  try
  {
    const {products} = req.body
  
    if(!products || !Array.isArray(products))
      return res.status(400).send('no se encontro la lista de productos en el body')

    products.forEach((element)=>{
      if(isNaN(element.quantity) || !ObjectId.isValid(element.idProduct) || Object.keys(element).length>=2)
        return res.status(400).send('la lista de productos no esta en el formato especificado')
    })
  }catch(err)
  {
    return res.status(500).send(err)
  }
  
  
}

const validateQuantity = (req,res,next)=>{
  const {quantity} = req.body
  if(!quantity || isNaN(quantity))
    return res.status(400).send('Invalid quantity property')

  next()
}

const validateGetProducts = (req,res,next)=>{
  let {limit,page,query,sort} = req.query
  if(!limit || isNaN(limit))
    req.query.limit=10;
  

  if(!page || isNaN(page))
    req.query.page=1

  if(!query || typeof query !== 'string')
    req.query.query = undefined
  else
  req.query.query=req.query.query.replace('-'," ")

  if(!isNaN(sort))
    sort = parseInt(sort)

  if(sort!== 1 && sort!==-1)
    req.query.sort=0
  
    next()
}

/**
 * that the fields title, description, code, 
 * price, stock, and category exist in the request body, validate 
 * that they are of the required type, and if the thumbnails 
 * property is not present, create it with a default text.
 */
const validateProductFields = (req, res, next) => {

  const {thumbnails,title,description,code,category} = req.body
  if (!thumbnails || typeof thumbnails !== "string"  ) body.thumbnails = "sin fotos"

  if (typeof title === "string" &&
    typeof description === "string" &&
    typeof code === "string" &&
    !isNaN(body.price) &&
    !isNaN(body.stock) &&
    typeof category === "string") {
      next();
  }
  else
     return res.status(400).send("Missing parameters or the ones passed are in an incorrect format.")
}
/**
 *  that a property called status exists in the body, 
 * and if it does not exist, create it with the default 
 * value of true.
 */
const validateStatus = (req, res, next) => {

  if (typeof body.status !== 'undefined') {
    if (body.status !== true && body.status !== false) 
      return res.status(400).send("The value passed in status is not valid")
  }
  else {
    body.status = true
  }

  next()
}

/**
 * Load an object called product in the body, which has the properties 
 * title, description, code, Price, status, stock, and category. 
 * */
const parseProductFromBody = (req, res, next) => {
  req.body.product = {
    title: body.title,
    description: body.description,
    code: body.code,
    price: parseInt(body.price),
    status: req.body.status,
    stock: parseInt(body.stock),
    category: body.category, thumbnails: body.thumbnails
  };
  next()
}

/**
 * Validate that a property called id exists in the params 
 * and is of type objectID. If it does not exist, return 
 * a 400 error with a message indicating the error
 */
const validateObjetID =(req,res,next)=>{
  const id = req.params

  if(!id)
    return res.status(400).send("Missing ID parameters") 
  
  if(ObjectId.isValid(id))
    next()
  else
    return res.status(400).send("The sent ID do not have the correct format (ObjectID).")

}

/**
 *  Validate that the properties pid and cid 
 * exist in the params section of the request 
 * and that both are valid as object IDs. If 
 * they do not exist, return a 400 error in the 
 * request with the error message 
 * @returns 
 */
const validateCartObjetID  = (req,res,next)=>{

  const {pid,cid} = req.params

  if(!pid || !cid)
  return res.status(400).send("Missing ID parameters") 

  if(ObjectId.isValid(pid) && ObjectId.isValid(cid))
    next()
  else
    return res.status(400).send("The sent IDs do not have the correct format (ObjectID).")
  
}


export { validateProductFields,
  validateStatus,
  parseProductFromBody, 
  validateObjetID,
  validateCartObjetID,
  validateGetProducts,
  validateQuantity,
  validateListProducts }