export function calculateCategorySpending(
    transactions,
    category
) {

    return transactions
        .filter(
            transaction =>
                transaction.type === "expense"
                &&
                transaction.category === category
        )
        .reduce(
            (total, transaction) =>
                total + transaction.amount,
            0
        );

}


export function calculateBudgetPercentage(
    spent,
    budget
) {

    if (budget === 0) {
        return 0;
    }


    return (spent / budget) * 100;

}


export function calculateRemainingBudget(
    spent,
    budget
) {

    return budget - spent;

}