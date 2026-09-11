import {
    addTransaction
} from "../services/transactionService.js";

const STORAGE_KEY = "fintrack_recurring";


/* =========================
   DOM ELEMENTS
========================= */

const recurringList =
    document.getElementById("recurring-list");

const recurringForm =
    document.getElementById("recurring-form");

const recurringModal =
    document.getElementById("recurring-modal");

const addRecurringButton =
    document.getElementById("add-recurring-btn");

const closeRecurringModal =
    document.getElementById("close-recurring-modal");

const modalTitle =
    document.getElementById("recurring-modal-title");


const recurringIncomeElement =
    document.getElementById("recurring-income");

const recurringExpensesElement =
    document.getElementById("recurring-expenses");

const activeRecurringElement =
    document.getElementById("active-recurring");


const nameInput =
    document.getElementById("recurring-name");

const typeInput =
    document.getElementById("recurring-type");

const categoryInput =
    document.getElementById("recurring-category");

const amountInput =
    document.getElementById("recurring-amount");

const frequencyInput =
    document.getElementById("recurring-frequency");

const dateInput =
    document.getElementById("recurring-date");

const searchRecurring =
    document.getElementById(
        "search-recurring"
    );

const clearSearchRecurring =
    document.getElementById(
        "clear-search-recurring"
    );

const recurringCount =
    document.getElementById(
        "recurring-count"
    );


const recurringTypeFilter =
    document.getElementById(
        "recurring-type-filter"
    );


const recurringFrequencyFilter =
    document.getElementById(
        "recurring-frequency-filter"
    );


const resetRecurringButton =
    document.getElementById(
        "reset-recurring-btn"
    );


const dueSoonCard =
    document.getElementById(
        "due-soon-card"
    );

const overdueCard =
    document.getElementById(
        "overdue-card"
    );

const recurringIncomeCard =
    document.getElementById(
        "recurring-income-card"
    );


const recurringExpenseCard =
    document.getElementById(
        "recurring-expense-card"
    );


const activeRecurringCard =
    document.getElementById(
        "active-recurring-card"
    );

let editingRecurringId = null;


/* =========================
   GET RECURRING
========================= */

function getRecurringTransactions() {

    const savedData =
        localStorage.getItem(STORAGE_KEY);

    return savedData
        ? JSON.parse(savedData)
        : [];

}


/* =========================
   SAVE RECURRING
========================= */

function saveRecurringTransactions(data) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );

}
function updateNextPayment() {

    const recurringTransactions =
        getRecurringTransactions();


    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    /* Get upcoming transactions */

    const upcomingTransactions =
        recurringTransactions
            .filter(item => {

                const dueDate =
                    new Date(item.nextDate);

                dueDate.setHours(
                    0,
                    0,
                    0,
                    0
                );


                return dueDate >= today;

            });


    /* No upcoming transactions */

    if (upcomingTransactions.length === 0) {

        document.getElementById(
            "next-payment-name"
        ).textContent =
            "No upcoming payments";


        document.getElementById(
            "next-payment-details"
        ).textContent =
            "Add a recurring transaction to get started.";


        return;

    }


    /* Sort by nearest date */

    upcomingTransactions.sort(
        (a, b) =>
            new Date(a.nextDate) -
            new Date(b.nextDate)
    );


    const nextPayment =
        upcomingTransactions[0];


    /* Update UI */

    document.getElementById(
        "next-payment-name"
    ).textContent =
        nextPayment.name;


    document.getElementById(
        "next-payment-details"
    ).textContent =
        `${
            nextPayment.type === "income"
                ? "+"
                : "-"
        }₹${Number(
            nextPayment.amount
        ).toLocaleString("en-IN")}
        • Due ${formatDate(nextPayment.nextDate)}`;

}




/* =========================
   RENDER RECURRING
========================= */

