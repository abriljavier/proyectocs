$(document).ready(function () {
    if (!sessionStorage.getItem("userData")) {
        location.href = "login.html"
    }
});


