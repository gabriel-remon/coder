const socket = io();
const tbody = document.querySelector('table tbody')

const addProduc= product=>{
  const tr = document.createElement('tr')
  tr.setAttribute("idProduct", product._id);
  
  for (let [key, element] of Object.entries(product)) {
    if(key === 'title' || key === 'description'|| key === 'price'|| key === 'stock'|| key === 'code')
    {
      const td = document.createElement('td')
      td.textContent = element;
      tr.appendChild(td);
    }
  }
  return tr
}

//emit en linea 89 archivo  src/routers/ruterProduct.js
socket.on('producto-actualizado',async data=>{
  for(let i=0; i<tbody.rows.length;i++)
  {
   if(tbody.rows[i].getAttribute('idProduct') == data._id)
    {
      tbody.replaceChild(addProduc(data.product), tbody.rows[i]);
      await Swal.fire({
        title: 'Producto actualizado',
        text: `producto: ${data.product.title}`
      })
      break;
    }
  }
})

//emit en linea 69 archivo  src/routers/ruterProduct.js
socket.on('nuevo-producto',async data=>{
tbody.appendChild(addProduc(data.product))

await Swal.fire({
  title: 'Nuevo producto',
  text: `producto:${data.product.title}, precio: $${data.product.price}`,
  icon: 'success'
})
  
})

//emit en linea 109 archivo  src/routers/ruterProduct.js
socket.on('producto-eliminado',async data=>{
  for(let i=0; i<tbody.rows.length;i++)
  {
    if(tbody.rows[i].getAttribute('idProduct') == data._id)
    {
      tbody.removeChild(tbody.rows[i])

      await Swal.fire({
        title: 'Producto eliminado',
        text: `producto: ${data.title}`
      })
      break;
    }
  }
})

//emit en linea 15 archivo  src/routers/view.listProducts.js
socket.on('load-list',data=>{
  while (tbody.firstChild) { 
    tbody.removeChild(tbody.firstChild); 
  }
  data.products.forEach(product => {
    tbody.appendChild(addProduc(product));
  });

})