function renderRecurringTransactions(filteredTransactions = null) {

    const recurringTransactions =
        filteredTransactions ||
        getRecurringTransactions();


    recurringList.innerHTML = "";


    if (recurringTransactions.length === 0) {

        recurringList.innerHTML = `

            <div class="empty-state">

            <div class="empty-icon">
                📭
            </div>

                <h3>No Recurring Transactions</h3>

                <p>
                     Try changing your search or filters..
                </p>

            </div>

        `;
        return;

    }

    let countText =
                `Showing ${recurringTransactions.length} recurring transaction${
                    recurringTransactions.length === 1
                        ? ""
                        : "s"
                }`;


            /* Show active type filter */

           if (recurringTypeFilter.value !== "all") {

                const type =
                    recurringTypeFilter.value
                        .charAt(0)
                        .toUpperCase()
                    +
                    recurringTypeFilter.value.slice(1);


                countText +=
                    ` · ${type}`;

            }


            /* Show active frequency filter */

            if (recurringFrequencyFilter.value !== "all") {

                countText +=
                    ` · ${
                        recurringFrequencyFilter.value
                    }`;

            }
            if (searchRecurring.value.trim() !== "") {
                    countText +=
                        ` · Search: "${searchRecurring.value.trim()}"`;
                }


            recurringCount.textContent =
                countText;


    recurringTransactions.forEach(item => {

        const recurringCard =
            document.createElement("div");

        recurringCard.className =
            "recurring-card";
            
            const icon =
            item.type === "income"
                ? "↑"
                : "↓";
            const today = new Date();
                today.setHours(0, 0, 0, 0);


                const dueDate =
                    new Date(item.nextDate);

                dueDate.setHours(0, 0, 0, 0);


                const difference =
                    Math.ceil(
                        (dueDate - today) /
                        (1000 * 60 * 60 * 24)
                    );


                let dueStatus = "";
                let dueStatusClass = "";


                if (difference < 0) {

                    dueStatus = "Overdue";
                    dueStatusClass = "overdue";

                }

                else if (difference <= 3) {

                    dueStatus = "Due Soon";
                    dueStatusClass = "due-soon";

                }

                else {

                    dueStatus = "Upcoming";
                    dueStatusClass = "upcoming";

                }

        recurringCard.innerHTML = `

                <div class="recurring-card-header">

                    <div class="recurring-title">

                        <div class="
                            recurring-icon
                            ${item.type}
                        ">
                            ${icon}
                        </div>


                        <div>

                            <h3>
                                ${item.name}
                            </h3>

                            <p>
                                ${item.category}
                                •
                                ${item.frequency}
                            </p>

                        </div>

                    </div>


                    <span
                        class="recurring-type ${item.type}"
                    >
                        ${item.type}
                    </span>

                </div>


                <div class="recurring-card-body">

                    <strong
                        class="${
                            item.type === "income"
                                ? "amount-positive"
                                : "amount-negative"
                        }"
                    >
                        ${
                            item.type === "income"
                                ? "+"
                                : "-"
                        }₹${Number(
                            item.amount
                        ).toLocaleString("en-IN")}
                    </strong>


                    <p>
                        📅 Next due:
                        ${formatDate(item.nextDate)}
                    </p>

                    <span class="due-status ${dueStatusClass}">
                        ${dueStatus}
                    </span>

                </div>


                <div class="recurring-card-actions">

                    <button
                        class="edit-recurring-btn"
                        data-id="${item.id}"
                    >
                        ✏️ Edit
                    </button>


                    <button
                        class="delete-recurring-btn"
                        data-id="${item.id}"
                    >
                        🗑 Delete
                    </button>

                </div>

            `;


        recurringList.appendChild(
            recurringCard
        );

    });


    updateRecurringSummary(
        recurringTransactions
    );

}


function getMonthlyEstimate(
    amount,
    frequency
) {

    if (frequency === "daily") {

        return amount * 30;

    }

    else if (frequency === "weekly") {

        return amount * 4.33;

    }

    else if (frequency === "monthly") {

        return amount;

    }

    else if (frequency === "yearly") {

        return amount / 12;

    }


    return 0;

}


/* =========================
   UPDATE SUMMARY
========================= */

