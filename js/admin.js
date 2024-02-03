$(document).ready(function () {
    if (!sessionStorage.getItem("userData")) {
        location.href = "login.html"
    }
    // EL USUARIO ES UN ADMIN
    $('.mainContentAdmin_container_top').css({ "display": "none" });

    //CREAR EL CONTENEDOR DEL SELECT-OPTION DEL FORMULARIO
    var articleSelectMap = new Map();

    // MOSTRAR ARTÍCULOS
    $('#gameTable').on("click", function () {
        $('#helper').text("");
        $('.mainContentAdmin_container_top').css({ "display": "flex", "align-items": "center", "flex-direction": "column" });
        $('#articleForm').css({ "display": "block" });
        $('#categoryForm').css({ "display": "none" });
        $('#userForm').css({ "display": "none" });
        $.ajax({
            type: "GET",
            url: `php/articles.php`,
            data: {
                action: "read",
            },
            success: function (res) {
                localStorage.setItem("currentData", res);
                printGamesTable(JSON.parse(res));
            },
            error: function (err) {
                console.log("Error en la solicitud AJAX" + err);
            }
        });
    });
    function printGamesTable(rowData) {
        // VACIAR EL DIV ANTES DE PINTAR
        $('.mainContentAdmin_container_table').empty();

        // MONTAR LA TABLA
        var table = $('<table>').addClass('table');
        var thead = $('<thead>');
        var tbody = $('<tbody>');

        // ENCABEZADOS
        var headers = ['name', 'brand', 'stock', 'description', 'details', 'img', 'category'];
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

            // Agregar las categorias al set para su uso
            articleSelectMap.set(row["id_category"], row['category']);

            // Agregar celda oculta
            var hiddenCell = $('<td>').attr('id', 'hidden').css('display', 'none').text(row["id_article"]);

            // Agregar celdas de botones a la fila
            var editButtonCell = $('<td>').append($('<button>', {
                text: "Editar",
                class: "editButton",
                id: "ediGameBtn",
            }));
            var deleteButtonCell = $('<td>').append($('<button>', {
                text: "Eliminar",
                class: "deleteButton",
                id: "delGameBtn",
            }));

            // Agregar celdas de botones a la fila
            dataRow.append(hiddenCell).append(editButtonCell).append(deleteButtonCell);

            tbody.append(dataRow);
        });

        // AGREGAR LOS DATOS
        table.append(thead).append(tbody);
        $('.mainContentAdmin_container_table').append(table);

        //PINTAR LOS OPTION DEL FORMULARIO
        for (const [index, valor] of articleSelectMap) {
            $('#categoryArticleInput').append($('<option>', {
                value: index,
                text: valor,
            }));
        }
    };
    // BORRAR ARTICLE
    $(document).on("click", "#delGameBtn", function () {
        if (confirm("¿Seguro que desea borrar ese artículo?")) {
            $.ajax({
                type: "GET",
                url: "php/articles.php",
                data: {
                    action: "delete",
                    id: $(this).parent().parent().children('#hidden').text()
                },
                success: function (res) {
                    alert("El borrado del artículo se ha realizado con éxito");
                    location.href = "./private.html";
                },
                error: function (err) {
                    console.log("Error en la solicitud AJAX" + err);
                }
            });
        }
    });
    // FUNCIÓN PARA INSERTAR UN ARTICLE
    $(document).on("click", "#createArticleInput", function (event) {
        event.preventDefault();
        // LOS VALORES
        let nameNewArticle = $('#nameArticleInput').val()
        let brandArticleInput = $('#brandArticleInput').val()
        let stockArticleInput = $('#stockArticleInput').val()
        let priceArticleInput = $('#priceArticleInput').val()
        let descriptionArticleInput = $('#descriptionArticleInput').val()
        let detailsArticleInput = $('#detailsArticleInput').val()
        let imgArticleInput = $('#imgArticleInput').val()
        let selectedCategory = $('#categoryArticleInput').children('option:selected').val();
        let id_article = $('#hiddenIdArticleInput').val();
        console.log(id_article);
        // LAS VALIDACIONES
        if (nameNewArticle.length > 0 &&
            brandArticleInput.length > 0 &&
            descriptionArticleInput.length < 1000 &&
            detailsArticleInput.length < 1000
        ) {
            $('#articleInputHelper').text("");
            if ($('#hiddenIdArticleInput').val() == "" || $('#hiddenIdArticleInput').val() == undefined) {
                let newArticle = [nameNewArticle, brandArticleInput, stockArticleInput, priceArticleInput, descriptionArticleInput, detailsArticleInput, imgArticleInput, selectedCategory]
                console.log(selectedCategory);
                $.ajax({
                    type: "GET",
                    url: `php/articles.php`,
                    data: {
                        action: "create",
                        data: newArticle,
                    },
                    success: function (res) {
                        location.href = "./private.html";
                    },
                    error: function (err) {
                        console.log("Error en la solicitud AJAX" + err);
                    }
                });
            } else {
                let updateArticle = [id_article, nameNewArticle, brandArticleInput, stockArticleInput, priceArticleInput, descriptionArticleInput, detailsArticleInput, imgArticleInput, selectedCategory]
                console.log(selectedCategory);
                $.ajax({
                    type: "GET",
                    url: `php/articles.php`,
                    data: {
                        action: "update",
                        data: updateArticle,
                    },
                    success: function (res) {
                        location.href = "./private.html";
                    },
                    error: function (err) {
                        console.log("Error en la solicitud AJAX" + err);
                    }
                });
            }

        } else {
            $('#articleInputHelper').text("Ha introducido un elemento incorrectamente");
        }
    });
    // FUNCIÓN PARA CARGAR LOS DATOS DE UN ARTICLE PARA EDITAR
    $(document).on("click", "#ediGameBtn", function () {
        //VACIAR EL FORM
        $('#nameArticleInput').val("");
        $('#brandArticleInput').val("");
        $('#stockArticleInput').val("");
        $('#priceArticleInput').val("");
        $('#descriptionArticleInput').val("");
        $('#detailsArticleInput').val("");
        $('#imgArticleInput').val("");
        $('option[val="1"]').prop("selected");
        $('#hiddenIdArticleInput').val("");
        // EXTRAER LOS DATOS
        let currentArticle;
        for (const data of JSON.parse(localStorage.getItem("currentData"))) {
            if ($(this).parent().parent().children('#hidden').text() == data.id_article) {
                currentArticle = data;
                break;
            }
        }
        // LOS VALORES
        console.log(currentArticle);
        $('#nameArticleInput').val(currentArticle.name);
        $('#brandArticleInput').val(currentArticle.brand);
        $('#stockArticleInput').val(currentArticle.stock);
        $('#priceArticleInput').val(currentArticle.price);
        $('#descriptionArticleInput').val(currentArticle.description);
        $('#detailsArticleInput').val(currentArticle.details);
        $('#imgArticleInput').val(currentArticle.img);
        $('#hiddenIdArticleInput').val(currentArticle.id_article);
        $('select option').each(function () {
            if ($(this).val() == currentArticle.id_category) {
                $(this).prop('selected', true);
                return false;
            }
        });

    });

    // MOSTRAR CATEGORIAS
    $('#categoryTable').on("click", function () {
        $('#helper').text("");
        $('.mainContentAdmin_container_top').css({ "display": "flex" });
        $('#categoryForm').css({ "display": "block" });
        $('#articleForm').css({ "display": "none" });
        $('#userForm').css({ "display": "none" });
        $.ajax({
            type: "GET",
            url: `php/categories.php`,
            data: {
                action: "read",
            },
            success: function (res) {
                localStorage.setItem("currentData", res);
                printCategoriesTable(JSON.parse(res));
            },
            error: function (err) {
                console.log("Error en la solicitud AJAX" + err);
            }
        });
    });
    function printCategoriesTable(rowData) {
        // VACIAR EL DIV ANTES DE PINTAR
        $('.mainContentAdmin_container_table').empty();

        // MONTAR LA TABLA
        var table = $('<table>').addClass('table');
        var thead = $('<thead>');
        var tbody = $('<tbody>');

        // ENCABEZADOS
        var headers = ['category'];
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
            var hiddenCell = $('<td>').attr('id', 'hidden').css('display', 'none').text(row["id_category"]);

            // Agregar celdas de botones a la fila
            var editButtonCell = $('<td>').append($('<button>', {
                text: "Editar",
                class: "editButton",
                id: "ediCategoryBtn",

            }));
            var deleteButtonCell = $('<td>').append($('<button>', {
                text: "Eliminar",
                class: "deleteButton",
                id: "delCategoryBtn",

            }));

            // Agregar celdas de botones a la fila
            dataRow.append(hiddenCell).append(editButtonCell).append(deleteButtonCell);

            tbody.append(dataRow);
        });

        // AGREGAR LOS DATOS
        table.append(thead).append(tbody);
        $('.mainContentAdmin_container_table').append(table);
    };
    // FUNCIÓN BORRAR CATEGORY
    $(document).on("click", "#delCategoryBtn", function () {
        var row = $(this).closest('tr');
        $.ajax({
            type: "GET",
            url: "php/categories.php",
            data: {
                action: "delete",
                id: $(this).parent().parent().children('#hidden').text()
            },
            success: function (res) {
                if (res === "Categoria eliminada correctamente") {
                    $('#helper').text("Categoria eliminada correctamente");
                    row.remove();
                } else if (res === "Existen productos asociados a esa categoria, no se puede borrar") {
                    $('#helper').text("Existen productos asociados a esa categoria, no se puede borrar");
                } else {
                    $('#helper').text("Error al eliminar la categoria " + res);
                }
            },
            error: function (err) {
                console.log("Error en la solicitud AJAX" + err);
            }
        });
    });
    // FUNCIÓN PARA INSERTAR UNA CATEGORY
    $(document).on("click", "#createCategoryInput", function (event) {
        event.preventDefault();
        // LOS VALORES
        let nameNewCategory = $('#categroyCategoryInput').val()
        let id_category = $('#hiddenIdCategoryInput').val();
        // LAS VALIDACIONES
        if (nameNewCategory.length > 0) {
            $('#categoryInputHelper').text("");
            if (id_category == "" || id_category == undefined) {
                let newCategory = [nameNewCategory];
                $.ajax({
                    type: "GET",
                    url: `php/categories.php`,
                    data: {
                        action: "create",
                        data: newCategory,
                    },
                    success: function (res) {
                        console.log(res);
                        // $('#helper').text("Usuario creado correctamente");

                    },
                    error: function (err) {
                        console.log("Error en la solicitud AJAX" + err);
                    }
                });
            } else {
                let updateCategory = [id_category, nameNewCategory];
                console.log(updateCategory);
                $.ajax({
                    type: "GET",
                    url: `php/categories.php`,
                    data: {
                        action: "update",
                        data: updateCategory,
                    },
                    success: function (res) {
                        location.href = "./private.html";
                    },
                    error: function (err) {
                        console.log("Error en la solicitud AJAX" + err);
                    }
                });
            }

        } else {
            $('#categoryInputHelper').text("Ha introducido un elemento incorrectamente");
        }
    });
    // FUNCIÓN PARA CARGAR LOS DATOS DE UN ARTICLE PARA EDITAR
    $(document).on("click", "#ediCategoryBtn", function () {
        //VACIAR EL FORM
        $('#categroyCategoryInput').val("");
        $('#hiddenIdCategoryInput').val("");
        // EXTRAER LOS DATOS
        let currentCategory;
        for (const data of JSON.parse(localStorage.getItem("currentData"))) {
            if ($(this).parent().parent().children('#hidden').text() == data.id_category) {
                currentCategory = data;
                break;
            }
        }
        // LOS VALORES
        $('#categroyCategoryInput').val(currentCategory.category);
        $('#hiddenIdCategoryInput').val(currentCategory.id_category);

    });


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
        console.log(row);
        $.ajax({
            type: "GET",
            url: "php/users.php",
            data: {
                action: "delete",
                id_user: $(this).parent().parent().children('#hidden').text(),
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
        let password = $('#userPasswordInput').val();
        let passwordRegex = /^\S{8,}$/;
        if (passwordRegex.test(password)) {
            $('#passwordHelp').text("");
        } else {
            $('#passwordHelp').text("La contraseña debe tener al menos 8 carácteres y no puede contener espacios en blanco.");
            return;
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
        $('#userPasswordInput').val(currentUser.password);
        $('#userEmailInput').val(currentUser.email);
        if (currentUser.rol == 0) {
            $('#userRolInput').prop("checked", true);
        } else {
            $('#userRolInput').prop("checked", false);
        }

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


