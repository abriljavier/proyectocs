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

    // FILTRO DE NOMBRE
    var data = []
    var brands = [];
    var categories = [];
    for (const iterator of JSON.parse(localStorage.getItem("data"))) {
        data.push({
            label: iterator.name,
            category: iterator.category,
        });
        brands.push(iterator.brand);
        categories.push(iterator.category);
    }
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

    $("#search").catcomplete({
        delay: 0,
        source: data,
    });

    //FILTRO DE MARCA
    $("#tags").autocomplete({
        source: brands,
    });

    //FILTRO DE PRECIOS
    $("#slider-range").slider({
        range: true,
        min: 0,
        max: 500,
        values: [75, 300],
        slide: function (event, ui) {
            $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
        }
    });
    $("#amount").val("$" + $("#slider-range").slider("values", 0) +
        " - $" + $("#slider-range").slider("values", 1));

    //FILTRO DE CATEGORIA
    $("#tags").autocomplete({
        source: categories
    });


    //LOS PINTA
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
            </div>
            `).appendTo(".mainContent_cardContainer");
        }
    }
});