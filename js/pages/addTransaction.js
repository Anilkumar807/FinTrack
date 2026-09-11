import {
    addTransaction,
    updateTransaction,
    getTransactions
} from "../services/transactionService.js";


// =========================
// Get Form Elements
// =========================

const form =
    document.getElementById("transaction-form");

const typeInput =
    document.getElementById("type");

const titleInput =
    document.getElementById("title");

const amountInput =
    document.getElementById("amount");

const categoryInput =
    document.getElementById("category");

const dateInput =
    document.getElementById("date");


// =========================
// Check Edit Mode
// =========================

const urlParams =
    new URLSearchParams(window.location.search);

const editId =
    urlParams.get("edit");


// =========================
// Edit Transaction
// =========================

if (editId) {

    const transactions =
        getTransactions();


    const transaction =
        transactions.find(
            transaction =>
                transaction.id === Number(editId)
        );


    if (transaction) {

        // Change heading

        document.querySelector(
            ".form-container h1"
        ).textContent = "Edit Transaction";


        // Change description

        document.querySelector(
            ".form-container > p"
        ).textContent =
            "Update your transaction details.";


        // Fill existing values

        typeInput.value =
            transaction.type;

        titleInput.value =
            transaction.title;

        amountInput.value =
            transaction.amount;

        categoryInput.value =
            transaction.category;

        dateInput.value =
            transaction.date;


        // Change button text

        form.querySelector(
            'button[type="submit"]'
        ).textContent = "Save Changes";

    }

}


// =========================
// Form Submit
// =========================

form.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const transactionData = {

            title:
                titleInput.value.trim(),

            amount:
                Number(amountInput.value),

            type:
                typeInput.value,

            category:
                categoryInput.value,

            date:
                dateInput.value

        };


        // =========================
        // UPDATE
        // =========================

        if (editId) {

            transactionData.id =
                Number(editId);


            updateTransaction(
                transactionData
            );


            alert(
                "Transaction Updated Successfully!"
            );

        }


        // =========================
        // ADD
        // =========================

        else {

            transactionData.id =
                Date.now();


            addTransaction(
                transactionData
            );


            alert(
                "Transaction Added Successfully!"
            );

        }


        // Go back to Transactions

        window.location.href =
            "./transactions.html";

    }
);