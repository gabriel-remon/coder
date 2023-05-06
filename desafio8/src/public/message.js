const socket = io();
const ul= document.querySelector('ul')
const button = document.querySelector('button')
const input = document.querySelector('input')

const addMessage= message=>{
    const li = document.createElement('li')
    li.setAttribute("idMessage", message._id);
    li.classList.add('message')
    const divMessage = document.createElement('div')
    divMessage.classList.add('message-text')
    divMessage.textContent= `${message.user}: ${message.message}`
    const divDate = document.createElement('div')
    divDate.classList.add('message-date')

    const date = new Date(message.date);
  const formattedDate = date.toLocaleString('es-ES', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: false
});

    divDate.textContent= `${formattedDate}`
    li.appendChild(divMessage)
    li.appendChild(divDate)
    
    return li
  }

  socket.on('list-message',(data)=>{
    data.forEach(element => {
        ul.appendChild(addMessage(element))
    });
  })

  socket.on('login',(_)=>{
    Swal.fire({
        title: 'Ingresa tu nombre',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: false,
        confirmButtonText: 'Guardar',
        allowOutsideClick: false, // Evita que se cierre al hacer clic fuera del SweetAlert2
        allowEscapeKey: false // Evita que se cierre al presionar la tecla ESC
      }).then((result) => {
        if (result.isConfirmed) {
          // Si se hace clic en el botón Guardar, se actualiza el valor del input del nombre
          socket.emit('user-loger',result.value)
        } else {
          // Si se hace clic en el botón Cancelar o se cierra SweetAlert2, se muestra un mensaje de error
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Debes ingresar tu nombre para continuar'
          });
        }
      });
  })

  button.addEventListener('click',e=>{
    socket.emit('message-send',input.value)
  })

  socket.on('new-message',async data=>{
    await ul.appendChild(addMessage(data))
  })

  socket.on('message-error',(_)=>{
    Swal.fire({
        icon: 'error',
        title: 'Error en la carga del mensaje',
        text: 'no fue posible cargar su mensage en la base de datos, for favor intente otra ves'
      })
      
  })