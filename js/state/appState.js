import { transactions as initialTransactions }
    from "../../data/transactions.js";


const storedTransactions =
    localStorage.getItem("fintrack_transactions");


let transactions;


if (storedTransactions) {

    const savedTransactions =
        JSON.parse(storedTransactions);


    transactions = [
        ...savedTransactions,

        ...initialTransactions.filter(initialTransaction =>
            !savedTransactions.some(
                savedTransaction =>
                    savedTransaction.id === initialTransaction.id
            )
        )
    ];

} else {

    transactions = [...initialTransactions];

}


export const appState = {

    transactions: transactions,

    currentUser: {
        name: "John Doe"
    },

    selectedPeriod: "This Month",

    selectedCategory: null

};