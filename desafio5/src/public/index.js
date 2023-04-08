console.log("hola")
const socket = io();
const form = document.getElementById("form-product")
const button = document.getElementById("button-submit")
const table = document.querySelector('table')


socket.on('producto-actualizado',async data=>{
  await Swal.fire({
    title: `Producto id ${data.id} actualizado` ,
    icon: 'success',
    time: 1500
  })
  location.reload();
  })

socket.on('nuevo-producto',async data=>{
await Swal.fire({
  title: 'Nuevo producto',
  text: `producto:${data .title}, precio: $${data.price}`,
  icon: 'success',
  time: 1500
})
location.reload();
})

socket.on('producto-eliminado',async data=>{
  await Swal.fire({
    title: 'Producto eliminado',
    text: `producto: ${data.title}`,
    time: 1500
  })
  location.reload();
  })

table.addEventListener('click',e=>{
  const title = form.elements.title.value;
  const description = form.elements.description.value;
  const price = form.elements.price.value;
  const code = form.elements.code.value;
  const stock = form.elements.stock.value;
  const category = form.elements.category.value;

  if(e.target.hasAttribute('idProduct') &&e.target.classList.contains("btn-modificar"))
  {
    fetch(`/products/${e.target.getAttribute('idProduct')}`, {
      method: 'PUT',
      body: JSON.stringify({title, description, price, stock, code,category}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((res) => {
      if(res.status===500)
      Swal.fire({
        title: 'No fue posible actualizar el producto',
        icon: 'error',
        time: 1500
      })
    })
    .catch((err)=>{
      console.error(err);
    })
  }
  if(e.target.hasAttribute('idProduct') &&e.target.classList.contains("btn-eliminar"))
  {

  fetch(`/products/${e.target.getAttribute('idProduct')}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then((res) => {
    if(res.status===500)
    Swal.fire({
      title: 'No fue posible eliminar el producto',
      icon: 'error',
      time: 1500
    })
  })
  .catch((err)=>{
    console.error(err);
  })
  }
  
})

button.addEventListener('click', (e) => {
 
  const title = form.elements.title.value;
  const description = form.elements.description.value;
  const price = form.elements.price.value;
  const code = form.elements.code.value;
  const stock = form.elements.stock.value;
  const category = form.elements.category.value;

  fetch('/products', {
    method: 'POST',
    body: JSON.stringify({title, description, price, stock, code,category}),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then((res) => {
    if(res.status===500)
    Swal.fire({
      title: 'No fue posible cargar el producto',
      icon: 'error',
      time: 1500
    })
  })
  .catch((err)=>{
    console.error(err);
  })
  
});
