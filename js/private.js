$(document).ready(function () {
    if (!sessionStorage.getItem("userData")) {
        location.href = "login.html"
    }
    //MENSAJE DE BIENVENIDA
    $('h5').text("Bienvenido  " + JSON.parse(sessionStorage.getItem("userData"))['username']);

    //RELLENAR EL FORMULARIO CON SUS DATOS
    $('input[id="username"]').val(JSON.parse(sessionStorage.getItem("userData"))['username']);
    $('input[id="password"]').val(JSON.parse(sessionStorage.getItem("userData"))['password']);
    $('input[id="email"]').val(JSON.parse(sessionStorage.getItem("userData"))['email']);
    $('#avatarImg').attr({ "src": "./assets/" + JSON.parse(sessionStorage.getItem("userData"))['avatar'] })

    //MODIFICAR SUS DATOS
    $('#updateUserDataBtn').on("click", function (event) {
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: "php/users.php",
            data: {
                id: sessionStorage.getItem("id"),
                username: $('input[id="username"]').val(),
                password: $('input[id="password"]').val(),
                email: $('input[id="email"]').val(),
                action: "update",
            },
            success: function (res) {
                sessionStorage.setItem("username", $('input[id="username"]').val());
                sessionStorage.setItem("email", $('input[id="email"]').val());
                sessionStorage.setItem("password", $('input[id="password"]').val());
            },
            error: function (err) {
                console.log("Error en la solicitud AJAX" + err);
            }
        });
    });
});