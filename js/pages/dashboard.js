import {
    getTransactions,
    getIncomeTransactions,
    getExpenseTransactions
} from "../services/transactionService.js";

const storedGoals =
    localStorage.getItem("fintrack_goals");

const goals =
    storedGoals
        ? JSON.parse(storedGoals)
        : [];

import {
    calculateTotalIncome,
    calculateTotalExpenses,
    calculateBalance
} from "../calculations/transactionCalculations.js";

import { budgets } from "../../data/budgets.js";

import {
    calculateCategorySpending,
    calculateBudgetPercentage,
    calculateRemainingBudget
} from "../calculations/budgetCalculations.js";

export function loadDashboard() {

    const transactions = getTransactions();

    const incomeTransactions = getIncomeTransactions();

    const expenseTransactions = getExpenseTransactions();


    // Calculate totals

    const totalIncome = calculateTotalIncome(
        transactions
    );

    const totalExpenses = calculateTotalExpenses(
        transactions
    );

    const balance = calculateBalance(
        transactions
    );

    const savings = balance;


    // Find dashboard elements

    const balanceElement =
        document.getElementById("total-balance");

    const incomeElement =
        document.getElementById("total-income");

    const expensesElement =
        document.getElementById("total-expenses");

    const savingsElement =
        document.getElementById("total-savings");


    // Update dashboard

    balanceElement.textContent =
        `₹${balance.toLocaleString("en-IN", {
            minimumFractionDigits: 2
        })}`;

    incomeElement.textContent =
        `₹${totalIncome.toLocaleString("en-IN", {
            minimumFractionDigits: 2
        })}`;

    expensesElement.textContent =
        `₹${totalExpenses.toLocaleString("en-IN", {
            minimumFractionDigits: 2
        })}`;

    savingsElement.textContent =
    `₹${savings.toLocaleString("en-IN", {
        minimumFractionDigits: 2
    })}`;


    console.log("Dashboard Updated");

    console.log("Balance:", balance);

    console.log("Income:", totalIncome);

    console.log("Expenses:", totalExpenses);

    console.log("Savings:", savings);

    renderRecentTransactions(transactions);
    renderExpenseBreakdown(transactions);
    renderBudgets(transactions);
    renderMonthlyTrend(transactions);
    renderSavingsGoal();
}
function renderRecentTransactions(transactions) {

    const transactionList =
        document.getElementById("transaction-list");

     if (!transactionList) {
        return;
    }
    transactionList.innerHTML = "";


   
    const recentTransactions =
        [...transactions]
            .sort(
                (a, b) =>
                    new Date(b.date) -
                    new Date(a.date)
            )
            .slice(0, 5);


    recentTransactions.forEach(transaction => {
        const transactionItem =
            document.createElement("div");

        transactionItem.classList.add(
            "transaction-item"
        );


        const iconClass =
            transaction.type === "income"
                ? "income"
                : transaction.category === "Food & Dining"
                    ? "food"
                    : transaction.category === "Utilities"
                        ? "utility"
                        : "transport";


        const icon =
            transaction.type === "income"
                ? "💰"
                : transaction.category === "Food & Dining"
                    ? "🍔"
                    : transaction.category === "Utilities"
                        ? "💡"
                        : "🚗";


        const amountClass =
            transaction.type === "income"
                ? "amount-positive"
                : "amount-negative";


        const amountSign =
            transaction.type === "income"
                ? "+"
                : "-";


        transactionItem.innerHTML = `
            <div class="transaction-icon ${iconClass}">
                ${icon}
            </div>

            <div class="transaction-details">
                <p>${transaction.title}</p>

                <small>
                    ${transaction.category}
                    • ${transaction.date}
                </small>
            </div>

            <strong class="${amountClass}">
                ${amountSign}₹${transaction.amount.toLocaleString("en-IN", {
                    minimumFractionDigits: 2
                })}
            </strong>
        `;


        transactionList.appendChild(
            transactionItem
        );

    });
}
function renderExpenseBreakdown(transactions) {

    const expenseTransactions =
        transactions.filter(
            transaction => transaction.type === "expense"
        );


    const totalExpenses =
        expenseTransactions.reduce(
            (total, transaction) =>
                total + transaction.amount,
            0
        );


    const categoryTotals = {};


    expenseTransactions.forEach(transaction => {

        const category = transaction.category;

        if (!categoryTotals[category]) {
            categoryTotals[category] = 0;
        }

        categoryTotals[category] += transaction.amount;
    });

            console.log(
            "Category Totals:",
            categoryTotals
        );



    // Update center total

    const expenseTotalElement =
        document.getElementById("expense-total");

    if (expenseTotalElement) {

        expenseTotalElement.textContent =
            `₹${totalExpenses.toLocaleString("en-IN")}`;

    }


    // Reset all displayed category amounts to zero

    const categoryElements =
        document.querySelectorAll("[data-category]");

    categoryElements.forEach(element => {
        element.textContent = "₹0";
    });


    // Update category amounts

    Object.entries(categoryTotals).forEach(
        ([category, amount]) => {

            const element =
                document.querySelector(
                    `[data-category="${category}"]`
                );

            if (element) {

                element.textContent =
                    `₹${amount.toLocaleString("en-IN")}`;

            }

        }
    );


    // =========================
    // Dynamic Donut Chart
    // =========================

    const donutChart =
        document.querySelector(".donut-chart");


    if (!donutChart) {
        return;
    }


    if (totalExpenses === 0) {

        donutChart.style.background =
            "#e5e7eb";

        return;

    }


    const categoryColors = {

        "Housing": "#10b981",

        "Food & Dining": "#f59e0b",

        "Transport": "#ef4444",

        "Utilities": "#3b82f6",

        "Shopping": "#8b5cf6",

        "Entertainment": "#06b6d4",

        "Health": "#ec4899",

        "Others": "#94a3b8"

    };


    let currentPercentage = 0;

    const gradientParts = [];


    Object.entries(categoryTotals).forEach(
        ([category, amount]) => {

            const percentage =
                (amount / totalExpenses) * 100;


            const start =
                currentPercentage;


            const end =
                currentPercentage + percentage;


            const color =
                categoryColors[category]
                || categoryColors["Others"];


            gradientParts.push(
                `${color} ${start}% ${end}%`
            );


            currentPercentage = end;

        }
    );


    donutChart.style.background =
        `conic-gradient(${gradientParts.join(", ")})`;


    console.log(
        "Dynamic Expense Breakdown:",
        categoryTotals
    );

}

