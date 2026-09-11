import {
    getTransactions
} from "../services/transactionService.js";


const STORAGE_KEY = "fintrack_budgets";


const budgetsList =
    document.getElementById("budgets-page-list");

const totalBudgetElement =
    document.getElementById("total-budget");

const totalSpentElement =
    document.getElementById("total-spent");

const remainingBudgetElement =
    document.getElementById("remaining-budget");


const addBudgetButton =
    document.getElementById("add-budget-btn");

const budgetModal =
    document.getElementById("budget-modal");

const closeBudgetModal =
    document.getElementById("close-budget-modal");

let editingBudgetId = null;

const budgetForm =
    document.getElementById("budget-form");

const budgetCategory =
    document.getElementById("budget-category");

const budgetAmount =
    document.getElementById("budget-amount");



/* =========================
   LOAD BUDGETS
========================= */

function getBudgets() {

    const savedBudgets =
        localStorage.getItem(STORAGE_KEY);


    if (!savedBudgets) {
        return [];
    }


    return JSON.parse(savedBudgets);
}



/* =========================
   SAVE BUDGETS
========================= */

function saveBudgets(budgets) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(budgets)
    );

}



/* =========================
   GET CATEGORY SPENDING
========================= */

function getCategorySpending(
    category,
    transactions
) {

    return transactions
        .filter(transaction =>
            transaction.type === "expense" &&
            transaction.category === category
        )
        .reduce(
            (total, transaction) =>
                total + Number(transaction.amount),
            0
        );

}



/* =========================
   RENDER BUDGETS
========================= */

function renderBudgets() {

    const budgets = getBudgets();

    const transactions =
        getTransactions();


    budgetsList.innerHTML = "";


    if (budgets.length === 0) {

        budgetsList.innerHTML = `

            <div class="empty-state">

                <h3>
                    No Budgets Yet
                </h3>

                <p>
                    Create a budget to start tracking your spending.
                </p>

            </div>

        `;


        updateSummary(
            0,
            0
        );

        return;
    }


    let totalBudget = 0;

    let totalSpent = 0;


    budgets.forEach(budget => {

        const spending =
            getCategorySpending(
                budget.category,
                transactions
            );


        const percentage =
            (spending / budget.amount) * 100;


        const progress =
            Math.min(percentage, 100);


        const remaining =
            budget.amount - spending;


        totalBudget +=
            Number(budget.amount);


        totalSpent += spending;


        const budgetCard =
            document.createElement("div");


        budgetCard.className =
            "budget-page-card";


        budgetCard.innerHTML = `

            <div class="budget-page-header">

                <div>

                    <h3>
                        ${budget.category}
                    </h3>

                    <p>
                        ₹${spending.toLocaleString("en-IN")}
                        spent of
                        ₹${Number(
                            budget.amount
                        ).toLocaleString("en-IN")}
                    </p>

                </div>

                <button
                    class="edit-budget-btn"
                    data-id="${budget.id}"
                >
                    Edit
                </button>


                <button
                    class="delete-budget-btn"
                    data-id="${budget.id}"
                >
                    Delete
                </button>

            </div>


            <div class="budget-page-progress">

                <div
                    class="budget-page-progress-fill"
                    style="width: ${progress}%"
                ></div>

            </div>


            <div class="budget-page-footer">

                <span>
                    ${Math.round(percentage)}% Used
                </span>

                <span>
                    ₹${Math.max(
                        remaining,
                        0
                    ).toLocaleString("en-IN")}
                    Remaining
                </span>

            </div>

        `;


        budgetsList.appendChild(
            budgetCard
        );

    });


    updateSummary(
        totalBudget,
        totalSpent
    );


    addDeleteListeners();

}



/* =========================
   Edit SUMMARY
========================= */

document.addEventListener(
    "click",
    event => {

        const editButton =
            event.target.closest(".edit-budget-btn");

        if (!editButton) {
            return;
        }

        const budgetId =
            editButton.dataset.id;

        const budget =
            budgets.find(
                item => item.id == budgetId
            );

        if (!budget) {
            return;
        }

        editingBudgetId = budgetId;

        categorySelect.value =
            budget.category;

        budgetAmountInput.value =
            budget.budget;

        budgetModal.classList.add("show");

    }
);


/* =========================
   UPDATE SUMMARY
========================= */

function updateSummary(
    totalBudget,
    totalSpent
) {

    const remaining =
        totalBudget - totalSpent;


    totalBudgetElement.textContent =
        `₹${totalBudget.toLocaleString("en-IN")}`;


    totalSpentElement.textContent =
        `₹${totalSpent.toLocaleString("en-IN")}`;


    remainingBudgetElement.textContent =
        `₹${remaining.toLocaleString("en-IN")}`;

}



/* =========================
   DELETE BUDGET
========================= */

function addDeleteListeners() {

    const deleteButtons =
        document.querySelectorAll(
            ".delete-budget-btn"
        );


    deleteButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const budgetId =
                    Number(
                        button.dataset.id
                    );


                let budgets =
                    getBudgets();


                budgets =
                    budgets.filter(
                        budget =>
                            budget.id !== budgetId
                    );


                saveBudgets(budgets);


                renderBudgets();

            }
        );

    });

}



/* =========================
   ADD BUDGET
========================= */

budgetForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const category =
            budgetCategory.value;


        const amount =
            Number(
                budgetAmount.value
            );


        if (!category || amount <= 0) {
            return;
        }


        const budgets =
            getBudgets();


        /* =========================
           EDIT EXISTING BUDGET
        ========================= */

        if (editingBudgetId) {

            const budget =
                budgets.find(
                    budget =>
                        budget.id == editingBudgetId
                );


            if (budget) {

                budget.category =
                    category;

                budget.amount =
                    amount;

            }


            editingBudgetId = null;

        }


        /* =========================
           ADD NEW BUDGET
        ========================= */

        else {

            const existingBudget =
                budgets.find(
                    budget =>
                        budget.category === category
                );


            if (existingBudget) {

                alert(
                    "A budget already exists for this category."
                );

                return;

            }


            const newBudget = {

                id: Date.now(),

                category: category,

                amount: amount

            };


            budgets.push(
                newBudget
            );

        }


        /* =========================
           SAVE BUDGETS
        ========================= */

        saveBudgets(
            budgets
        );


        budgetForm.reset();


        budgetModal.classList.remove(
            "show"
        );


        renderBudgets();

    }
);


/* =========================
   MODAL EVENTS
========================= */

addBudgetButton.addEventListener(
    "click",
    () => {

        budgetModal.classList.add(
            "show"
        );

    }
);


closeBudgetModal.addEventListener(
    "click",
    () => {

        budgetModal.classList.remove(
            "show"
        );

    }
);


budgetModal.addEventListener(
    "click",
    event => {

        if (event.target === budgetModal) {

            budgetModal.classList.remove(
                "show"
            );

        }

    }
);



/* =========================
   INITIAL LOAD
========================= */

renderBudgets();