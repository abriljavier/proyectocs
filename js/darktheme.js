$(document).ready(function () {
    if (localStorage.getItem("dark")) {
        applyDarkTheme();
    }
});

$(document).on('click', '#toggle-theme', function () {
    if (localStorage.getItem("dark")) {
        localStorage.removeItem('dark');
    } else {
        localStorage.setItem('dark', 'true');
    }

    applyDarkTheme();
});

function applyDarkTheme() {
    if (localStorage.getItem("dark")) {
        var styleElement = document.createElement('style');
        styleElement.setAttribute('data-dark-mode', '');
        styleElement.textContent = `
            @media (prefers-color-scheme: dark) {
                :root {
                    --c-background: #333333;
                    --c-first: #77A8A6;
                    --c-second: #6C8E6A;
                    --c-terciary: #8C818F;
                    --c-dark: #ffffff;
                }
            }
        `;
        document.head.appendChild(styleElement);
    } else {
        var darkMediaQuery = document.querySelector('style[data-dark-mode]');
        if (darkMediaQuery) {
            darkMediaQuery.remove();
        }
    }
}