function renderBudgets(transactions) {

    const budgetList =
        document.querySelector(".budget-list");

    if (!budgetList) {
        return;
    }


    budgetList.innerHTML = "";


    budgets.forEach(budgetItem => {

        const spent =
            calculateCategorySpending(
                transactions,
                budgetItem.category
            );


        const percentage =
            calculateBudgetPercentage(
                spent,
                budgetItem.budget
            );


        const remaining =
            calculateRemainingBudget(
                spent,
                budgetItem.budget
            );


        const progress =
            Math.min(percentage, 100);


        const budgetElement =
            document.createElement("div");

        budgetElement.classList.add("budget-item");

        let icon = "📦";

            if (budgetItem.category === "Food & Dining") {
                icon = "🍴";
            } else if (budgetItem.category === "Transport") {
                icon = "🚗";
            } else if (budgetItem.category === "Shopping") {
                icon = "🛍️";
            } else if (budgetItem.category === "Entertainment") {
                icon = "🎬";
            } else if (budgetItem.category === "Utilities") {
                icon = "💡";
            } else if (budgetItem.category === "Health") {
                icon = "❤️";
            } else if (budgetItem.category === "Others") {
                icon = "📦";
            }


        budgetElement.innerHTML = `

            <div class="budget-info">

                <span>${icon}</span>

                <div>

                    <p>
                        ${budgetItem.category}
                    </p>

                    <small>
                        ₹${spent.toLocaleString("en-IN")}
                        /
                        ₹${budgetItem.budget.toLocaleString("en-IN")}
                    </small>

                </div>

                <strong>
                    ${Math.round(percentage)}%
                </strong>

            </div>


            <div class="progress-bar">

                <div
                    class="progress"
                    style="width: ${progress}%"
                ></div>

            </div>

        `;


        budgetList.appendChild(
            budgetElement
        );

    });

}

