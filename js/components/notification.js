function showNotification(
    message,
    type
) {

    const successMessage =
        document.getElementById("success-message");

    const errorMessage =
        document.getElementById("error-message");


    // Hide both messages first

    if (successMessage) {

        successMessage.style.display = "none";

    }


    if (errorMessage) {

        errorMessage.style.display = "none";

    }


    // Select message based on type

    const notification =
        type === "success"
            ? successMessage
            : errorMessage;


    if (!notification) {
        return;
    }


    notification.textContent = message;

    notification.style.display = "block";


    setTimeout(() => {

        notification.style.display = "none";

    }, 3000);

}


export function showSuccessMessage(message) {

    showNotification(
        message,
        "success"
    );

}


export function showErrorMessage(message) {

    showNotification(
        message,
        "error"
    );

}