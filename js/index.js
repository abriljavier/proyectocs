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
                console.log(resultado);
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
                  <p class="card-p-hidden">${x.id_article}</p>
                  <a href="#" class="btn btn-primary card-btn">Ver más</a>
                </div>
            </div>`).appendTo(".mainContent_cardContainer");
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
            applyFilters();
        },
        response: function (event, ui) {
            applyFilters();
        }
    });

    //FILTRO DE MARCA
    $("#tags").autocomplete({
        source: brandsArray,
        select: function (event, ui) {
            applyFilters();
        },
        response: function (event, ui) {
            applyFilters();
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
        applyFilters();
    });

    //FILTRO DE PRECIOS
    $("#slider-range").slider({
        range: true,
        min: 0,
        max: 200,
        values: [50, 100],
        slide: function (event, ui) {
            applyFilters();
        }
    });

    $("#amount").val("$" + $("#slider-range").slider("values", 0) +
        " - $" + $("#slider-range").slider("values", 1));

    // Aplica todos los filtros y muestra los resultados
    function applyFilters() {
        var searchString = $("#search").val().toLowerCase();
        var selectedBrand = $("#tags").val().toLowerCase();
        var selectedCategory = $("#mainContent_left_categories_select").val().toLowerCase();
        var minPrice = $("#slider-range").slider("values", 0);
        var maxPrice = $("#slider-range").slider("values", 1);

        var filteredArticles = allProducts.filter(function (article) {
            var nameMatch = article.name.toLowerCase().includes(searchString);
            var brandMatch = selectedBrand === "" || article.brand.toLowerCase().includes(selectedBrand);
            var categoryMatch = selectedCategory === "" || article.category.toLowerCase() === selectedCategory;
            var priceMatch = parseFloat(article.price) >= minPrice && parseFloat(article.price) <= maxPrice;
            return nameMatch && brandMatch && categoryMatch && priceMatch;
        });

        print(filteredArticles);
    }
});