function updateRecurringSummary(data = getRecurringTransactions()) {

    const recurringTransactions = data;

    const income =
        data
            .filter(item =>
                item.type === "income"
            )
            .reduce(
                (total, item) =>
                    total + Number(item.amount),
                0
            );


    const expenses =
        data
            .filter(item =>
                item.type === "expense"
            )
            .reduce(
                (total, item) =>
                    total + Number(item.amount),
                0
            );

    const today = new Date();

        today.setHours(0, 0, 0, 0);


        const dueSoonCount =
            recurringTransactions.filter(item => {

                const dueDate =
                    new Date(item.nextDate);

                dueDate.setHours(0, 0, 0, 0);


                const difference =
                    Math.ceil(
                        (dueDate - today) /
                        (1000 * 60 * 60 * 24)
                    );


                return (
                    difference >= 0 &&
                    difference <= 7
                );

            }).length;
    const overdueCount =
        recurringTransactions.filter(item => {

            const dueDate =
                new Date(item.nextDate);

            dueDate.setHours(
                0,
                0,
                0,
                0
            );
        return dueDate < today;
    }).length;
    const upcomingPayments =
    recurringTransactions.filter(item => {

        const dueDate =
            new Date(item.nextDate);

        dueDate.setHours(
            0,
            0,
            0,
            0
        );


        const difference =
            Math.ceil(
                (dueDate - today) /
                (1000 * 60 * 60 * 24)
            );


        return (
            difference >= 0 &&
            difference <= 30
        );

    }).length;
    

    let monthlyIncome = 0;

        let monthlyExpenses = 0;


        recurringTransactions.forEach(item => {

            const monthlyAmount =
                getMonthlyEstimate(
                    Number(item.amount),
                    item.frequency
                );


            if (item.type === "income") {

                monthlyIncome +=
                    monthlyAmount;

            }

            else if (item.type === "expense") {

                monthlyExpenses +=
                    monthlyAmount;

            }

        });

        const monthlyNetCashFlow =monthlyIncome - monthlyExpenses;

        const monthlyNetCashFlowElement =
            document.getElementById(
                "monthly-net-cashflow"
            );


        monthlyNetCashFlowElement.textContent =
            `${
                monthlyNetCashFlow >= 0
                    ? "+"
                    : "-"
            }₹${Math.abs(
                Math.round(monthlyNetCashFlow)
            ).toLocaleString("en-IN")}`;

        monthlyNetCashFlowElement.style.color =
        monthlyNetCashFlow >= 0
            ? "#16a34a"
            : "#dc2626";

        const monthlySavingsRate =
        monthlyIncome > 0
            ? (
                monthlyNetCashFlow /
                monthlyIncome
            ) * 100
            : 0;

        const monthlySavingsRateElement =
            document.getElementById(
                "monthly-savings-rate"
            );


        monthlySavingsRateElement.textContent =
            `${Math.round(
                monthlySavingsRate
            )}%`;

        monthlySavingsRateElement.style.color =
            monthlySavingsRate >= 0
                ? "#16a34a"
                : "#dc2626";

        document.getElementById(
            "monthly-recurring-income"
        ).textContent =
            `₹${Math.round(
                monthlyIncome
            ).toLocaleString("en-IN")}`;

        document.getElementById(
        "monthly-recurring-expenses"
    ).textContent =
        `₹${Math.round(
            monthlyExpenses
        ).toLocaleString("en-IN")}`;

     

    document.getElementById("upcoming-payments").textContent =upcomingPayments;

    document.getElementById("due-soon-count").textContent = dueSoonCount;
  
    document.getElementById("overdue-count").textContent = overdueCount;
    recurringIncomeElement.textContent =
        `₹${income.toLocaleString("en-IN")}`;


    recurringExpensesElement.textContent =
        `₹${expenses.toLocaleString("en-IN")}`;


    activeRecurringElement.textContent =
        data.length;

}


/* =========================
   FORMAT DATE
========================= */

function formatDate(date) {

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================
   OPEN ADD MODAL
========================= */

addRecurringButton.addEventListener(
    "click",
    () => {

        editingRecurringId = null;

        recurringForm.reset();

        modalTitle.textContent =
            "Add Recurring Transaction";


        recurringModal.classList.add(
            "show"
        );

    }
);


dueSoonCard.addEventListener(
    "click",
    () => {

        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );


        const dueSoonTransactions =
                    getRecurringTransactions()
                        .filter(item => {

                            const dueDate =
                                new Date(item.nextDate);

                            dueDate.setHours(
                                0,
                                0,
                                0,
                                0
                            );


                            const difference =
                                Math.ceil(
                                    (dueDate - today) /
                                    (1000 * 60 * 60 * 24)
                                );


                            return (
                                difference >= 0 &&
                                difference <= 3
                            );

                        });


                renderRecurringTransactions(
                    dueSoonTransactions
                );

            }
        );
    
    overdueCard.addEventListener(
            "click",
            () => {

                const today = new Date();

                today.setHours(
                    0,
                    0,
                    0,
                    0
                );


                const overdueTransactions =
                    getRecurringTransactions()
                        .filter(item => {

                            const dueDate =
                                new Date(item.nextDate);

                            dueDate.setHours(
                                0,
                                0,
                                0,
                                0
                            );


                            return dueDate < today;

                        });


                renderRecurringTransactions(
                    overdueTransactions
                );

            }
        );


        recurringIncomeCard.addEventListener(
    "click",
    () => {

        const incomeTransactions =
            getRecurringTransactions()
                .filter(
                    item =>
                        item.type === "income"
                );


        renderRecurringTransactions(
            incomeTransactions
        );

    }
);

