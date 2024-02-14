$(document).ready(function () {
    // MOSTRAR LOS USUARIOS
    $('#usersTable').on("click", function () {
        $('#helper').text("");
        $('.mainContentAdmin_container_top').css({ "display": "flex" });
        $('#userForm').css({ "display": "block" });
        $('#categoryForm').css({ "display": "none" });
        $('#articleForm').css({ "display": "none" });
        $.ajax({
            type: "GET",
            url: "php/users.php",
            data: {
                action: "read",
            },
            success: function (res) {
                if (res === "No hay usuarios") {
                    console.log("No hay usuarios registrados");
                } else {
                    localStorage.setItem("currentData", res);
                    printUsersTable(JSON.parse(res));
                }
            },
            error: function (err) {
                console.log("Error en la solicitud AJAX" + err);
            }
        });
    });
    function printUsersTable(rowData) {
        // VACIAR EL DIV ANTES DE PINTAR
        $('.mainContentAdmin_container_table').empty();

        // MONTAR LA TABLA
        var table = $('<table>').addClass('table');
        var thead = $('<thead>');
        var tbody = $('<tbody>');

        // ENCABEZADOS
        var headers = ['username', 'password', 'email', 'rol'];
        var headerRow = $('<tr>');
        $.each(headers, function (_, header) {
            headerRow.append($('<th>').text(header));
        });
        thead.append(headerRow);

        // CREAR LAS FILAS
        $.each(rowData, function (_, row) {
            var dataRow = $('<tr>');
            $.each(headers, function (_, header) {
                dataRow.append($('<td>').text(row[header]));
            });

            // Agregar celda oculta
            var hiddenCell = $('<td>').attr('id', 'hidden').css('display', 'none').text(row["id_user"]);

            // Agregar celdas de botones a la fila
            var editButtonCell = $('<td>').append($('<button>', {
                text: "Editar",
                class: "editButton",
                id: "ediUserBtn",

            }));
            var deleteButtonCell = $('<td>').append($('<button>', {
                text: "Eliminar",
                class: "deleteButton",
                id: "delUserBtn",

            }));

            // Agregar celdas de botones a la fila
            dataRow.append(hiddenCell).append(editButtonCell).append(deleteButtonCell);

            tbody.append(dataRow);
        });

        // AGREGAR LOS DATOS
        table.append(thead).append(tbody);
        $('.mainContentAdmin_container_table').append(table);
    };
    // FUNCIÓN BORRAR USER
    $(document).on("click", "#delUserBtn", function () {
        var row = $(this).closest('tr');
        let id = $(this).parent().parent().children('#hidden').text();
        $("#dialog-delete").dialog({
            resizable: false,
            height: "auto",
            width: 400,
            modal: true,
            buttons: {
                "Si": function () {
                    $.ajax({
                        type: "GET",
                        url: "php/users.php",
                        data: {
                            action: "delete",
                            id_user: id,
                        },
                        success: function (res) {
                            if (res === "Usuario eliminado correctamente") {
                                $('#helper').text("Usuario eliminado correctamente");
                                row.remove();
                            } else if (res === "No puedes eliminar a un administrador") {
                                $('#helper').text("Error: No puedes eliminar a un administrador");
                            } else {
                                $('#helper').text("Error al eliminar el usuario: " + res);
                            }
                        },
                        error: function (err) {
                            console.log("Error en la solicitud AJAX: " + err);
                        }
                    });
                    $(this).dialog("close");
                },
                "Cancelar": function () {
                    $(this).dialog("close");
                }
            }
        });
    });
    // VALIDACIÓN DE USERNAME
    $('#userUsernameInput').on("input", function () {
        let name = $('#userUsernameInput').val();
        let nameRegex = /^\S{5,15}$/;
        if (name.length > 0) {
            if (nameRegex.test(name)) {
                $('#usernameHelp').text("");
                $('#createuserInput').prop("disabled", false);
            } else {
                if (name.length < 5 || name.length > 15) {
                    $('#createuserInput').prop("disabled", true);
                    $('#usernameHelp').text("El nombre debe tener entre 5 y 15 carácteres.");
                } else {
                    $('#createuserInput').prop("disabled", true);
                    $('#usernameHelp').text("El nombre no puede contener espacios en blanco.");
                }
            }
        }
    });
    // VALIDACIÓN DE EMAIL
    $('#userEmailInput').on("input", function () {
        let email = $('#userEmailInput').val();
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email)) {
            $('#createuserInput').prop("disabled", false);
            $('#emailHelp').text("");
        } else {
            $('#createuserInput').prop("disabled", true);
            $('#emailHelp').text("Ingrese una dirección de correo electrónico válida.");
        }
    });
    // VALIDACIÓN DE PASSWORD
    $('#userPasswordInput').on("input", function () {
        let password = $('#userPasswordInput').val();
        let passwordRegex = /^\S{8,}$/;
        if (passwordRegex.test(password)) {
            $('#createuserInput').prop("disabled", false);
            $('#passwordHelp').text("");
        } else {
            $('#createuserInput').prop("disabled", true);
            $('#passwordHelp').text("La contraseña debe tener al menos 8 carácteres y no puede contener espacios en blanco.");
        }
    });
    //LA VALIDACIÓN AL CLICK
    $(document).on("click", "#createuserInput", function (event) {
        event.preventDefault();
        let name = $('#userUsernameInput').val();
        console.log(name.length);
        let nameRegex = /^\S{5,15}$/;
        if (name.length > 0) {
            if (nameRegex.test(name)) {
                $('#usernameHelp').text("");
            } else {
                if (name.length < 5 || name.length > 15) {
                    $('#usernameHelp').text("El nombre debe tener entre 5 y 15 carácteres.");
                    return;
                } else {
                    $('#usernameHelp').text("El nombre no puede contener espacios en blanco.");
                    return;
                }
            }
        } else {
            $('#usernameHelp').text("El nombre debe tener entre 5 y 15 carácteres.");
            return;
        }
        if ($('#hiddenIdUserInput').val() == "") {
            let password = $('#userPasswordInput').val();
            let passwordRegex = /^\S{8,}$/;
            if (passwordRegex.test(password)) {
                $('#passwordHelp').text("");
            } else {
                $('#passwordHelp').text("La contraseña debe tener al menos 8 carácteres y no puede contener espacios en blanco.");
                return;
            }
        } else {
            let password = $('#userPasswordInput').val();
        }
        let email = $('#userEmailInput').val();
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email)) {
            $('#emailHelp').text("");
        } else {
            $('#emailHelp').text("Ingrese una dirección de correo electrónico válida.");
            return;
        }
        let username = $('#userUsernameInput').val();
        let passwordToSubmit = $('#userPasswordInput').val();
        let emailToSubmit = $('#userEmailInput').val();
        let rol = $('#userRolInput').is(':checked') ? 0 : 1;
        let id_user = $('#hiddenIdUserInput').val() ? $('#hiddenIdUserInput').val() : '';
        $.ajax({
            type: "POST",
            url: "php/users.php",
            data: {
                action: "create",
                id_user: id_user,
                username: username,
                password: passwordToSubmit,
                rol: rol,
                email: emailToSubmit,
            },
            success: function (response) {
                cleanForm();
                if (response == true) {
                    $('#helper').text("Usuario creado correctamente");
                    $.ajax({
                        type: "GET",
                        url: "php/users.php",
                        data: {
                            action: "read",
                        },
                        success: function (res) {
                            if (res === "No se ha podido modificar el usuario.") {
                                $('#helper').text(res);
                            } else {
                                localStorage.setItem("currentData", res);
                                printUsersTable(JSON.parse(res));
                            }
                        },
                        error: function (err) {
                            console.log("Error en la solicitud AJAX" + err);
                        }
                    });
                } else {
                    $('#helper').text(response);
                }
            },
            error: function (e) {
                console.log("Error en la solicitud AJAX:", e.statusText);
                $('#loginHelp').text("Hubo un problema en la creación de su usuario")
            }
        });
    })
    // FUNCIÓN PARA CARGAR LOS DATOS DE UN USER PARA EDITAR
    $(document).on("click", "#ediUserBtn", function () {
        // VACIAR EL FORM
        cleanForm();

        // EXTRAER LOS DATOS
        let currentUser;
        for (const data of JSON.parse(localStorage.getItem("currentData"))) {
            if ($(this).parent().parent().children('#hidden').text() == data.id_user) {
                currentUser = data;
                break;
            }
        }
        $('#hiddenIdUserInput').val(currentUser.id_user);
        $('#userUsernameInput').val(currentUser.username);
        // $('#userPasswordInput').val(currentUser.password);
        $('#userEmailInput').val(currentUser.email);
        if (currentUser.rol == 0) {
            $('#userRolInput').prop("checked", true);
        } else {
            $('#userRolInput').prop("checked", false);
        }

    });
    // FUNCIÓN PARA LIMPIAR LA TABLA
    $(document).on("click", "#deleteTableInputUsers", function (event) {
        event.preventDefault()
        $('#userUsernameInput').val("");
        $('#userPasswordInput').val("");
        $('#userEmailInput').val("");
        $('#userRolInput').val("");
        $('#hiddenIdUserInput').val("");
    });
    // FUNCIÓN PARA RESETEAR LOS MENSAJES DE AYUDA
    function cleanForm() {
        $('#userUsernameInput').val("");
        $('#userPasswordInput').val("");
        $('#userEmailInput').val("");
        $('#userRolInput').val("");
        $('#hiddenIdUserInput').val("");

        // Limpiar mensajes de ayuda
        $('#usernameHelp').text("");
        $('#emailHelp').text("");
        $('#passwordHelp').text("");
    }

});