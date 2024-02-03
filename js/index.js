$(document).ready(function () {

    //CARGA LOS DATOS DE LOS ARTÍCULOS
    if (!localStorage.getItem("data")) {
        $.ajax({
            type: "GET",
            url: "php/articles.php",
            data: {
                action: "read",
            },
            success: function (resultado) {
                var articles = jQuery.parseJSON(resultado);
                localStorage.setItem("data", JSON.stringify(articles));

            },
            error: function (xhr) {
                alert("Atencion: se ha producido un error");
                $("#mensaje1").append(xhr.statusText + xhr.responseText);
            },
        });
    }
    var allProducts = JSON.parse(localStorage.getItem("data"));
    var data = []
    var brandsSet = new Set();
    var categoriesSet = new Set();
    for (const iterator of JSON.parse(localStorage.getItem("data"))) {
        data.push({
            label: iterator.name,
            category: iterator.category,
        });
        brandsSet.add(iterator.brand);
        categoriesSet.add(iterator.category);
    }
    var brandsArray = [...brandsSet];
    var categoriesArray = [...categoriesSet];
    // PINTAR
    print(JSON.parse(localStorage.getItem("data")));

    function print(articles) {
        $(".mainContent_cardContainer").empty();
        for (var x of articles) {
            $(`<div class="card" style="width: 18rem;">
                <img class="card-img-top" src="./assets/${x.img}" alt="${x.name}">
                <div class="card-body">
                  <h5 class="card-title">${x.name}</h5>
                  <p class="card-text">${x.brand}</p>
                  <p class="card-text"><a href="">${x.category}</a></p>
                  <p class="card-text">${x.price} €</p>
                  <p class="card-p-hidden">${x.id_article}</p>
                  <a href="#" class="btn btn-primary card-btn">Ver más</a>
                </div>
            </div>
            `).appendTo(".mainContent_cardContainer");
        }
    }

    // FILTRO DE NOMBRE I
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
    //FILTRO DE NOMBRE II
    $("#search").catcomplete({
        delay: 0,
        source: data,
        select: function (event, ui) {
            var searchString = ui.item.value.toLowerCase();
            var filteredArticles = allProducts.filter(function (article) {
                return article.name.toLowerCase().includes(searchString);
            });
            print(filteredArticles);
        },
        response: function (event, ui) {
            var searchString = $("#search").val().toLowerCase();
            var filteredArticles = allProducts.filter(function (article) {
                return article.name.toLowerCase().includes(searchString);
            });
            print(filteredArticles);
        }
    });

    //FILTRO DE MARCA
    $("#tags").autocomplete({
        source: brandsArray,
        select: function (event, ui) {
            var searchString = ui.item.value.toLowerCase();
            var filteredArticles = allProducts.filter(function (article) {
                return article.brand.toLowerCase().includes(searchString);
            });
            print(filteredArticles);
        },
        response: function (event, ui) {
            var searchString = $("#search").val().toLowerCase();
            var filteredArticles = allProducts.filter(function (article) {
                return article.brand.toLowerCase().includes(searchString);
            });
            print(filteredArticles);
        }
    });

    //SELECTOR DE CATEGORIA
    var selectElement = $("#mainContent_left_categories_select");
    selectElement.empty();
    categoriesArray.forEach(function (category) {
        var optionElement = $("<option></option>").attr("value", category).text(category);
        selectElement.append(optionElement);
    });
    $("#mainContent_left_categories_select").change(function () {
        var selectedCategory = $(this).val();
        var filteredArticles = allProducts.filter(function (article) {
            return article.category.toLowerCase() === selectedCategory.toLowerCase();
        });
        print(filteredArticles);
    });

    //FILTRO DE PRECIOS
    $("#slider-range").slider({
        range: true,
        min: 0,
        max: 200,
        values: [50, 100],
        slide: function (event, ui) {
            var minPrice = ui.values[0];
            var maxPrice = ui.values[1];
            $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
            var filteredArticles = allProducts.filter(function (article) {
                var articlePrice = parseFloat(article.price);
                return articlePrice >= minPrice && articlePrice <= maxPrice;
            });
            print(filteredArticles);
        }
    });
    $("#amount").val("$" + $("#slider-range").slider("values", 0) +
        " - $" + $("#slider-range").slider("values", 1));

    // ORDENAR POR NOMBRE
    $("#nameOrder a:eq(0)").on("click", function (event) {
        event.preventDefault();
        let orderedProducts = allProducts.slice();
        orderedProducts.sort(function (a, b) {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            if (nameA < nameB) {
                return -1;
            } else if (nameA > nameB) {
                return 1;
            } else {
                return 0;
            }
        });
        print(orderedProducts)
    })
    $("#nameOrder a:eq(1)").on("click", function (event) {
        event.preventDefault();
        let orderedProducts = allProducts.slice();
        orderedProducts.sort(function (a, b) {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            if (nameA > nameB) {
                return -1;
            } else if (nameA < nameB) {
                return 1;
            } else {
                return 0;
            }
        });
        print(orderedProducts)
    })
    // ORDENAR POR MARCA
    $("#brandOrder a:eq(0)").on("click", function (event) {
        event.preventDefault();
        let orderedProducts = allProducts.slice();
        orderedProducts.sort(function (a, b) {
            const brandA = a.brand.toUpperCase();
            const brandB = b.brand.toUpperCase();
            if (brandA < brandB) {
                return -1;
            } else if (brandA > brandB) {
                return 1;
            } else {
                return 0;
            }
        });
        print(orderedProducts)
    })
    $("#brandOrder a:eq(1)").on("click", function (event) {
        event.preventDefault();
        let orderedProducts = allProducts.slice();
        orderedProducts.sort(function (a, b) {
            const brandA = a.brand.toUpperCase();
            const brandB = b.brand.toUpperCase();
            if (brandA > brandB) {
                return -1;
            } else if (brandA < brandB) {
                return 1;
            } else {
                return 0;
            }
        });
        print(orderedProducts)
    })
    // ORDENAR POR CATEGORIA
    $("#catOrder a:eq(0)").on("click", function (event) {
        event.preventDefault();
        let orderedProducts = allProducts.slice();
        orderedProducts.sort(function (a, b) {
            const catA = a.category.toUpperCase();
            const catB = b.category.toUpperCase();
            if (catA < catB) {
                return -1;
            } else if (catA > catB) {
                return 1;
            } else {
                return 0;
            }
        });
        print(orderedProducts)
    })
    $("#catOrder a:eq(1)").on("click", function (event) {
        event.preventDefault();
        let orderedProducts = allProducts.slice();
        orderedProducts.sort(function (a, b) {
            const catA = a.category.toUpperCase();
            const catB = b.category.toUpperCase();
            if (catA > catB) {
                return -1;
            } else if (catA < catB) {
                return 1;
            } else {
                return 0;
            }
        });
        print(orderedProducts)
    })
    $("#priceOrder a:eq(0)").on("click", function (event) {
        event.preventDefault();
        let orderedProducts = allProducts.slice();
        orderedProducts.sort(function (a, b) {
            const priceA = parseFloat(a.price);
            const priceB = parseFloat(b.price);
            return priceA - priceB;
        });
        print(orderedProducts);
    });

    $("#priceOrder a:eq(1)").on("click", function (event) {
        event.preventDefault();
        let orderedProducts = allProducts.slice();
        orderedProducts.sort(function (a, b) {
            const priceA = parseFloat(a.price);
            const priceB = parseFloat(b.price);
            return priceB - priceA;
        });
        print(orderedProducts);
    });

    // Variables de paginación
    var itemsPerPage = 3;
    var currentPage = 1;
    var totalPages = Math.ceil(allProducts.length / itemsPerPage);

    // Función para imprimir los artículos de la página actual
    function printCurrentPage() {
        var startIndex = (currentPage - 1) * itemsPerPage;
        var endIndex = startIndex + itemsPerPage;
        var currentArticles = allProducts.slice(startIndex, endIndex);
        print(currentArticles);
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
});