recurringExpenseCard.addEventListener(
    "click",
    () => {

        const expenseTransactions =
            getRecurringTransactions()
                .filter(
                    item =>
                        item.type === "expense"
                );


        renderRecurringTransactions(
            expenseTransactions
        );

    }
);

activeRecurringCard.addEventListener(
    "click",
    () => {

        renderRecurringTransactions(
            getRecurringTransactions()
        );

    }
);
/* =========================
   CLOSE MODAL
========================= */

closeRecurringModal.addEventListener(
    "click",
    () => {

        recurringModal.classList.remove(
            "show"
        );

    }
);


recurringModal.addEventListener(
    "click",
    event => {

        if (event.target === recurringModal) {

            recurringModal.classList.remove(
                "show"
            );

        }

    }
);


/* =========================
   SAVE / UPDATE
========================= */

recurringForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const recurringTransactions =
            getRecurringTransactions();


        const recurringData = {

            id: editingRecurringId
                ? editingRecurringId
                : Date.now(),

            name:
                nameInput.value.trim(),

            type:
                typeInput.value,

            category:
                categoryInput.value,

            amount:
                Number(amountInput.value),

            frequency:
                frequencyInput.value,

            nextDate:
                dateInput.value

        };


        if (editingRecurringId) {

            const index =
                recurringTransactions.findIndex(
                    item =>
                        item.id == editingRecurringId
                );


            recurringTransactions[index] =
                recurringData;


            saveRecurringTransactions(
                recurringTransactions
            );


            showSuccessMessage(
                "Recurring transaction updated successfully!"
            );

        }

        else {

            recurringTransactions.push(
                recurringData
            );


            saveRecurringTransactions(
                recurringTransactions
            );


            showSuccessMessage(
                "Recurring transaction added successfully!"
            );

        }


        recurringModal.classList.remove(
            "show"
        );


        recurringForm.reset();


        editingRecurringId = null;


        renderRecurringTransactions();


        updateRecurringSummary();

        updateNextPayment();

    }
);

/* =========================
   EDIT / DELETE
========================= */

document.addEventListener(
    "click",
    event => {

        const editButton =
            event.target.closest(
                ".edit-recurring-btn"
            );


        const deleteButton =
            event.target.closest(
                ".delete-recurring-btn"
            );


        /* EDIT */

        if (editButton) {

            const id =
                editButton.dataset.id;


            const recurringTransactions =
                getRecurringTransactions();


            const item =
                recurringTransactions.find(
                    item =>
                        item.id == id
                );


            if (!item) {
                return;
            }


            editingRecurringId =
                item.id;


            nameInput.value =
                item.name;

            typeInput.value =
                item.type;

            categoryInput.value =
                item.category;

            amountInput.value =
                item.amount;

            frequencyInput.value =
                item.frequency;

            dateInput.value =
                item.nextDate;


            modalTitle.textContent =
                "Edit Recurring Transaction";


            recurringModal.classList.add(
                "show"
            );
           
        }


        /* DELETE */

    

        if (deleteButton) {

            const id =
                deleteButton.dataset.id;


            const recurringTransactions =
                getRecurringTransactions();


            const selectedTransaction =
                recurringTransactions.find(
                    item =>
                        item.id == id
                );


            const confirmed =
                confirm(
                    `Are you sure you want to delete "${
                        selectedTransaction?.name || "this transaction"
                    }"?`
                );


            if (!confirmed) {
                return;
            }


            const updatedTransactions =
                recurringTransactions.filter(
                    item =>
                        item.id != id
                );


            saveRecurringTransactions(
                updatedTransactions
            );


            renderRecurringTransactions();

            updateRecurringSummary();

            updateNextPayment();

            showSuccessMessage(
                "Recurring transaction deleted successfully!"
            );

        }

    }
);

function showSuccessMessage(message) {

    const successMessage =
        document.getElementById(
            "success-message"
        );


    if (!successMessage) {

        return;

    }


    successMessage.textContent =
        message;


    successMessage.classList.add(
        "show"
    );


    setTimeout(
        () => {

            successMessage.classList.remove(
                "show"
            );

        },
        3000
    );

}

