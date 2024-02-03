$(document).ready(function () {

    // LAS BANDERA BOOLEANAS
    let acceptedUser = false;
    let acceptedEmail = false;
    let acceptedPass = false;
    let secondPass = false;
    $('#submitBtn').prop("disabled", true);

    // VALIDACIÓN DE USERNAME
    $('#usernameInput').on("input", function () {
        let name = $('#usernameInput').val();
        let nameRegex = /^\S{5,15}$/;
        if (name.length > 0) {
            if (nameRegex.test(name)) {
                $('#usernameHelp').text("");
                acceptedUser = true;
            } else {
                if (name.length < 5 || name.length > 15) {
                    acceptedUser = false;
                    $('#usernameHelp').text("El nombre debe tener entre 5 y 15 carácteres.");
                } else {
                    acceptedUser = false;
                    $('#usernameHelp').text("El nombre no puede contener espacios en blanco.");
                }
            }
        }
        enableSubmitButton();
    });

    // VALIDACIÓN DE EMAIL
    $('#emailInput').on("input", function () {
        let email = $('#emailInput').val();
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email)) {
            acceptedEmail = true
            $('#emailHelp').text("");
        } else {
            acceptedEmail = false;
            $('#emailHelp').text("Ingrese una dirección de correo electrónico válida.");
        }
        enableSubmitButton();
    });

    // VALIDACIÓN DE PASSWORD 1
    $('#passwordInput').on("input", function () {
        let password = $('#passwordInput').val();
        let passwordRegex = /^\S{8,}$/;
        if (passwordRegex.test(password)) {
            acceptedPass = true;
            $('#passwordHelp').text("");
        } else {
            acceptedPass = false;
            $('#passwordHelp').text("La contraseña debe tener al menos 8 carácteres y no puede contener espacios en blanco.");
        }
        enableSubmitButton();
    });

    // VALIDACIÓN DE PASSWORD 2
    $('#passwordSecondInput').on("input", function () {
        let password = $('#passwordInput').val();
        let secondPassword = $('#passwordSecondInput').val();
        if (password !== secondPassword) {
            secondPass = false;
            $('#secondPasswordHelp').text("Las contraseñas no coinciden");
        } else {
            secondPass = true;
            $('#secondPasswordHelp').text("");
        }
        enableSubmitButton();
    });

    // FUNCIÓN PARA DESABILITAR EL BOTÓN DE ENVIO
    function enableSubmitButton() {
        if (acceptedUser && acceptedEmail && acceptedPass && secondPass) {
            $('#submitBtn').prop("disabled", false);
        } else {
            $('#submitBtn').prop("disabled", true);
        }
    }

    // LLAMADA PARA CREAR EL USUARIO
    $('#submitBtn').on('click', function (event) {
        event.preventDefault();
        let username = $('#usernameInput').val();
        let password = $('#passwordInput').val();
        let email = $('#emailInput').val();
        let action = 'create';

        $.ajax({
            type: "POST",
            url: "php/users.php",
            data: {
                action: action,
                username: username,
                password: password,
                email: email,
            },
            success: function (response) {
                cleanForm();
                if (response == true) {
                    $('#loginHelp').text("Usuario creado correctamente, se le redirigirá al inicio de sesión.");
                    setTimeout(function () {
                        location.href = "login.html";
                    }, 2000);
                } else {
                    $('#loginHelp').text(response);
                }
            },
            error: function (e) {
                console.log("Error en la solicitud AJAX:", e.statusText);
                $('#loginHelp').text("Hubo un problema en la creación de su usuario")
            }
        });
    });

    // VACIAR EL FORMULARIO
    function cleanForm() {
        $('#usernameInput').val("");
        $('#passwordInput').val("");
        $('#emailInput').val("");
        $('#passwordSecondInput').val("");
    }
});
