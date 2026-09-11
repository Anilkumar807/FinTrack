import {
    getExpenseTransactions
} from "../services/transactionService.js";


const expenseTableBody =
    document.getElementById(
        "expense-table-body"
    );


const expenseTotalElement =
    document.getElementById(
        "expense-total"
    );


const expenseCountElement =
    document.getElementById(
        "expense-count"
    );


const searchInput =
    document.getElementById(
        "expense-search"
    );


const categoryFilter =
    document.getElementById(
        "expense-category-filter"
    );


let expenseTransactions =
    getExpenseTransactions();



/* =========================
   RENDER EXPENSES
========================= */

function renderExpenses(
    transactionsToRender
) {

    expenseTableBody.innerHTML = "";


    transactionsToRender.forEach(
        transaction => {

            const row =
                document.createElement("tr");


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


                <td class="amount-negative">

                    -₹${transaction.amount.toLocaleString(
                        "en-IN"
                    )}

                </td>


                <td>

                    <button
                        class="edit-btn"
                    >
                        Edit
                    </button>

                </td>

            `;


            expenseTableBody.appendChild(
                row
            );

        }
    );


    updateExpenseStats(
        transactionsToRender
    );

}



/* =========================
   UPDATE STATISTICS
========================= */

function updateExpenseStats(
    transactionsToCalculate
) {

    const totalExpenses =
        transactionsToCalculate.reduce(
            (total, transaction) =>
                total + transaction.amount,
            0
        );


    expenseTotalElement.textContent =
        `₹${totalExpenses.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2
            }
        )}`;


    expenseCountElement.textContent =
        transactionsToCalculate.length;

}



/* =========================
   LOAD CATEGORIES
========================= */

function loadCategories() {

    const categories =
        [
            ...new Set(
                expenseTransactions.map(
                    transaction =>
                        transaction.category
                )
            )
        ];


    categories.forEach(category => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            category;


        option.textContent =
            category;


        categoryFilter.appendChild(
            option
        );

    });

}



/* =========================
   SEARCH + FILTER
========================= */

function updateExpenseDisplay() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const category =
        categoryFilter.value;


    let filteredExpenses =
        expenseTransactions.filter(
            transaction =>
                transaction.title
                    .toLowerCase()
                    .includes(searchText)
        );


    if (category !== "all") {

        filteredExpenses =
            filteredExpenses.filter(
                transaction =>
                    transaction.category ===
                    category
            );

    }


    renderExpenses(
        filteredExpenses
    );

}



/* =========================
   EVENT LISTENERS
========================= */

searchInput.addEventListener(
    "input",
    updateExpenseDisplay
);


categoryFilter.addEventListener(
    "change",
    updateExpenseDisplay
);



/* =========================
   INITIAL LOAD
========================= */

loadCategories();

renderExpenses(
    expenseTransactions
);