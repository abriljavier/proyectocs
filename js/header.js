$(document).ready(function () {
    $(document).on("click", "#home", function () {
        location.href = 'index.html';
    })
    $.ajax({
        type: "GET",
        url: "php/sessions/checkSession.php",
        success: function (res) {
            if (res == "Sesión ok") {
                localStorage.setItem("haySesion", true);

                $('button#private').text("Privada");
                $('button#private').on("click", function () {
                    let rol = JSON.parse(sessionStorage.getItem("userData"))['rol'];
                    if (rol == 0) {
                        location.href = './admin.html';
                    } else {
                        location.href = './private.html';
                    }
                })

                $('button#cerrarSesion').css("display", "block");
                $('button#cerrarSesion').on("click", function () {
                    localStorage.setItem("haySesion", false);
                    $.ajax({
                        type: "GET",
                        url: "php/sessions/destroySession.php",
                        success: function (res) {
                            if (res == "sesión destruida") {
                                sessionStorage.clear();
                                location.href = "./index.html";
                            }
                        },
                        error: function (e) {
                            console.log(e);
                        }
                    });
                });
            } else {
                $('button#cerrarSesion').css("display", "none");
                $('button#private').text("Acceder");
                $('button#private').on("click", function () {
                    location.href = 'login.html';
                })
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
    // $(document).on('click', '#toggle-theme', function () {
    //     console.log("entro");
    //     if (localStorage.getItem("dark")) {
    //         var darkMediaQuery = document.querySelector('style[data-dark-mode]');
    //         if (darkMediaQuery) {
    //             darkMediaQuery.remove();
    //         }
    //         localStorage.removeItem('dark');
    //     } else {
    //         var styleElement = document.createElement('style');
    //         styleElement.setAttribute('data-dark-mode', '');
    //         styleElement.textContent = `
    //             @media (prefers-color-scheme: dark) {
    //                 :root {
    //                     --c-background: #333333;
    //                     --c-first: #77A8A6;
    //                     --c-second: #6C8E6A;
    //                     --c-terciary: #8C818F;
    //                     --c-dark: #ffffff;
    //                 }
    //             }
    //         `;
    //         document.head.appendChild(styleElement);
    //         localStorage.setItem('dark', 'true');
    //     }
    // })

});