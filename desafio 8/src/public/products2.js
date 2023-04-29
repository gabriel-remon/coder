let url = window.location.href;
const selectCategory = document.getElementById('category')
const selectPrice = document.getElementById('price-sort')
const tbody = document.querySelector('table tbody')

selectCategory.addEventListener('change', e => {
    let newPageValue = encodeURIComponent(e.target.value);

    if (url.includes("query=")) {
        url = url.replace(/(query=)[^\&]+/, `$1${newPageValue}`);
    } else {
        url.includes("?") ? url += "&" : url += "?"
        url += `query=${newPageValue}`;
    }
    window.location.href = url
})


selectPrice.addEventListener('change', e => {
    let newPageValue = e.target.value;
    if (url.includes("sort=")) {
        url = url.replace(/(sort=)[^\&]+/, `$1${newPageValue}`);
    } else {
        url.includes("?") ? url += "&" : url += "?"
        url += `sort=${newPageValue}`;
    }
    window.location.href = url
})

tbody.addEventListener('click', e => {
    const idProduct = e.target.getAttribute('idproduct')
    if (idProduct) {
        Swal.fire({
            title: 'Ingresa un id de carrito. id carritos creados = (64405caade687032ad849594 , 64405cbab239aeb9c00d9e5c , 64405cc51508a397f7c4f36d)',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: false,
            confirmButtonText: 'Comprar',
            allowOutsideClick: false, // Evita que se cierre al hacer clic fuera del SweetAlert2
            allowEscapeKey: false // Evita que se cierre al presionar la tecla ESC
        }).then(idCart=>{

            fetch(`${window.location.origin}/cart/${idCart.value}/products/${idProduct}`,{method:"POST"})
            .then(res => {
                res.status === 200
                Swal.fire({
                    icon: 'success',
                    title: 'Producto comprado',
                    text: `producto agregado al carrito id= ${idCart.value}`
                  });
            })
        }).catch (err=> {
            console.log(err)
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Id invalido'
              });
        })
    }
})
