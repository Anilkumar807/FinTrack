/* =========================
   ACTIVE SIDEBAR MENU
========================= */

document.addEventListener("DOMContentLoaded", () => {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase()
            .trim();


    console.log(
        "Current Page:",
        currentPage
    );


    const sidebarLinks =
        document.querySelectorAll(
            ".sidebar a"
        );


    sidebarLinks.forEach((link) => {

        const href =
            link.getAttribute("href");


        if (!href) {

            return;

        }


        const linkPage =
            href
                .split("/")
                .pop()
                .toLowerCase()
                .trim();


        if (linkPage === currentPage) {

            link.classList.add(
                "active"
            );

        }

        else {

            link.classList.remove(
                "active"
            );

        }

    });

});