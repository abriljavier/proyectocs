$(document).ready(function () {

    // SI ESTÁ SETEADO EL BOTÓN DE RECUÉRDAME
    if (sessionStorage.getItem("remembered")) {
        $('#usernameInput').val(sessionStorage.getItem("username"));
        $('#passwordInput').val(sessionStorage.getItem("password"));
    }

    //LA LÓGICA DEL FORMULARIO
    $('input[type="submit"]').on("click", function (event) {
        event.preventDefault();
        let name = $('#usernameInput').val();
        let password = $('#passwordInput').val();
        let loginHelp = $('#loginHelp');
        $.ajax({
            type: "POST",
            url: "php/users.php",
            data: {
                "username": name,
                "password": password,
                action: "login",
            },
            success: function (res) {
                if (res == "Credenciales incorrectas") {
                    $(loginHelp).css({ "color": "red" });
                    $(loginHelp).text("Nombre de usuario o contraseña incorrectos");
                    $('#usernameInput').val('');
                    $('#passwordInput').val('');
                } else if (res === "Error en el login") {
                    $(loginHelp).css({ "color": "red" });
                    $(loginHelp).text("Error al intentar acceder");
                    $('#usernameInput').val('');
                    $('#passwordInput').val('');
                } else {
                    sessionStorage.setItem("userData", res);
                    if ($('input[type="checkbox"]').prop("checked")) {
                        sessionStorage.setItem("remembered", true)
                    }
                    let rol = JSON.parse(sessionStorage.getItem("userData"))['rol'];
                    $.ajax({
                        type: "GET",
                        url: "php/sessions/setSession.php",
                        data: {
                            username: JSON.parse(sessionStorage.getItem("userData"))['username'],
                        },
                        success: function (res) {
                            console.log(res);
                        },
                        error: function (e) {
                            console.log(e);
                        }
                    });
                    switch (rol) {
                        case 0:
                            location.href = './admin.html';
                            break;
                        case 1:
                            location.href = './private.html';
                            break;
                    }
                }
            },
            error: function (err) {
                console.log("Error en la solicitud AJAX");
            }
        });
    });
});