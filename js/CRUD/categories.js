$(document).ready(function () {
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
                        categoryName: newCategory,
                    },
                    success: function (res) {
                        if (res == true) {
                            cleanForm();
                            $('#helper').text("Categoria creada correctamente");
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
                        } else {
                            $('#helper').text(res);
                        }

                    },
                    error: function (err) {
                        console.log("Error en la solicitud AJAX" + err);
                    }
                });
            } else {
                let updateCategory = [id_category, nameNewCategory];
                $.ajax({
                    type: "GET",
                    url: `php/categories.php`,
                    data: {
                        action: "update",
                        data: updateCategory,
                    },
                    success: function (res) {
                        if (res == true) {
                            cleanForm();
                            $('#helper').text("Categoria actualizada correctamente");
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
                        } else {
                            $('#helper').text(res);
                        }
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
    // FUNCIÓN PARA CARGAR LOS DATOS DE UNA CATEGORIE PARA EDITAR
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
    // FUNCIÓN PARA RESETEAR LOS MENSAJES DE AYUDA
    function cleanForm() {
        $('#categroyCategoryInput').val("");
        $('#hiddenIdCategoryInput').val("");
        $('#helper').val("");
    }
});