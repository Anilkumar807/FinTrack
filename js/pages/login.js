const loginForm =
    document.getElementById("login-form");


loginForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        const email =
            document.getElementById("email")
                .value
                .trim();


        const password =
            document.getElementById("password")
                .value
                .trim();


        // Basic validation

        if (!email || !password) {

            alert(
                "Please enter email and password."
            );

            return;

        }


        // Demo login

        localStorage.setItem(
            "fintrack_logged_in",
            "true"
        );


        localStorage.setItem(
            "fintrack_user_email",
            email
        );


        // Redirect to Dashboard

        window.location.href =
            "dashboard.html";

    }
);