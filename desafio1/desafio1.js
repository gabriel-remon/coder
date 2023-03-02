class ProductManager{
     #productos;
     constructor(array)
     {
         this.#productos= new Array();
        if(typeof array !=="undefined"){
            if(this.#validarFormato(array)) this.#productos= array;
        }
     }
     addProduct = (title,description,price,thumbnail,code,stock) => {
        let id=1;
        if(this.#productos.length>0) id=this.#productos[this.#productos.length - 1].id+1;
        if(this.#validarCampos(title,description,price,thumbnail,code))
        {
            if(typeof stock==="undefined") stock=0
            let product= {id:id, title:title,description:description,price:price,thumbnail:thumbnail,code:code,stock:stock };
            this.#productos.push(product);
            console.log(`Producto ${id} agregado con exito`)
        }
        
     }
     #validarCodigo = (code) =>{
        let retorno = false;
        this.#productos.forEach(element => {
            if(element.code===code) retorno=true;
        });
        return retorno;
     }
     #validarCampos =(title,description,price,thumbnail,code) =>{
        let retorno = false; 
        if(typeof title=== "undefined" ||typeof description=== "undefined" ||typeof price=== "undefined" ||typeof thumbnail=== "undefined" || typeof code === "undefined") console.log("Fantan datos para agregar este producto")
        else if (this.#validarCodigo(code))console.log( `No se pudo agregar el producto, el codigo ${code} ya esta en uso`);
        else return true;
        return false;
    }

    #validarFormato = (array) =>{
        array.forEach((element)=>{
            let keys = Object.keys(element)
            if(!('id' in keys &&'title' in keys &&'description' in keys &&'price' in keys &&'thumbnail' in keys &&'code' in keys && 'stock' in keys))
            return false
        })
        return true
    }

     getProducts = (_)=> this.#productos;
     getProductById = (id) =>{
        let retorno= "Not found";
        this.#productos.forEach((element)=>{if(element.id==id) {retorno=element;return }})
        return retorno;
     }
}

export default ProductManager;

//-------------------------test------------------------------------

// let array = [{"id":1,"title":"Yogurt - Raspberry, 175 Gr","description":"Truffle Cups Green","price":99,"thumbnail":"Room 986","code":1,"stock":64},
// {"id":2,"title":"Liqueur Banana, Ramazzotti","description":"Cheese - Cottage Cheese","price":12,"thumbnail":"PO Box 98393","code":2,"stock":87},
// {"id":3,"title":"Butter - Unsalted","description":"Doilies - 12, Paper","price":43,"thumbnail":"Apt 630","code":3,"stock":81},
// {"id":4,"title":"Sole - Fillet","description":"Potatoes - Fingerling 4 Oz","price":61,"thumbnail":"PO Box 7642","code":4,"stock":22},
// {"id":5,"title":"Jolt Cola - Electric Blue","description":"Cheese - Colby","price":48,"thumbnail":"Suite 93","code":5,"stock":25},
// {"id":6,"title":"Blue Curacao - Marie Brizard","description":"Muffin Batt - Blueberry Passion","price":70,"thumbnail":"17th Floor","code":6,"stock":60},
// {"id":7,"title":"Trueblue - Blueberry 12x473ml","description":"Tequila - Sauza Silver","price":21,"thumbnail":"Room 998","code":7,"stock":58},
// {"id":8,"title":"Wine - Hardys Bankside Shiraz","description":"Ginger - Pickled","price":31,"thumbnail":"Room 1194","code":8,"stock":56},
// {"id":9,"title":"Orange - Canned, Mandarin","description":"Pectin","price":55,"thumbnail":"2nd Floor","code":9,"stock":30},
// {"id":10,"title":"Pizza Pizza Dough","description":"Chickhen - Chicken Phyllo","price":72,"thumbnail":"Suite 10","code":10,"stock":18},
// {"id":11,"title":"Alize Red Passion","description":"Cheese - Marble","price":4,"thumbnail":"Room 1188","code":11,"stock":72},
// {"id":12,"title":"Chicken - Whole","description":"Beets - Golden","price":52,"thumbnail":"19th Floor","code":12,"stock":54},
// {"id":13,"title":"Ecolab Digiclean Mild Fm","description":"Rosemary - Fresh","price":48,"thumbnail":"Room 1825","code":13,"stock":32},
// {"id":14,"title":"Lobster - Cooked","description":"Sausage - Andouille","price":65,"thumbnail":"Room 1346","code":14,"stock":10},
// {"id":15,"title":"Lotus Leaves","description":"Puree - Pear","price":37,"thumbnail":"Suite 18","code":15,"stock":60},
// {"id":16,"title":"Kippers - Smoked","description":"Oil - Truffle, White","price":39,"thumbnail":"Room 1895","code":16,"stock":28},
// {"id":17,"title":"Flour - Strong","description":"Rabbit - Saddles","price":97,"thumbnail":"PO Box 78243","code":17,"stock":10},
// {"id":18,"title":"Bay Leaf","description":"Eel Fresh","price":48,"thumbnail":"Room 1256","code":18,"stock":37},
// {"id":19,"title":"Cod - Black Whole Fillet","description":"Chocolate - Chips Compound","price":86,"thumbnail":"Apt 1684","code":19,"stock":95},
// {"id":20,"title":"Coffee - Beans, Whole","description":"Flavouring - Rum","price":38,"thumbnail":"Room 1760","code":20,"stock":7}]


// const lista = new ProductManager(array);
// console.log(lista.getProducts());
// lista.addProduct("producto prueba","Este es un producto prueba",200,"Sin imagen","abc123",25)
// console.log(lista.getProducts());
// lista.addProduct("producto prueba","Este es un producto prueba",200,"Sin imagen","abc123",25)

// console.log(lista.getProductById(40))