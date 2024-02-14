$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "php/sessions/checkSession.php",
        success: function (res) {
            console.log(`La respuesta del session es ${res}`);
            if (res != "Sesión ok") {
                location.href = "./forbidden.html"
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
});