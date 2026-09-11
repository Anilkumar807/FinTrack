/* =========================
   SETTINGS PAGE
========================= */


/* =========================
   STORAGE KEYS
========================= */

const PROFILE_KEY =
    "fintrack_profile";


const FINANCIAL_KEY =
    "fintrack_financial_preferences";


const TRANSACTIONS_KEY =
    "fintrack_transactions";


const THEME_KEY =
    "fintrack_dark_mode";


/* =========================
   DOM ELEMENTS
========================= */

const userName =
    document.getElementById(
        "user-name"
    );


const userEmail =
    document.getElementById(
        "user-email"
    );


const saveProfileButton =
    document.getElementById(
        "save-profile-btn"
    );


const currency =
    document.getElementById(
        "currency"
    );


const monthlyIncomeGoal =
    document.getElementById(
        "monthly-income-goal"
    );


const saveFinancialButton =
    document.getElementById(
        "save-financial-btn"
    );


const darkModeToggle =
    document.getElementById(
        "dark-mode-toggle"
    );


const clearTransactionsButton =
    document.getElementById(
        "clear-transactions-btn"
    );


const resetAppButton =
    document.getElementById(
        "reset-app-btn"
    );


const settingsMessage =
    document.getElementById(
        "settings-message"
    );


/* =========================
   SHOW MESSAGE
========================= */

function showMessage(
    message,
    type = "success"
) {

    settingsMessage.textContent =
        message;


    settingsMessage.classList.add(
        "show"
    );


    if (type === "error") {

        settingsMessage.style.background =
            "#dc2626";

    }

    else {

        settingsMessage.style.background =
            "#16a34a";

    }


    setTimeout(
        () => {

            settingsMessage.classList.remove(
                "show"
            );

        },
        3000
    );

}


/* =========================
   LOAD PROFILE
========================= */

function loadProfile() {

    try {

        const savedProfile =
            localStorage.getItem(
                PROFILE_KEY
            );


        if (!savedProfile) {

            return;

        }


        const profile =
            JSON.parse(
                savedProfile
            );


        userName.value =
            profile.name || "";


        userEmail.value =
            profile.email || "";

    }

    catch (error) {

        console.error(
            "Error loading profile:",
            error
        );

    }

}


/* =========================
   SAVE PROFILE
========================= */

saveProfileButton.addEventListener(
    "click",
    () => {

        const name =
            userName.value.trim();


        const email =
            userEmail.value.trim();


        if (!name) {

            showMessage(
                "Please enter your name.",
                "error"
            );

            return;

        }


        const profile = {

            name:
                name,

            email:
                email

        };


        localStorage.setItem(
            PROFILE_KEY,
            JSON.stringify(
                profile
            )
        );


        showMessage(
            "Profile saved successfully!"
        );

    }
);


/* =========================
   LOAD FINANCIAL SETTINGS
========================= */

function loadFinancialSettings() {

    try {

        const savedSettings =
            localStorage.getItem(
                FINANCIAL_KEY
            );


        if (!savedSettings) {

            return;

        }


        const settings =
            JSON.parse(
                savedSettings
            );


        currency.value =
            settings.currency || "INR";


        monthlyIncomeGoal.value =
            settings.monthlyIncomeGoal || "";

    }

    catch (error) {

        console.error(
            "Error loading financial settings:",
            error
        );

    }

}


/* =========================
   SAVE FINANCIAL SETTINGS
========================= */

saveFinancialButton.addEventListener(
    "click",
    () => {

        const financialSettings = {

            currency:
                currency.value,

            monthlyIncomeGoal:
                Number(
                    monthlyIncomeGoal.value
                ) || 0

        };


        localStorage.setItem(
            FINANCIAL_KEY,
            JSON.stringify(
                financialSettings
            )
        );


        showMessage(
            "Financial preferences saved successfully!"
        );

    }
);


/* =========================
   LOAD DARK MODE
========================= */

function loadDarkMode() {

    const darkMode =
        localStorage.getItem(
            THEME_KEY
        );


    if (darkMode === "true") {

        document.body.classList.add(
            "dark-mode"
        );


        darkModeToggle.checked =
            true;

    }

}


/* =========================
   DARK MODE TOGGLE
========================= */

darkModeToggle.addEventListener(
    "change",
    () => {

        const isDarkMode =
            darkModeToggle.checked;


        document.body.classList.toggle(
            "dark-mode",
            isDarkMode
        );


        localStorage.setItem(
            THEME_KEY,
            isDarkMode
        );


        showMessage(
            isDarkMode
                ? "Dark mode enabled!"
                : "Light mode enabled!"
        );

    }
);


/* =========================
   CLEAR TRANSACTIONS
========================= */

clearTransactionsButton.addEventListener(
    "click",
    () => {

        const confirmed =
            confirm(
                "Are you sure you want to delete all transactions?"
            );


        if (!confirmed) {

            return;

        }


        localStorage.removeItem(
            TRANSACTIONS_KEY
        );


        showMessage(
            "All transactions cleared successfully!"
        );

    }
);


/* =========================
   RESET APPLICATION
========================= */

/* =========================
   RESET APPLICATION
========================= */

resetAppButton.addEventListener(
    "click",
    () => {

        const confirmed =
            confirm(
                "Are you sure? This will permanently delete all FinTrack data."
            );


        if (!confirmed) {

            return;

        }


        /* REMOVE FINTRACK DATA */

        const finTrackKeys = [

            PROFILE_KEY,

            FINANCIAL_KEY,

            TRANSACTIONS_KEY,

            THEME_KEY,

            "fintrack_budgets",

            "fintrack_goals",

            "fintrack_recurring_transactions"

        ];


        finTrackKeys.forEach(
            key => {

                localStorage.removeItem(
                    key
                );

            }
        );


        showMessage(
            "FinTrack has been reset successfully!"
        );


        setTimeout(
            () => {

                window.location.href =
                    "dashboard.html";

            },
            1500
        );

    }
);


/* =========================
   INITIALIZE SETTINGS
========================= */

loadProfile();

loadFinancialSettings();

loadDarkMode();