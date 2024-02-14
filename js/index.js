$(document).ready(function () {

    $('.carousel').slick({
        dots: true,
        infinite: true,
        speed: 500,
        fade: true,
        autoplay: true,
        cssEase: 'linear'
    });

    var allProducts = [];
    var filteredArticles = [];
    var brandsArray = [];
    var categoriesArray = [];
    var data = [];
    var firstTime = true;
    var haySesion = false;
    if (!localStorage.getItem('cart')) {
        var shoppingCart = {};
        localStorage.setItem("cart", JSON.stringify(shoppingCart))
    } else {
        shoppingCart = JSON.parse(localStorage.getItem('cart'));
    }

    setTimeout(function () {
        haySesion = localStorage.getItem("haySesion");
        // localStorage.removeItem("haySesion");
    }, 500)

    //CARGA LOS DATOS DE LOS ARTÍCULOS
    $.ajax({
        type: "GET",
        url: "php/articles.php",
        data: {
            action: "read",
        },
        success: function (resultado) {
            allProducts = jQuery.parseJSON(resultado);
            localStorage.setItem("data", resultado);
            // MONTAR LAS LISTAS PARA LOS DATOS DE LOS FILTROS
            var brandsSet = new Set();
            var categoriesSet = new Set();
            for (const iterator of allProducts) {
                data.push({
                    label: iterator.name,
                    category: iterator.category,
                });
                brandsSet.add(iterator.brand);
                categoriesSet.add(iterator.category);
            }
            brandsArray = [...brandsSet];
            categoriesArray = [...categoriesSet];
            print(allProducts);
            loadFiltersAndOrders();
            paging();

        },
        error: function (xhr) {
            alert("Atencion: se ha producido un error");
            $("#mensaje1").append(xhr.statusText + xhr.responseText);
        },
    });

    function print(articles) {
        $(".mainContent_cardContainer").empty();
        for (var x of articles) {
            // Crear elemento de tarjeta
            var cardElement = $(`<div class="card" style="width: 18rem;">
                <img class="card-img-top" src="./assets/${x.img}" alt="${x.name}">
                <div class="card-body">
                  <h5 class="card-title">${x.name}</h5>
                  <p class="card-text">${x.brand}</p>
                  <p class="card-text"><a href="#" onclick="return false;">${x.category}</a></p>
                  <p class="card-text">${x.price} €</p>
                  <p class="card-p-hidden">${x.id_article}</p>
                </div>
            </div>`);

            if (x.stock > 0) {
                cardElement.find('.card-body').append('<a href="#" id="detailsBtn" class="btn btn-primary card-btn">Ver más</a>');
            } else {
                cardElement.find('.card-body').append('<p class="text-danger">No hay stock disponible</p>');
            }

            cardElement.appendTo(".mainContent_cardContainer");
        }
    }

    function loadFiltersAndOrders() {
        var changedOption = false;
        var changedPrice = false;
        // WIDGET DE FILTRO DE NOMBRE
        $.widget("custom.catcomplete", $.ui.autocomplete, {
            _create: function () {
                this._super();
                this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
            },
            _renderMenu: function (ul, items) {
                var that = this,
                    currentCategory = "";
                $.each(items, function (index, item) {
                    var li;
                    if (item.category != currentCategory) {
                        ul.append("<li class='ui-autocomplete-category'>" + item.category + "</li>");
                        currentCategory = item.category;
                    }
                    li = that._renderItemData(ul, item);
                    if (item.category) {
                        li.attr("aria-label", item.category + " : " + item.label);
                    }
                });
            }
        });

        // FILTRO DE NOMBRE
        $("#search").catcomplete({
            delay: 0,
            source: data,
            select: function (event, ui) {
                applyFilters();
            },
            response: function (event, ui) {
                applyFilters();
            }
        }).on('keyup', function () {
            applyFilters();
        });


        // FILTRO DE MARCA
        $("#tags").autocomplete({
            source: brandsArray,
            select: function (event, ui) {
                applyFilters();
            },
            response: function (event, ui) {
                applyFilters();
            }
        }).on('keyup', function () {
            applyFilters();
        });

        // SELECTOR DE CATEGORIA
        var selectElement = $("#mainContent_left_categories_select");
        selectElement.empty();
        categoriesArray.forEach(function (category) {
            var optionElement = $("<option></option>").attr("value", category).text(category);
            selectElement.append(optionElement);
        });
        $("#mainContent_left_categories_select").change(function () {
            changedOption = true;
            applyFilters();
        });

        // FILTRO DE PRECIOS
        $("#slider-range").slider({
            range: true,
            min: 0,
            max: 300,
            values: [20, 100],
            slide: function (event, ui) {
                changedPrice = true;
                $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
                applyFilters();
            }
        });

        // ORDENAR POR NOMBRE
        $("#nameOrder a").click(function (event) {
            event.preventDefault();
            var order = $(this).attr('class');
            sortArticlesBy("name", order, false);
        });

        // ORDENAR POR MARCA
        $("#brandOrder a").click(function (event) {
            event.preventDefault();
            var order = $(this).attr('class');
            sortArticlesBy("brand", order, false);
        });

        // ORDENAR POR CATEGORIA
        $("#catOrder a").click(function (event) {
            event.preventDefault();
            var order = $(this).attr('class');
            sortArticlesBy("category", order, false);
        });

        // ORDENAR POR PRECIO
        $("#priceOrder a").click(function (event) {
            event.preventDefault();
            var order = $(this).attr('class');
            sortArticlesBy("price", order, true);
        });

        filteredArticles = allProducts.slice();

        // FUNCIÓN QUE APLICA LOS FILTROS
        function applyFilters() {
            filteredArticles = allProducts.slice();

            var searchString = $("#search").val().toLowerCase();
            if (searchString) {
                filteredArticles = filteredArticles.filter(function (article) {
                    return article.name.toLowerCase().includes(searchString);
                });
            }

            var brandString = $("#tags").val().toLowerCase();
            if (brandString) {
                filteredArticles = filteredArticles.filter(function (article) {
                    return article.brand.toLowerCase().includes(brandString);
                });
            }

            if (changedOption) {
                var selectedCategory = $("#mainContent_left_categories_select").children("option:selected").val().toLowerCase();
                if (selectedCategory) {
                    filteredArticles = filteredArticles.filter(function (article) {
                        return article.category.toLowerCase() === selectedCategory;
                    });
                }
            }

            if (changedPrice) {
                var minPrice = $("#slider-range").slider("values", 0);
                var maxPrice = $("#slider-range").slider("values", 1);
                filteredArticles = filteredArticles.filter(function (article) {
                    var articlePrice = parseFloat(article.price);
                    return articlePrice >= minPrice && articlePrice <= maxPrice;
                });
            }
            paging();
        }

        // FUNCIÓN PARA ORDENAR
        function sortArticlesBy(property, order, isPrice) {
            // var orderedArticles = filteredArticles.slice();
            filteredArticles.sort(function (a, b) {
                if (!isPrice) {
                    var valueA = a[property].toUpperCase();
                    var valueB = b[property].toUpperCase();
                    if (order === "asc") {
                        return valueA.localeCompare(valueB);
                    } else {
                        return valueB.localeCompare(valueA);
                    }
                } else {
                    var valueA = parseFloat(a[property].toUpperCase());
                    var valueB = parseFloat(b[property].toUpperCase());
                    if (order === "asc") {
                        return valueA - valueB;
                    } else {
                        return valueB - valueA;
                    }
                }

            });
            paging();
        }

    }

    function paging() {
        // Variables de paginación
        var itemsPerPage = 3;
        var currentPage = 1;
        var totalPages = Math.ceil(filteredArticles.length / itemsPerPage);

        if (firstTime) {
            firstTime = false;
            function printCurrentPage() {
                var startIndex = (currentPage - 1) * itemsPerPage;
                var endIndex = startIndex + itemsPerPage;
                var currentArticles = allProducts.slice(startIndex, endIndex);
                print(currentArticles);
            }
        } else {
            function printCurrentPage() {
                var startIndex = (currentPage - 1) * itemsPerPage;
                var endIndex = startIndex + itemsPerPage;
                var currentArticles = filteredArticles.slice(startIndex, endIndex);
                if (currentArticles.length == 0) {
                    console.log(currentArticles.length);
                    $(".mainContent_cardContainer").empty();
                    $(".mainContent_cardContainer").append("<h2 class='noGameH2'>No hay artículos con el criterio seleccionado</h2>")
                } else {
                    print(currentArticles);
                }
            }
        }

        // Función para actualizar los controles de paginación
        function updatePagination() {
            $(".pagination").empty();
            for (var i = 1; i <= totalPages; i++) {
                var link = $("<a>").text(i).attr("href", "#").addClass("page-link");
                if (i === currentPage) {
                    link.addClass("active");
                }
                $(".pagination").append($("<span>").append(link));
            }
        }

        // Inicialización
        printCurrentPage();
        updatePagination();

        // Manejador de eventos para cambiar de página
        $(".pagination").on("click", ".page-link", function (event) {
            event.preventDefault();
            currentPage = parseInt($(this).text());
            printCurrentPage();
            updatePagination();
        });
    }

    // EL DIALOGO DE VER MÁS
    $(document).on("click", "#detailsBtn", function (event) {
        event.preventDefault();
        let cardId = $(this).siblings(".card-p-hidden").text();
        let cardInfo = allProducts.find(item => item.id_article === cardId);
        let dialogContent = $("<div>").addClass("dialog-content");
        let title = $("<h2>").addClass("dialog-content-title").text("Artículo: " + cardInfo.name);
        let container = $("<div>").addClass("dialog-content-container");
        let img = $("<img>").addClass("dialog-content-image").attr("src", "./assets/" + cardInfo.img).attr("alt", "Product Image");
        let info = $("<div>").addClass("dialog-content-info");
        let brand = $("<h3>").addClass("dialog-subtitle").text("Marca: " + cardInfo.brand);
        let data = $("<div>").addClass("dialog-content-data");
        let description = $("<p>").addClass("dialog-description").text(cardInfo.description);
        let ul = $("<ul>").addClass("dialog-content-data-ul");
        let price = $("<li>").addClass("dialog-price").text("Precio: " + cardInfo.price + " €");
        let stock = $("<li>").addClass("dialog-stock").text("Stock: " + cardInfo.stock);
        let details = $("<li>").addClass("dialog-stock").text("Detalles: " + cardInfo.details);
        let category = $("<li>").addClass("dialog-category").text("Categoria: " + cardInfo.category);

        ul.append(price, stock, category, details);
        data.append(description, ul);
        info.append(brand, data);
        container.append(img, info);
        dialogContent.append(title, container);

        $("#dialog").empty().append(dialogContent);
        $("#dialog").dialog({
            resizable: false,
            width: 1366,
            height: 800,
            modal: true,
            draggable: false,
            buttons: [
                {
                    text: "Añadir al carro",
                    click: function () {
                        cardInfo.stock = cardInfo.stock - 1;
                        if (localStorage.getItem("haySesion") == "true") {
                            if (cardInfo.stock >= 0) {
                                let productToAdd = allProducts.find(product => product.id_article === cardId);
                                if (productToAdd) {
                                    if (shoppingCart[productToAdd.id_article]) {
                                        shoppingCart[productToAdd.id_article].cantidad += 1;
                                    } else {
                                        shoppingCart[productToAdd.id_article] = { ...productToAdd, cantidad: 1 };
                                    }
                                    localStorage.setItem('cart', JSON.stringify(shoppingCart));
                                }
                                $("#dialog-message-good").dialog({
                                    modal: true,
                                    resizable: false,
                                    width: 800,
                                    height: 250,
                                    buttons: {
                                        "Seguir comprando": function () {
                                            $(this).dialog("close");
                                        },
                                        "Ir a mi carrito": function () {
                                            location.href = "carrito.html";
                                        }
                                    }
                                });
                            } else {
                                $("#dialog-message-noStock").dialog({
                                    modal: true,
                                    resizable: false,
                                    width: 800,
                                    height: 250,
                                    buttons: {
                                        "Ok": function () {
                                            $(this).dialog("close");
                                        },
                                    }
                                });
                            }

                        } else {
                            $("#dialog-message-bad").dialog({
                                modal: true,
                                resizable: false,
                                width: 800,
                                height: 250,
                                buttons: {
                                    Ok: function () {
                                        $(this).dialog("close");
                                    }
                                }
                            });
                        }
                    }
                },
                {
                    text: "Cancel",
                    click: function () {
                        $(this).dialog("close");
                    }
                }
            ],
            create: function () {
                if (cardInfo.stock <= 0) {
                    $(this).next().children().children().first().attr("disabled", true);
                }
            }
        });
    });

    //EL BOTÓN DE BORRAR FILTROS
    $(document).on("click", "#deleteFiltersButton", function () {
        firstTime = true;
        changedOption = false;
        $("#search").val("");
        $("#tags").val("");
        filteredArticles = allProducts.slice();
        paging();
    })

    //EL BOTÓN PARA MOSTRAR EL CARRITO
    $(document).on("click", "#cart", function () {
        console.log(haySesion);
        if (localStorage.getItem("haySesion") == "true") {
            let cartProducts = JSON.parse(localStorage.getItem("cart") || '{}'); // Asegurar que no sea null
            let dialogCartContent = $("<div>").addClass("shopping-cart-content");
            let subtotal = 0;

            $.each(cartProducts, function (index, product) {
                let itemPrice = parseFloat(product.price) * product.cantidad;
                subtotal += itemPrice;

                let item = $("<div>").addClass("cart-item");
                let name = $("<div>").addClass("cart-item-name").text(product.name);
                let price = $("<div>").addClass("cart-item-price").text("Precio: " + product.price + " €");
                let quantity = $("<div>").addClass("cart-item-quantity").text("Cantidad: " + product.cantidad);
                let delButton = $("<button>").addClass("cart-item-button").text("X").click(function () {
                    // Disminuir cantidad o eliminar producto del carrito
                    if (cartProducts[index].cantidad > 1) {
                        cartProducts[index].cantidad -= 1;
                        $(this).siblings('.cart-item-quantity').text("Cantidad: " + cartProducts[index].cantidad);
                    } else {
                        delete cartProducts[index];
                        $(this).closest('.cart-item').remove();
                    }
                    localStorage.setItem("cart", JSON.stringify(cartProducts));
                    calculateSubtotal();
                });

                item.append(name, price, quantity, delButton);
                dialogCartContent.append(item);
            });

            // Agregar subtotal al diálogo
            let subtotalElement = $("<div>").addClass("cart-subtotal").text("Subtotal: " + subtotal.toFixed(2) + " €");
            dialogCartContent.append(subtotalElement);

            // Función para recalcular el subtotal
            function calculateSubtotal() {
                let newSubtotal = 0;
                $.each(cartProducts, function (index, product) {
                    if (product) {
                        newSubtotal += parseFloat(product.price) * product.cantidad;
                    }
                });
                $(".cart-subtotal").text("Subtotal: " + newSubtotal.toFixed(2) + " €");
            }

            // Configurar el diálogo del carrito
            $("#dialog-cart-good").empty().append(dialogCartContent).dialog({
                dialogClass: "shoppingCartDialog",
                open: function (event, ui) {
                    $(this).dialog("widget").css({
                        "position": "absolute",
                        "height": "auto",
                        "width": "424.6px",
                        "top": "242.422px",
                        "left": "1000px"
                    });
                },
                modal: true,
                resizable: false,
                draggable: false,
                buttons: {
                    "Vaciar Carrito": function () {
                        localStorage.setItem("cart", "");
                        $("#dialog-cart-good").dialog("close");
                    },
                    "Comprar": function () {
                        location.href = 'shopping.html';
                    }
                },
            })
        } else {
            location.href = './login.html';
        }

    });

    function applyDarkModeToElement($element) {
        $element.addClass('dark-mode');
        $element.children().each(function () {
            applyDarkModeToElement($(this));
        });
    }

    if (localStorage.getItem("dark")) {
        console.log("Es modo oscuro");
        applyDarkModeToElement($('body'));
    }
});