function filterRecurringTransactions() {

    const searchValue =
        searchRecurring.value
            .toLowerCase()
            .trim();


    const typeValue =
        recurringTypeFilter.value;


    const frequencyValue =
        recurringFrequencyFilter.value;


    let filteredTransactions =
        getRecurringTransactions();


    /* Search */

    filteredTransactions =
        filteredTransactions.filter(
            item =>
                item.name
                    .toLowerCase()
                    .includes(searchValue)
        );


    /* Type */

    if (typeValue !== "all") {

        filteredTransactions =
            filteredTransactions.filter(
                item =>
                    item.type === typeValue
            );

    }


    /* Frequency */

    if (frequencyValue !== "all") {

        filteredTransactions =
            filteredTransactions.filter(
                item =>
                    item.frequency.toLowerCase() ===
                    frequencyValue
            );

    }


    renderRecurringTransactions(
        filteredTransactions
    );

}

searchRecurring.addEventListener(
    "input",
    () => {

        clearSearchRecurring.classList.toggle(
            "show",
            searchRecurring.value.trim() !== ""
        );

        filterRecurringTransactions();

    }
);

clearSearchRecurring.addEventListener(
    "click",
    () => {

        searchRecurring.value = "";

        clearSearchRecurring.classList.remove(
            "show"
        );

        renderRecurringTransactions();

        searchRecurring.focus();

    }
);



recurringTypeFilter.addEventListener(
    "change",
    filterRecurringTransactions
);


recurringFrequencyFilter.addEventListener(
    "change",
    filterRecurringTransactions
);


resetRecurringButton.addEventListener(
    "click",
    () => {
    searchRecurring.value = "";
        clearSearchRecurring.classList.remove(
            "show"
        );
        searchRecurring.value = "";

        recurringTypeFilter.value = "all";

        recurringFrequencyFilter.value = "all";


        renderRecurringTransactions();

    }
);

function getNextRecurringDate(
    currentDate,
    frequency
) {

    const nextDate =
        new Date(currentDate);


    if (frequency === "daily") {

        nextDate.setDate(
            nextDate.getDate() + 1
        );

    }

    else if (frequency === "weekly") {

        nextDate.setDate(
            nextDate.getDate() + 7
        );

    }

    else if (frequency === "monthly") {

        const originalDay =
            nextDate.getDate();


        /* Go to first day first */

        nextDate.setDate(1);


        /* Move to next month */

        nextDate.setMonth(
            nextDate.getMonth() + 1
        );


        /* Get last day of that month */

        const lastDay =
            new Date(
                nextDate.getFullYear(),
                nextDate.getMonth() + 1,
                0
            ).getDate();


        /* Use original day or last available day */

        nextDate.setDate(
            Math.min(
                originalDay,
                lastDay
            )
        );

    }

    else if (frequency === "yearly") {

        nextDate.setFullYear(
            nextDate.getFullYear() + 1
        );

    }


    return nextDate;

}
function processRecurringTransactions() {

    const recurringTransactions =
        getRecurringTransactions();

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    let hasChanges = false;

    recurringTransactions.forEach(item => {
        let nextDate =
            new Date(item.nextDate);
        nextDate.setHours(
            0,
            0,
            0,
            0
        );

        /* =========================
           PROCESS MISSED DATES
        ========================= */
        while (nextDate <= today) {
            const transactionDate =
                nextDate
                    .toISOString()
                    .split("T")[0];
            /* =========================
               CREATE MAIN TRANSACTION
            ========================= */
            const newTransaction = {
                id:
                    Date.now() +
                    Math.floor(
                        Math.random() * 100000
                    ),
                title:
                    item.name,
                category:
                    item.category,
                type:
                    item.type,
                amount:
                    Number(item.amount),
                date:
                    transactionDate
            };
            /* =========================
               ADD TO TRANSACTIONS
            ========================= */
            addTransaction(
                newTransaction
            );


            /* =========================
               CALCULATE NEXT DATE
            ========================= */

            const updatedDate =
                getNextRecurringDate(
                    nextDate,
                    item.frequency
                );


            /* Safety check */

            if (
                updatedDate.getTime() ===
                nextDate.getTime()
            ) {

                break;

            }


            nextDate =
                updatedDate;


            hasChanges = true;

        }


        /* =========================
           UPDATE RECURRING DATE
        ========================= */

        item.nextDate =
            nextDate
                .toISOString()
                .split("T")[0];

    });


    /* =========================
       SAVE UPDATED DATA
    ========================= */

    if (hasChanges) {

        saveRecurringTransactions(
            recurringTransactions
        );

    }
    

}

/* =========================
   INITIAL LOAD
========================= */
processRecurringTransactions();

renderRecurringTransactions();

updateRecurringSummary();

updateNextPayment();