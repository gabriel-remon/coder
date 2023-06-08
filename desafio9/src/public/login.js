const form = document.getElementById('login-form')
const password = document.getElementById('password')
const email = document.getElementById('email')

document.getElementById("register-button").addEventListener("click", function () {
    window.location.href = '/session/register'; // Reemplaza con tu URL
});

form.addEventListener('submit', (e) => {
    e.preventDefault()

    fetch(`/session/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email:email.value,password:password.value})
    })
        .then(data => {
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
                        window.location.href = '/products'
                    }
                    
                })
        })
        .catch(err => console.log(err))
})
