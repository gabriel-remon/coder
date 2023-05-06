const baseUrl = window.location.origin;
const selectCategory = document.getElementById('category')
const selectPrice = document.getElementById('price-sort')

const formNextPage = document.getElementById('next-pag')
const formFilter = document.getElementById("form-filter")

const params = {}

const body = document.querySelector('body');
const tbody = document.querySelector('table tbody')


formNextPage.addEventListener('submit',(e)=>{
    e.preventDefault()

    const url = new URLSearchParams(e.submitter.getAttribute('url'))
    params.limit= url.get(`${baseUrl}/api/products?limit`)
    params.page= url.get('page')
    if(selectCategory.value===""){
        if(url.has('query'))
        params.query= url.get('query');
    }
    else
    params.query= selectCategory.value
    
    if(selectPrice.value===0)
    params.sort= url.get('sort')
    else
    params.sort= selectPrice.value
    /*
    console.log( selectCategory.value ==="")
    console.log(new URLSearchParams(params).toString())
    
    
    console.log(`${baseUrl}/api/products?${new URLSearchParams(params).toString()}`)
    */
    console.log(`${baseUrl}/products?${new URLSearchParams(params).toString()}`)
        fetch(`${baseUrl}/products?${new URLSearchParams(params).toString()}`)
        .then(data=>{
            data.json()
            .then(n=>{actualizarPagina(n);actualizarIndex(n),console.log(n)})
        })
        .catch(err=> console.log(err))
})

formFilter.addEventListener('submit',e=>{
    e.preventDefault()
    const url = new URLSearchParams(window.location)
    params.page=1;
    if(selectCategory.value===""){
        if(url.has('query'))
         params.query= url.get('query');
    }
    else
        params.query= selectCategory.value
        
    if(selectPrice.value===0)
        params.sort= url.get('sort')
    else
        params.sort= selectPrice.value
})

selectCategory.addEventListener('change',e=>{formFilter.submit()})
selectPrice.addEventListener('change',e=>{formFilter.submit()})

const addProduc= product=>{
    const tr = document.createElement('tr')
    const button = document.createElement('button')
    button.setAttribute("idProduct", product._id);
    button.classList.add("button")
    button.textContent="comprar"
    for (let [key, element] of Object.entries(product)) {
      if(key === 'title' || key === 'description'|| key === 'price'|| key === 'stock'|| key === 'code')
      {
        const td = document.createElement('td')
        td.textContent = element;
        tr.appendChild(td);
      }
    }
    tr.appendChild(button)
    return tr
  }
  
function actualizarPagina(json){

    while (tbody.firstChild) { 
        tbody.removeChild(tbody.firstChild); 
      }

    json.payload.forEach(element => {
        tbody.appendChild(addProduc(element))
    });
}

function actualizarIndex(json){
    while (formNextPage.firstChild) { 
        formNextPage.removeChild(formNextPage.firstChild); 
      }
    if(json.hasPrevPage){
        const btnPrev= document.createElement('button')
        btnPrev.textContent = "Pagina anterior"
        btnPrev.setAttribute('id',"btnAnterior")
        btnPrev.setAttribute('url',json.prevLink)
        btnPrev.classList.add("button")
        formNextPage.appendChild(btnPrev)
    }

    const index = document.createElement('span')
    index.classList.add("text")
    index.textContent=`Pagina ${json.page} de ${json.totalPages}`
    formNextPage.appendChild(index)

    if(json.hasNextPage){
        const btnNext= document.createElement('button')
        btnNext.textContent = "Pagina anterior"
        btnNext.setAttribute('id',"btnProxima")
        btnNext.setAttribute('url',json.nextLink)
        btnNext.classList.add("button")
        formNextPage.appendChild(btnNext)
    }
}

function getParams(){
    const url = new URLSearchParams(e.submitter.getAttribute('url'))
    params.limit= url.get(`${baseUrl}/api/products?limit`)
    params.page= url.get('page')
    if(selectCategory.value!=="")
        params.query= url.has('query')? url.get('query'): null;
    else
        params.query= selectCategory.value
        
    if(selectPrice.value!==0)
        params.sort= url.get('sort')
    else
        params.sort= selectPrice.value
}