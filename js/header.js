$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "php/sessions/checkSession.php",
        success: function (res) {
            if (res == "Sesión ok") {
                $('button#private').text("Cerrar sesión");
                $('button#private').on("click", function () {
                    $.ajax({
                        type: "GET",
                        url: "php/sessions/destroySession.php",
                        success: function (res) {
                            if (res == "sesión destruida") {
                                location.href = "./index.html";
                            }
                        },
                        error: function (e) {
                            console.log(e);
                        }
                    });
                });
            } else {
                $('button#private').text("Página privada");
                $('button#private').on("click", function () {
                    location.href = "login.html";
                })
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
    // setTimeout(function () {
    //     //EXTRAER EN QUE PÁGINA ESTOY
    //     var url = window.location.href;
    //     var fileNameWithExtension = url.substring(url.lastIndexOf('/') + 1);
    //     var fileNameWithoutExtension = fileNameWithExtension.substring(0, fileNameWithExtension.lastIndexOf('.'));
    //     switch (fileNameWithoutExtension) {
    //         case "login":
    //             $('button#private').text("Página privada");
    //             $('button#private').on("click", function () {
    //                 location.href = "login.html";
    //             })
    //             break;
    //         case "private":
    //             $('button#private').text("Cerrar sesión");
    //             $('button#private').on("click", function () {
    //                 $.ajax({
    //                     type: "GET",
    //                     url: "php/sessions/destroySession.php",
    //                     success: function (res) {
    //                         console.log(res);
    //                     },
    //                     error: function (e) {
    //                         console.log(e);
    //                     }
    //                 });
    //             });
    //             break;
    //         default:
    //             $('button#private').text("Página privada");
    //             $('button#private').on("click", function () {
    //                 location.href = "login.html";
    //             })
    //             break;
    //     }

    //     $('button#cart').on("click", function () {
    //         location.href = "cart.html";
    //     })
    // }, 500);

});