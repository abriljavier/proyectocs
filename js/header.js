$(document).ready(function () {

    //EXTRAER EN QUE PÁGINA ESTOY
    var url = window.location.href;
    var fileNameWithExtension = url.substring(url.lastIndexOf('/') + 1);
    var fileNameWithoutExtension = fileNameWithExtension.substring(0, fileNameWithExtension.lastIndexOf('.'));
    switch (fileNameWithoutExtension) {
        case "login":
            $('button#private').text("Página privada");
            $('button#private').on("click", function () {
                location.href = "login.html";
            })
            break;
        case "private":
            $('button#private').text("Cerrar sesión");
            break;
        default:
            $('button#private').text("Página privada");
            $('button#private').on("click", function () {
                location.href = "login.html";
            })
            break;
    }


    $('button#cart').on("click", function () {
        location.href = "cart.html";
    })
});