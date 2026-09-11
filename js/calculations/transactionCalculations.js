export function calculateTotalIncome(transactions) {

    return transactions
        .filter(transaction => transaction.type === "income")
        .reduce((total, transaction) => {
            return total + transaction.amount;
        }, 0);

}


export function calculateTotalExpenses(transactions) {

    return transactions
        .filter(transaction => transaction.type === "expense")
        .reduce((total, transaction) => {
            return total + transaction.amount;
        }, 0);

}


export function calculateBalance(transactions) {

    const income = calculateTotalIncome(transactions);

    const expenses = calculateTotalExpenses(transactions);

    return income - expenses;

}