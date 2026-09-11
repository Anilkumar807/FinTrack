/* =========================
   SIGNUP PAGE
========================= */


/* =========================
   STORAGE KEY
========================= */

const USER_KEY =
    "fintrack_user";


/* =========================
   DOM ELEMENTS
========================= */

const signupForm =
    document.getElementById(
        "signup-form"
    );


const signupName =
    document.getElementById(
        "signup-name"
    );


const signupEmail =
    document.getElementById(
        "signup-email"
    );


const signupPassword =
    document.getElementById(
        "signup-password"
    );


const confirmPassword =
    document.getElementById(
        "confirm-password"
    );


const signupMessage =
    document.getElementById(
        "signup-message"
    );


/* =========================
   SHOW MESSAGE
========================= */

function showMessage(
    message,
    type = "error"
) {

    signupMessage.textContent =
        message;


    signupMessage.className =
        `auth-message ${type}`;


}


/* =========================
   SIGNUP
========================= */

signupForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        const name =
            signupName.value.trim();


        const email =
            signupEmail.value
                .trim()
                .toLowerCase();


        const password =
            signupPassword.value;


        const confirm =
            confirmPassword.value;


        /* VALIDATION */

        if (
            name === "" ||
            email === "" ||
            password === ""
        ) {

            showMessage(
                "Please fill in all fields.",
                "error"
            );

            return;

        }


        if (
            password.length < 6
        ) {

            showMessage(
                "Password must contain at least 6 characters.",
                "error"
            );

            return;

        }


        if (
            password !== confirm
        ) {

            showMessage(
                "Passwords do not match.",
                "error"
            );

            return;

        }


        /* CHECK EXISTING USER */

        const existingUser =
            localStorage.getItem(
                USER_KEY
            );


        if (existingUser) {

            showMessage(
                "An account already exists. Please login.",
                "error"
            );

            return;

        }


        /* CREATE USER */

        const user = {

            name: name,

            email: email,

            password: password

        };


        /* SAVE USER */

        localStorage.setItem(
            USER_KEY,
            JSON.stringify(user)
        );


        showMessage(
            "Account created successfully! Redirecting to login...",
            "success"
        );


        /* REDIRECT */

        setTimeout(
            () => {

                window.location.href =
                    "login.html";

            },
            1500
        );

    }
);