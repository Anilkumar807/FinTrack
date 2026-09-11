import {
    getTransactions
} from "../services/transactionService.js";


/* =========================
   DOM ELEMENTS
========================= */

const reportMonthFilter =
    document.getElementById(
        "report-month-filter"
    );


const totalIncomeElement =
    document.getElementById(
        "report-total-income"
    );


const totalExpensesElement =
    document.getElementById(
        "report-total-expenses"
    );


const netBalanceElement =
    document.getElementById(
        "report-net-balance"
    );


const savingsRateElement =
    document.getElementById(
        "report-savings-rate"
    );


const expenseCategoryReport =
    document.getElementById(
        "expense-category-report"
    );


const incomeComparisonBar =
    document.getElementById(
        "income-comparison-bar"
    );


const expenseComparisonBar =
    document.getElementById(
        "expense-comparison-bar"
    );


const incomeComparisonValue =
    document.getElementById(
        "income-comparison-value"
    );


const expenseComparisonValue =
    document.getElementById(
        "expense-comparison-value"
    );


const monthlyReport =
    document.getElementById(
        "monthly-report"
    );


const financialInsights =
    document.getElementById(
        "financial-insights"
    );


/* =========================
   FORMAT CURRENCY
========================= */

function formatCurrency(amount) {

    return `₹${Math.round(
        amount
    ).toLocaleString("en-IN")}`;

}


/* =========================
   GET MONTH KEY
========================= */

function getMonthKey(date) {

    const transactionDate =
        new Date(date);


    const year =
        transactionDate.getFullYear();


    const month =
        String(
            transactionDate.getMonth() + 1
        ).padStart(2, "0");


    return `${year}-${month}`;

}


/* =========================
   FORMAT MONTH
========================= */

function formatMonth(monthKey) {

    const [year, month] =
        monthKey.split("-");


    const date =
        new Date(
            Number(year),
            Number(month) - 1,
            1
        );


    return date.toLocaleDateString(
        "en-IN",
        {
            month: "long",
            year: "numeric"
        }
    );

}


/* =========================
   POPULATE MONTH FILTER
========================= */

function populateMonthFilter() {

    const transactions =
        getTransactions();


    const months =
        [
            ...new Set(
                transactions.map(
                    transaction =>
                        getMonthKey(
                            transaction.date
                        )
                )
            )
        ];


    months.sort(
        (a, b) =>
            b.localeCompare(a)
    );


    reportMonthFilter.innerHTML =
        `
        <option value="all">
            All Time
        </option>
        `;


    months.forEach(
        month => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                month;


            option.textContent =
                formatMonth(month);


            reportMonthFilter.appendChild(
                option
            );

        }
    );

}


/* =========================
   GET FILTERED TRANSACTIONS
========================= */

function getFilteredTransactions() {

    const transactions =
        getTransactions();


    const selectedMonth =
        reportMonthFilter.value;


    if (
        selectedMonth === "all"
    ) {

        return transactions;

    }


    return transactions.filter(
        transaction =>
            getMonthKey(
                transaction.date
            ) === selectedMonth
    );

}


/* =========================
   UPDATE SUMMARY
========================= */

function updateReportSummary(
    transactions
) {

    const totalIncome =
        transactions
            .filter(
                transaction =>
                    transaction.type ===
                    "income"
            )
            .reduce(
                (total, transaction) =>
                    total +
                    Number(
                        transaction.amount
                    ),
                0
            );


    const totalExpenses =
        transactions
            .filter(
                transaction =>
                    transaction.type ===
                    "expense"
            )
            .reduce(
                (total, transaction) =>
                    total +
                    Number(
                        transaction.amount
                    ),
                0
            );


    const netBalance =
        totalIncome -
        totalExpenses;


    const savingsRate =
        totalIncome > 0
            ? (
                netBalance /
                totalIncome
            ) * 100
            : 0;


    totalIncomeElement.textContent =
        formatCurrency(
            totalIncome
        );


    totalExpensesElement.textContent =
        formatCurrency(
            totalExpenses
        );


    netBalanceElement.textContent =
        formatCurrency(
            netBalance
        );


    savingsRateElement.textContent =
        `${Math.round(
            savingsRate
        )}%`;


    netBalanceElement.style.color =
        netBalance >= 0
            ? "#16a34a"
            : "#dc2626";


    savingsRateElement.style.color =
        savingsRate >= 0
            ? "#16a34a"
            : "#dc2626";


    return {

        totalIncome,
        totalExpenses,
        netBalance,
        savingsRate

    };

}


/* =========================
   EXPENSE CATEGORY REPORT
========================= */

function renderExpenseCategories(
    transactions
) {

    const expenses =
        transactions.filter(
            transaction =>
                transaction.type ===
                "expense"
        );


    if (
        expenses.length === 0
    ) {

        expenseCategoryReport.innerHTML =
            `
            <p class="empty-report">
                No expense data available.
            </p>
            `;


        return;

    }


    const categories = {};


    expenses.forEach(
        transaction => {

            const category =
                transaction.category ||
                "Other";


            categories[category] =
                (
                    categories[category] ||
                    0
                ) +
                Number(
                    transaction.amount
                );

        }
    );


    const totalExpenses =
        Object.values(
            categories
        ).reduce(
            (total, amount) =>
                total + amount,
            0
        );


    const sortedCategories =
        Object.entries(
            categories
        ).sort(
            (a, b) =>
                b[1] - a[1]
        );


    expenseCategoryReport.innerHTML =
        sortedCategories.map(
            ([category, amount]) => {

                const percentage =
                    totalExpenses > 0
                        ? (
                            amount /
                            totalExpenses
                        ) * 100
                        : 0;


                return `

                    <div class="category-report-item">

                        <div class="category-report-info">

                            <div class="category-report-title">

                                <span>
                                    ${category}
                                </span>

                                <strong>
                                    ${formatCurrency(amount)}
                                </strong>

                            </div>


                            <div class="category-progress">

                                <div
                                    class="category-progress-fill"
                                    style="
                                        width:
                                        ${percentage}%
                                    "
                                ></div>

                            </div>


                            <small>
                                ${Math.round(
                                    percentage
                                )}% of expenses
                            </small>

                        </div>

                    </div>

                `;

            }
        ).join("");

}


