import { appState } from "./state/appState.js";
import { loadDashboard } from "./pages/dashboard.js";
import {
    calculateTotalIncome,
    calculateTotalExpenses,
    calculateBalance
} from "./calculations/transactionCalculations.js";


const totalIncome = calculateTotalIncome(
    appState.transactions
);

const totalExpenses = calculateTotalExpenses(
    appState.transactions
);

const balance = calculateBalance(
    appState.transactions
);


console.log("Application State:", appState);

console.log("Current User:", appState.currentUser.name);

console.log("Selected Period:", appState.selectedPeriod);

console.log("Total Income:", totalIncome);

console.log("Total Expenses:", totalExpenses);

console.log("Balance:", balance);

loadDashboard();

const logoutButton =
    document.getElementById("logout-btn");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "fintrack_logged_in"
            );

            localStorage.removeItem(
                "fintrack_user_email"
            );


            window.location.href =
                "login.html";

        }
    );

}
function setActiveNavigation() {

    const navLinks =
        document.querySelectorAll(".nav-link");


    const currentPage =
        window.location.pathname
            .split("/")
            .pop();


    navLinks.forEach(link => {

        const linkPage =
            link.getAttribute("href")
                .split("/")
                .pop();


        link.classList.remove("active");


        if (linkPage === currentPage) {

            link.classList.add("active");

        }

    });

}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        setActiveNavigation();

    }
);