// $(document).ready(function () {

//     var haySesion = null
//     // COMPRUEBO QUE EXISTE SESIÓN PARA PODER HACER LA COMPRA
//     setTimeout(function () {
//         haySesion = localStorage.getItem("haySesion");
//         console.log(`Entro en el setimeout, el valor de la sesión es ${haySesion}`);
//         localStorage.removeItem("haySesion");
//         if (haySesion) {
//             $(document).on("click", "#add-to-cart-button", function () {
//                 "Se ha añadido el producto al carrito"
//             })
//         } else {
//             console.log("Paro el script de cart");
//             stop()
//         }
//     }, 500);

// });