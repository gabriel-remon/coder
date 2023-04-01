console.log("hola")
const socket = io()

const form = document.querySelector('#product-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
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
  }).then(() => {
    socket.emit('new-product');
  });
});
