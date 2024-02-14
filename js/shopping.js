$(document).ready(function () {

    let cart = Object.values(JSON.parse(localStorage.getItem("cart")));
    let userId = JSON.parse(sessionStorage.getItem("userData"))['id_user'];
    let responses = [];
    if (!cart.length == 0) {
        cart.forEach(function (item) {
            let id_article = item.id_article;
            let stockBuyed = item.cantidad;
            $.ajax({
                url: './php/articles.php',
                type: 'POST',
                data: {
                    "id_article": id_article,
                    "stockBuyed": stockBuyed,
                    "action": 'updateStock'
                },
                success: function (res) {
                    console.log(res);
                    if (res == '1') {
                        responses.push(true);
                    } else {
                        responses.push(false);
                    }
                    if (responses.length === cart.length) {
                        if (responses.every(val => val == true)) {
                            console.log("Todas las actualizaciones de stock fueron exitosas");
                            let compra = JSON.stringify(cart);
                            $.ajax({
                                url: './php/shopping.php',
                                type: 'POST',
                                data: {
                                    "userid": userId,
                                    "compra": compra,
                                    "action": "create",
                                },
                                success: function (res) {
                                    console.log(res);
                                    $('#textInfo').text("Compra realizada con éxito, se te redirigirá en un momento");
                                    localStorage.setItem("cart", "");
                                    setTimeout(function () {
                                        location.href = './index.html';
                                    }, 5000);
                                },
                                error: function (err) {
                                    console.log("Error al registrar la compra", err);
                                }
                            });
                        } else {
                            console.log("Al menos un artículo no queda stock, revisa tu carrito");
                            $('#textInfo').text("Al menos un artículo se ha quedado sin stock, revisa tu carrito");
                            localStorage.setItem("cart", "");
                            setTimeout(function () {
                                location.href = './index.html';
                            }, 5000);
                        }
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            });
        });
    } else {
        $('#textInfo').text("Aquí se mostrarán los productos cuando vayas a comprar");
    }
});