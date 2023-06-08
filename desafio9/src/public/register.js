const form = document.getElementById('form-register')
const password = document.getElementById('password')
const email = document.getElementById('email')
const nombre = document.getElementById('nombre')
const apellido = document.getElementById('apellido')
const fechaNacimiento = document.getElementById('nacimiento')

form.addEventListener('submit', (e) => {
    e.preventDefault()

    fetch(`/session/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre:nombre.value,
            apellido:apellido.value,
            email:email.value,
            password:password.value,
            fechaNacimiento:fechaNacimiento.value})
    })
        .then(data => {
            console.log(data)
            data.json()
                .then(data=>{

                    if(data.code<0){
                        Swal.fire({
                            title: 'error',
                            text: data.message,
                            icon: 'error',
                            confirmButtonText: 'Aceptar'
                          });
                    }else{
                        window.location.href = '/session/login'
                    }
                    
                })
        })
        .catch(err => console.log(err))
})
