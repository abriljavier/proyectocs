$(document).ready(function () {
    //PINTAR EL CARRITO DEL USER
    let userId = JSON.parse(sessionStorage.getItem("userData"))['id_user'];
    $.ajax({
        type: "POST",
        url: "php/shopping.php",
        data: {
            userId: userId,
            action: "read",
        },
        success: function (res) {
            let shoppingList = JSON.parse(res);
            let table = $('<table></table>').addClass('table table-striped table-hover');
            $('.mainContent_container_table').empty().append(table);

            let header = '<thead><tr><th>Artículos</th><th>Fecha de Compra</th></tr></thead>';
            table.append(header);

            let tbody = $('<tbody></tbody>');
            table.append(tbody);

            shoppingList.forEach(item => {
                let row = $('<tr></tr>');
                let compra = JSON.parse(item.compra);
                let articleNames = compra.map(article => article.name).join(", ");
                row.append($('<td></td>').text(articleNames));
                row.append($('<td></td>').text(item.time));
                tbody.append(row);
            });
        },
        error: function (res) {
            console.log(res);
        }
    })

    //MENSAJE DE BIENVENIDA
    $('h5').text("Bienvenido  " + JSON.parse(sessionStorage.getItem("userData"))['username']);

    //RELLENAR EL FORMULARIO CON SUS DATOS
    $('input[id="username"]').val(JSON.parse(sessionStorage.getItem("userData"))['username']);
    $('input[id="email"]').val(JSON.parse(sessionStorage.getItem("userData"))['email']);
    $('#avatarImg').attr({ "src": "./assets/" + JSON.parse(sessionStorage.getItem("userData"))['avatar'] })

    //MODIFICAR SUS DATOS
    $('#updateUserDataBtn').on("click", function (event) {
        event.preventDefault();
        if ($('input[id="password"]').val() != "") {
            let password = $('input[id="password"]').val();
            let passwordRegex = /^\S{8,}$/;
            if (passwordRegex.test(password)) {
                $('#chagePasswordHelper').text("");
                $('#chagePasswordHelper').css("display", "none");
                $("#dialog-confirm_chagePass").dialog({
                    resizable: false,
                    height: "auto",
                    width: 400,
                    modal: true,
                    buttons: {
                        "Ok": function () {
                            $.ajax({
                                type: "POST",
                                url: "php/users.php",
                                data: {
                                    id: id,
                                    password: password,
                                    action: "update",
                                },
                                success: function (res) {
                                    $('#chagePasswordHelper').css("display", "block");
                                    $('input[id="password"]').val("");
                                    $('#chagePasswordHelper').text("Contraseña modificada con éxito");
                                },
                                error: function (err) {
                                    console.log("Error en la solicitud AJAX" + err);
                                }
                            });
                            $(this).dialog("close");
                        },
                        "Cancelar": function () {
                            $(this).dialog("close");
                        }
                    }
                });
            } else {
                console.log("entro en el else");
                $('#chagePasswordHelper').css("display", "block");
                $('#chagePasswordHelper').text("La contraseña debe tener al menos 8 carácteres y no puede contener espacios en blanco.");
            }
            let id = JSON.parse(sessionStorage.getItem("userData"))["id_user"];

        } else {
            $('#chagePasswordHelper').css("display", "block");
        }

    });
});