/* =========================
   INCOME VS EXPENSE
========================= */

function updateIncomeVsExpense(
    totalIncome,
    totalExpenses
) {

    const maximum =
        Math.max(
            totalIncome,
            totalExpenses,
            1
        );


    const incomePercentage =
        (
            totalIncome /
            maximum
        ) * 100;


    const expensePercentage =
        (
            totalExpenses /
            maximum
        ) * 100;


    incomeComparisonBar.style.width =
        `${incomePercentage}%`;


    expenseComparisonBar.style.width =
        `${expensePercentage}%`;


    incomeComparisonValue.textContent =
        formatCurrency(
            totalIncome
        );


    expenseComparisonValue.textContent =
        formatCurrency(
            totalExpenses
        );

}


/* =========================
   MONTHLY REPORT
========================= */

function renderMonthlyReport(transactions) {

    if (
        transactions.length === 0
    ) {

        monthlyReport.innerHTML =
            `
            <p class="empty-report">
                No transaction data available.
            </p>
            `;


        return;

    }


    const monthlyData = {};


    transactions.forEach(
        transaction => {

            const monthKey =
                getMonthKey(
                    transaction.date
                );


            if (
                !monthlyData[monthKey]
            ) {

                monthlyData[monthKey] = {

                    income: 0,

                    expenses: 0

                };

            }


            if (
                transaction.type ===
                "income"
            ) {

                monthlyData[
                    monthKey
                ].income +=
                    Number(
                        transaction.amount
                    );

            }


            else if (
                transaction.type ===
                "expense"
            ) {

                monthlyData[
                    monthKey
                ].expenses +=
                    Number(
                        transaction.amount
                    );

            }

        }
    );


    const sortedMonths =
        Object.keys(
            monthlyData
        ).sort(
            (a, b) =>
                b.localeCompare(a)
        );


    monthlyReport.innerHTML =
        sortedMonths.map(
            monthKey => {

                const data =
                    monthlyData[
                        monthKey
                    ];


                const balance =
                    data.income -
                    data.expenses;


                return `

                    <div class="monthly-report-item">

                        <div class="monthly-report-month">

                            📅
                            ${formatMonth(
                                monthKey
                            )}

                        </div>


                        <div class="monthly-report-values">

                            <span class="monthly-income">

                                +${formatCurrency(
                                    data.income
                                )}

                            </span>


                            <span class="monthly-expense">

                                -${formatCurrency(
                                    data.expenses
                                )}

                            </span>


                            <strong
                                class="${
                                    balance >= 0
                                        ? "positive-balance"
                                        : "negative-balance"
                                }"
                            >

                                ${formatCurrency(
                                    balance
                                )}

                            </strong>

                        </div>

                    </div>

                `;

            }
        ).join("");

}


/* =========================
   FINANCIAL INSIGHTS
========================= */

function renderFinancialInsights(
    summary,
    transactions
) {

    const {

        totalIncome,

        totalExpenses,

        netBalance,

        savingsRate

    } = summary;


    const insights = [];


    if (
        transactions.length === 0
    ) {

        insights.push(
            "Add transactions to see your financial insights."
        );

    }


    else {


        if (
            netBalance > 0
        ) {

            insights.push(
                `Great job! You have saved ${formatCurrency(
                    netBalance
                )} during this period.`
            );

        }


        else if (
            netBalance < 0
        ) {

            insights.push(
                `Your expenses are higher than your income by ${formatCurrency(
                    Math.abs(netBalance)
                )}.`
            );

        }


        if (
            savingsRate >= 20
        ) {

            insights.push(
                `Excellent! Your savings rate is ${Math.round(
                    savingsRate
                )}%.`
            );

        }


        else if (
            savingsRate >= 0 &&
            savingsRate < 20 &&
            totalIncome > 0
        ) {

            insights.push(
                `Try to improve your savings rate. Currently it is ${Math.round(
                    savingsRate
                )}%.`
            );

        }


        if (
            totalExpenses > totalIncome &&
            totalIncome > 0
        ) {

            insights.push(
                "⚠️ Consider reducing unnecessary expenses."
            );

        }

    }


    financialInsights.innerHTML =
        insights.map(
            insight => `

                <div class="insight-item">

                    💡

                    <span>
                        ${insight}
                    </span>

                </div>

            `
        ).join("");

}


/* =========================
   UPDATE REPORTS
========================= */

function updateReports() {

    const filteredTransactions =
        getFilteredTransactions();


    const summary =
        updateReportSummary(
            filteredTransactions
        );


    renderExpenseCategories(
        filteredTransactions
    );


    updateIncomeVsExpense(
        summary.totalIncome,
        summary.totalExpenses
    );


    renderMonthlyReport(filteredTransactions);


    renderFinancialInsights(
        summary,
        filteredTransactions
    );

}


/* =========================
   MONTH FILTER EVENT
========================= */

reportMonthFilter.addEventListener(
    "change",
    () => {

        updateReports();

    }
);


/* =========================
   INITIAL LOAD
========================= */

populateMonthFilter();

updateReports();


console.log(
    "Reports page loaded successfully!"
);