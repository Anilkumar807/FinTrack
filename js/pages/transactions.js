import {
    getTransactions,
    deleteTransaction
} from "../services/transactionService.js";


const tableBody =
    document.getElementById("transactions-table-body");

const searchInput =
    document.getElementById("search-input");

const typeFilter =
    document.getElementById("type-filter");

const categoryFilter =
    document.getElementById("category-filter");


let transactions = [...getTransactions()].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
);


// =========================
// Render Transactions
// =========================

function renderTransactions(data) {

    tableBody.innerHTML = "";


    data.forEach(transaction => {

        const row =
            document.createElement("tr");


        const amountClass =
            transaction.type === "income"
                ? "amount-positive"
                : "amount-negative";


        const amountSign =
            transaction.type === "income"
                ? "+"
                : "-";


        row.innerHTML = `
            <td>
                ${transaction.date}
            </td>

            <td>
                ${transaction.title}
            </td>

            <td>
                ${transaction.category}
            </td>

            <td>
                ${transaction.type}
            </td>

            <td class="${amountClass}">
                ${amountSign}₹${transaction.amount.toLocaleString("en-IN", {
                    minimumFractionDigits: 2
                })}
            </td>

            <td class="transaction-actions">

                <button
                    class="edit-btn"
                    data-id="${transaction.id}"
                >
                    ✏️
                </button>

                <button
                    class="delete-btn"
                    data-id="${transaction.id}"
                >
                    🗑️
                </button>

            </td>
        `;


        tableBody.appendChild(row);

    });


    addActionListeners();

}


// =========================
// add Action Listeners
// =========================

function addActionListeners() {
    //Edit
    const editButtons =
        document.querySelectorAll(".edit-btn");


    editButtons.forEach(button => {

        button.addEventListener("click", () => {

            const id =
                Number(button.dataset.id);


            window.location.href =
                `./add-transaction.html?edit=${id}`;

        });

    });


    //Delete
    const deleteButtons =
        document.querySelectorAll(".delete-btn");


    deleteButtons.forEach(button => {

        button.addEventListener("click", () => {

            const id =
                Number(button.dataset.id);


            const confirmed =
                confirm(
                    "Are you sure you want to delete this transaction?"
                );


            if (!confirmed) {
                return;
            }


            deleteTransaction(id);


            transactions =
                getTransactions();


            filterTransactions();

        });

    });

}




// =========================
// Load Categories
// =========================

function loadCategories() {

    const categories = [
        ...new Set(
            transactions.map(
                transaction => transaction.category
            )
        )
    ];


    categories.forEach(category => {

        const option =
            document.createElement("option");

        option.value = category;

        option.textContent = category;

        categoryFilter.appendChild(option);

    });

}


// =========================
// Filter Transactions
// =========================

function filterTransactions() {

    const searchText =
        searchInput.value.toLowerCase();

    const selectedType =
        typeFilter.value;

    const selectedCategory =
        categoryFilter.value;


    const filteredTransactions =
        transactions.filter(transaction => {


            const matchesSearch =
                transaction.title
                    .toLowerCase()
                    .includes(searchText);


            const matchesType =
                selectedType === "all"
                    ||
                transaction.type === selectedType;


            const matchesCategory =
                selectedCategory === "all"
                    ||
                transaction.category === selectedCategory;


            return (
                matchesSearch
                &&
                matchesType
                &&
                matchesCategory
            );

        });


    renderTransactions(
        filteredTransactions
    );

}


// =========================
// Events
// =========================

searchInput.addEventListener(
    "input",
    filterTransactions
);


typeFilter.addEventListener(
    "change",
    filterTransactions
);


categoryFilter.addEventListener(
    "change",
    filterTransactions
);


// =========================
// Initial Load
// =========================

loadCategories();

renderTransactions(transactions);