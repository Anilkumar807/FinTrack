import {
    getIncomeTransactions
} from "../services/transactionService.js";


const incomeTableBody =
    document.getElementById(
        "income-table-body"
    );


const incomeTotalElement =
    document.getElementById(
        "income-total"
    );


const incomeCountElement =
    document.getElementById(
        "income-count"
    );


const searchInput =
    document.getElementById(
        "income-search"
    );


const categoryFilter =
    document.getElementById(
        "income-category-filter"
    );


let incomeTransactions =
    getIncomeTransactions();



function renderIncome(
    transactionsToRender
) {

    incomeTableBody.innerHTML = "";


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


                <td class="amount-positive">

                    +₹${transaction.amount.toLocaleString(
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


            incomeTableBody.appendChild(
                row
            );

        }
    );


    updateIncomeStats(
        transactionsToRender
    );

}



function updateIncomeStats(
    transactionsToCalculate
) {

    const totalIncome =
        transactionsToCalculate.reduce(
            (total, transaction) =>
                total +
                transaction.amount,
            0
        );


    incomeTotalElement.textContent =
        `₹${totalIncome.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2
            }
        )}`;


    incomeCountElement.textContent =
        transactionsToCalculate.length;

}



function loadCategories() {

    const categories =
        [
            ...new Set(
                incomeTransactions.map(
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



function updateIncomeDisplay() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const category =
        categoryFilter.value;


    let filteredIncome =
        incomeTransactions.filter(
            transaction =>
                transaction.title
                    .toLowerCase()
                    .includes(searchText)
        );


    if (category !== "all") {

        filteredIncome =
            filteredIncome.filter(
                transaction =>
                    transaction.category ===
                    category
            );

    }


    renderIncome(
        filteredIncome
    );

}



searchInput.addEventListener(
    "input",
    updateIncomeDisplay
);


categoryFilter.addEventListener(
    "change",
    updateIncomeDisplay
);



loadCategories();

renderIncome(
    incomeTransactions
);