function renderMonthlyTrend(transactions) {

    const incomeLine =
        document.getElementById("income-line");

    const expenseLine =
        document.getElementById("expense-line");

    const periodSelect =
        document.getElementById("trend-period");

    const yAxis =
        document.getElementById("chart-y-axis");


    if (!incomeLine || !expenseLine || !periodSelect) {
        return;
    }


    function updateChart() {

        const selectedPeriod =
            periodSelect.value;


        const currentYear =
            new Date().getFullYear();


        const selectedYear =
            selectedPeriod === "this-year"
                ? currentYear
                : currentYear - 1;


        // =========================
        // Monthly data
        // =========================

        const monthlyIncome =
            Array(12).fill(0);

        const monthlyExpenses =
            Array(12).fill(0);


        transactions.forEach(transaction => {

            const date =
                new Date(transaction.date);


            const transactionYear =
                date.getFullYear();


            // Only selected year

            if (transactionYear !== selectedYear) {
                return;
            }


            const month =
                date.getMonth();


            if (transaction.type === "income") {

                monthlyIncome[month] +=
                    transaction.amount;

            } else {

                monthlyExpenses[month] +=
                    transaction.amount;

            }

        });


        // =========================
        // Find maximum value
        // =========================

        const largestValue =
            Math.max(
                ...monthlyIncome,
                ...monthlyExpenses,
                0
            );


        // Round maximum value
        // to nearest 20,000

        let chartMax =
            Math.ceil(largestValue / 20000) * 20000;


        // Minimum chart height

        if (chartMax < 20000) {
            chartMax = 20000;
        }


        // =========================
        // Update Y Axis
        // =========================

        if (yAxis) {

            yAxis.innerHTML = "";


            for (
                let value = chartMax;
                value >= 0;
                value -= chartMax / 5
            ) {

                const span =
                    document.createElement("span");


                if (value >= 1000) {

                    span.textContent =
                        `${Math.round(value / 1000)}K`;

                } else {

                    span.textContent =
                        Math.round(value);

                }


                yAxis.appendChild(span);

            }

        }


        // =========================
        // SVG settings
        // =========================

        const width = 500;
        const height = 200;


        // =========================
        // Create SVG points
        // =========================

        function createPoints(values) {

            return values
                .map((value, index) => {

                    const x =
                        (index / 11) * width;


                    const y =
                        height -
                        (value / chartMax) *
                        height;


                    return `${x},${y}`;

                })
                .join(" ");

        }


        // =========================
        // Update Income line
        // =========================

        incomeLine.setAttribute(
            "points",
            createPoints(monthlyIncome)
        );


        // =========================
        // Update Expense line
        // =========================

        expenseLine.setAttribute(
            "points",
            createPoints(monthlyExpenses)
        );


        console.log(
            `Monthly Trend - ${selectedYear}`
        );

        console.log(
            "Income:",
            monthlyIncome
        );

        console.log(
            "Expenses:",
            monthlyExpenses
        );

        console.log(
            "Chart Max:",
            chartMax
        );

    }


    // Run when dashboard loads

    updateChart();


    // Run when dropdown changes

    periodSelect.addEventListener(
        "change",
        updateChart
    );

}

function renderSavingsGoal() {

    const activeGoals =
    goals.filter(
        goal =>
            goal.savedAmount <
            goal.targetAmount
    );


const goalsToUse =
    activeGoals.length > 0
        ? activeGoals
        : goals;


const goal =
    [...goalsToUse].sort(
        (a, b) => {

            const percentageA =
                (a.savedAmount / a.targetAmount) * 100;

            const percentageB =
                (b.savedAmount / b.targetAmount) * 100;

            return percentageB - percentageA;

        }
    )[0];

    if (!goal) {
        return;
    }


    const percentage =
        (goal.savedAmount / goal.targetAmount) * 100;


    const goalName =
        document.getElementById("goal-name");

    const goalAmount =
        document.getElementById("goal-amount");

    const goalPercentage =
        document.getElementById("goal-percentage");

    const goalProgress =
        document.getElementById("goal-progress");

    const goalDate =
        document.getElementById("goal-date");

    const goalIcon =
        document.getElementById("goal-icon");


    if (goalName) {
        goalName.textContent = goal.name;
    }

    if (goalAmount) {

        goalAmount.textContent =
            `₹${goal.savedAmount.toLocaleString("en-IN")}
            / ₹${goal.targetAmount.toLocaleString("en-IN")}`;

    }

    if (goalPercentage) {

        goalPercentage.textContent =
            `${Math.round(percentage)}% Completed`;

    }

    if (goalProgress) {

        goalProgress.style.width =
            `${Math.min(percentage, 100)}%`;

    }

    if (goalDate) {

        goalDate.textContent =
            `Target Date: ${goal.targetDate}`;

    }

    if (goalIcon) {
        goalIcon.textContent = goal.icon;
    }

}

/* =========================
   LOAD SIGNED UP USER NAME
========================= */

function loadUserName() {

    const savedUser =
        localStorage.getItem(
            "fintrack_user"
        );


    if (!savedUser) {

        return;

    }


    const user =
        JSON.parse(savedUser);


    const name =
        user.name || "User";


    const welcomeUserName =
        document.getElementById(
            "welcome-user-name"
        );


    const profileUserName =
        document.getElementById(
            "profile-user-name"
        );


    if (welcomeUserName) {

        welcomeUserName.textContent =
            name;

    }


    if (profileUserName) {

        profileUserName.textContent =
            name;

    }

}


/* =========================
   INITIALIZE
========================= */

loadUserName();