const profileWrapper =
    document.getElementById(
        "profile-wrapper"
    );


const userProfileButton =
    document.getElementById(
        "user-profile-btn"
    );


const logoutButton =
    document.getElementById(
        "logout-btn"
    );


/* =========================
   PROFILE DROPDOWN
========================= */

userProfileButton.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        profileWrapper.classList.toggle(
            "active"
        );

    }
);


/* Close When Clicking Outside */

document.addEventListener(
    "click",
    (event) => {

        if (
            !profileWrapper.contains(
                event.target
            )
        ) {

            profileWrapper.classList.remove(
                "active"
            );

        }

    }
);


/* =========================
   LOGOUT
========================= */

logoutButton.addEventListener(
    "click",
    () => {

        const confirmed =
            confirm(
                "Are you sure you want to logout?"
            );


        if (!confirmed) {

            return;

        }


        /*
        Add your login/logout logic here.
        */


        window.location.href =
            "../index.html";

    }
);