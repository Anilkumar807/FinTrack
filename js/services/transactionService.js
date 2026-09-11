import { appState } from "../state/appState.js";


// Get all transactions

export function getTransactions() {

    return appState.transactions;

}


// Get income transactions

export function getIncomeTransactions() {

    return appState.transactions.filter(
        transaction => transaction.type === "income"
    );

}


// Get expense transactions

export function getExpenseTransactions() {

    return appState.transactions.filter(
        transaction => transaction.type === "expense"
    );

}


// Add transaction

export function addTransaction(transaction) {

    appState.transactions.unshift(transaction);

    saveTransactions();

    return transaction;

}



// Save transactions

function saveTransactions() {

    localStorage.setItem(
        "fintrack_transactions",
        JSON.stringify(appState.transactions)
    );

}

export function deleteTransaction(id) {

    appState.transactions =
        appState.transactions.filter(
            transaction => transaction.id !== id
        );

    saveTransactions();

}


export function updateTransaction(updatedTransaction) {

    const index =
        appState.transactions.findIndex(
            transaction =>
                transaction.id === updatedTransaction.id
        );


    if (index !== -1) {

        appState.transactions[index] =
            updatedTransaction;

        saveTransactions();

        return updatedTransaction;

    }

}