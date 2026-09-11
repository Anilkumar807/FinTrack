/* =========================
   FINTRACK THEME MANAGER
========================= */

const THEME_KEY =
    "fintrack_dark_mode";


function loadTheme() {

    const darkMode =
        localStorage.getItem(
            THEME_KEY
        );


    if (darkMode === "true") {

        document.body.classList.add(
            "dark-mode"
        );

    }

}


loadTheme();