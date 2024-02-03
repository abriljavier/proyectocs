$(document).ready(function () {
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
                printArticlesTable(JSON.parse(res));
            },
            error: function (err) {
                console.log("Error en la solicitud AJAX" + err);
            }
        });
    });
    function printArticlesTable(rowData) {
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
        $('#categoryArticleInput').empty();
        for (const [index, valor] of articleSelectMap) {
            $('#categoryArticleInput').append($('<option>', {
                value: index,
                text: valor,
            }));
        }
    };
    // BORRAR ARTICLE
    $(document).on("click", "#delGameBtn", function () {
        var row = $(this).closest('tr');
        $.ajax({
            type: "GET",
            url: "php/articles.php",
            data: {
                action: "delete",
                id: $(this).parent().parent().children('#hidden').text()
            },
            success: function (res) {
                if (res === "Articulo eliminado correctamente") {
                    $('#helper').text("Articulo eliminado correctamente");
                    row.remove();
                } else {
                    $('#helper').text("Error al eliminar el artículo " + res);
                }
            },
            error: function (err) {
                console.log("Error en la solicitud AJAX" + err);
            }
        });
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
        // LAS VALIDACIONES
        if (nameNewArticle.length > 0 &&
            brandArticleInput.length > 0 &&
            descriptionArticleInput.length < 1000 &&
            detailsArticleInput.length < 1000
        ) {
            $('#articleInputHelper').text("");
            if ($('#hiddenIdArticleInput').val() == "" || $('#hiddenIdArticleInput').val() == undefined) {
                let newArticle = [nameNewArticle, brandArticleInput, stockArticleInput, priceArticleInput, descriptionArticleInput, detailsArticleInput, imgArticleInput, selectedCategory]
                $.ajax({
                    type: "GET",
                    url: `php/articles.php`,
                    data: {
                        action: "create",
                        data: newArticle,
                    },
                    success: function (res) {
                        if (res == true) {
                            cleanForm();
                            $('#helper').text("Artículo creado correctamente");
                            $.ajax({
                                type: "GET",
                                url: `php/articles.php`,
                                data: {
                                    action: "read",
                                },
                                success: function (res) {
                                    localStorage.setItem("currentData", res);
                                    printArticlesTable(JSON.parse(res));
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
                let updateArticle = [id_article, nameNewArticle, brandArticleInput, stockArticleInput, priceArticleInput, descriptionArticleInput, detailsArticleInput, imgArticleInput, selectedCategory]
                $.ajax({
                    type: "GET",
                    url: `php/articles.php`,
                    data: {
                        action: "update",
                        data: updateArticle,
                    },
                    success: function (res) {
                        if (res == true) {
                            cleanForm();
                            $('#helper').text("Articulo actualizada correctamente");
                            $.ajax({
                                type: "GET",
                                url: `php/articles.php`,
                                data: {
                                    action: "read",
                                },
                                success: function (res) {
                                    localStorage.setItem("currentData", res);
                                    printArticlesTable(JSON.parse(res));
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
        $('#nameArticleInput').val(currentArticle.name);
        $('#brandArticleInput').val(currentArticle.brand);
        $('#stockArticleInput').val(currentArticle.stock);
        $('#priceArticleInput').val(currentArticle.price);
        $('#descriptionArticleInput').val(currentArticle.description);
        $('#detailsArticleInput').val(currentArticle.details);
        $('#imgArticleInput').val(currentArticle.img);
        $('#hiddenIdArticleInput').val(currentArticle.id_article);
        $('#categoryArticleInput').val(currentArticle.id_category);

    });

    function cleanForm() {
        $('#nameArticleInput').val("");
        $('#brandArticleInput').val("");
        $('#priceArticleInput').val("");
        $('#stockArticleInput').val("");
        $('#descriptionArticleInput').val("");
        $('#detailsArticleInput').val("");
        $('#imgArticleInput').val("");
        $('#hiddenIdArticleInput').val("");
        $('#helper').val("");
    }
});