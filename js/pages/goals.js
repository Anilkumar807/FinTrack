import { goals as initialGoals } from "../../data/goals.js";
import {
    confirmDelete
} from "../components/confirmDialog.js";

import {
    showSuccessMessage,
    showErrorMessage
} from "../components/notification.js";

import {
    calculateGoalPercentage,
    isGoalCompleted,
    calculateDaysRemaining,
    getDaysRemainingMessage,
    getGoalStatus,
    getGoalProgressClass,
    getGoalProgressMessage,
    getGoalDeadlineClass,
    calculateTotalGoals,
    calculateTotalTarget,
    calculateTotalSaved,
    calculateCompletedGoals
} from "../calculations/goalCalculations.js";

import {
    saveGoals,
    getGoals,
    deleteGoal,
    addGoal,
    updateGoal,
    addMoneyToGoal
} from "../services/goalService.js";

const addGoalButton =
    document.getElementById("add-goal-btn");

const cancelGoalButton =
    document.getElementById("cancel-goal-btn");

const goalFormContainer =
    document.getElementById("goal-form-container");

const goalForm =
    document.getElementById("goal-form");

const goalsList =
    document.getElementById("goals-list");

const resetGoalsButton =
    document.getElementById("reset-goals-btn");

const targetDateInput =
    document.getElementById("target-date");


const today = new Date();


const year = today.getFullYear();

const month =
    String(today.getMonth() + 1)
        .padStart(2, "0");

const day =
    String(today.getDate())
        .padStart(2, "0");


const minimumDate =
    `${year}-${month}-${day}`;


targetDateInput.min =
    minimumDate;


// =========================
// Load Goals
// =========================

const searchGoalsInput =
    document.getElementById("search-goals");

const filterGoalsSelect =
    document.getElementById("filter-goals");


const sortGoalsSelect =
    document.getElementById("sort-goals");

let goals = getGoals();

console.log("Loaded goals:", goals);
if (!goals||goals.length === 0) {

    goals = [...initialGoals];

    saveGoals(goals);

}
let editingGoalId = null;
// =========================
// Update Goals
// =========================

function updateGoalsDisplay() {

    const searchText =
        searchGoalsInput.value
            .toLowerCase()
            .trim();


    let filteredGoals =
        goals.filter(
            goal =>
                goal.name
                    .toLowerCase()
                    .includes(searchText)
        );
    
    // Filter Goals

        const filterType =
            filterGoalsSelect.value;


        if (filterType === "completed") {
            filteredGoals =
                filteredGoals.filter(
                    goal => isGoalCompleted(goal)
                );
        }


        if (filterType === "in-progress") {
            filteredGoals =
                filteredGoals.filter(
                    goal => !isGoalCompleted(goal)
                );

        }


    const sortType =
        sortGoalsSelect.value;


    if (sortType === "date") {

        filteredGoals.sort(
            (a, b) =>
                new Date(a.targetDate)
                -
                new Date(b.targetDate)
        );

    }


    if (sortType === "target-high") {

        filteredGoals.sort(
            (a, b) =>
                b.targetAmount - a.targetAmount
        );

    }


    if (sortType === "saved-high") {

        filteredGoals.sort(
            (a, b) =>
                b.savedAmount - a.savedAmount
        );

    }


     if (sortType === "percentage") {
            filteredGoals.sort(
                (a, b) =>
                    calculateGoalPercentage(
                        b.savedAmount,
                        b.targetAmount
                    )
                    -
                    calculateGoalPercentage(
                        a.savedAmount,
                        a.targetAmount
                    )
            );

        }
       if (sortType === "remaining-low") {

                filteredGoals.sort(
                    (a, b) =>
                        (a.targetAmount - a.savedAmount)
                        -
                        (b.targetAmount - b.savedAmount)
                );

            }


            if (sortType === "remaining-high") {

                filteredGoals.sort(
                    (a, b) =>
                        (b.targetAmount - b.savedAmount)
                        -
                        (a.targetAmount - a.savedAmount)
                );

            }

            if (sortType === "completed-first") {

                    filteredGoals.sort(
                        (a, b) =>
                            Number(isGoalCompleted(b))
                            -
                            Number(isGoalCompleted(a))
                    );

                }
                if (sortType === "in-progress-first") {

                filteredGoals.sort(
                    (a, b) =>
                        Number(isGoalCompleted(a))
                        -
                        Number(isGoalCompleted(b))
                );

            }


    updateGoalsCount(filteredGoals);

    renderGoals(filteredGoals);

    renderGoalStats(filteredGoals);

}


function updateGoalsCount(goalsToRender) {

    const goalsCount =
        document.getElementById("goals-count");

    if (!goalsCount) {
        return;
    }

    const count = goalsToRender.length;

    goalsCount.textContent =
        count === 1
            ? "Showing 1 goal"
            : `Showing ${count} goals`;

}


// =========================
// render Goals stats
// =========================


function renderGoalStats(goalsToCalculate = goals) {

    const totalGoals =
        calculateTotalGoals(goalsToCalculate);


    const totalTarget =
        calculateTotalTarget(goalsToCalculate);


    const totalSaved =
        calculateTotalSaved(goalsToCalculate);


    const completedGoals =
        calculateCompletedGoals(goalsToCalculate);


    document.getElementById("total-goals").textContent =
        totalGoals;


    document.getElementById("total-target").textContent =
        `₹${totalTarget.toLocaleString("en-IN")}`;


    document.getElementById("total-saved").textContent =
        `₹${totalSaved.toLocaleString("en-IN")}`;


    document.getElementById("completed-goals").textContent =
        completedGoals;

}

searchGoalsInput.addEventListener(
    "input",
    updateGoalsDisplay
);

filterGoalsSelect.addEventListener(
    "change",
    updateGoalsDisplay
);
sortGoalsSelect.addEventListener(
    "change",
    updateGoalsDisplay
);

resetGoalsButton.addEventListener(
    "click",
    () => {

        searchGoalsInput.value = "";

        sortGoalsSelect.value = "default";

        filterGoalsSelect.value = "all";


        updateGoalsDisplay();
         showSuccessMessage(
            "Filters reset successfully! 🔄"
        );

    }
);
// =========================
// Render Goals
// =========================

function renderGoals(goalsToRender = goals) {

    goalsList.innerHTML = "";


    // =========================
    // Empty Goals
    // =========================

    if (goalsToRender.length === 0) {

        if (goals.length === 0) {

            goalsList.innerHTML = `
                <div class="empty-goals">

                    <span>🎯</span>

                    <h3>No Goals Yet</h3>

                    <p>
                        Create your first savings goal!
                    </p>

                </div>
            `;

        } else {

            goalsList.innerHTML = `
                <div class="empty-goals">

                    <span>📭</span>

                    <h3>No Goals Found</h3>

                    <p>
                        Try changing your search or filter.
                    </p>

                    <button
                        type="button"
                        id="clear-goal-filters"
                    >
                        Clear Search & Filters
                    </button>

                </div>
            `;


            const clearFiltersButton =
                document.getElementById(
                    "clear-goal-filters"
                );


            if (clearFiltersButton) {

                clearFiltersButton.addEventListener(
                    "click",
                    () => {

                        searchGoalsInput.value = "";

                        sortGoalsSelect.value = "default";

                        filterGoalsSelect.value = "all";

                        updateGoalsDisplay();

                    }
                );

            }

        }


        renderGoalStats();

        return;

    }


    // =========================
    // Render Goals
    // =========================

    goalsToRender.forEach(goal => {

        const percentage =
            calculateGoalPercentage(
                goal.savedAmount,
                goal.targetAmount
            );
            let percentageClass = "percentage-low";

            if (percentage >= 100) {

                percentageClass =
                    "percentage-completed";

            } else if (percentage >= 50) {

                percentageClass =
                    "percentage-medium";

            }

        const remainingAmount =
            Math.max(
                goal.targetAmount -
                goal.savedAmount,
                0
            );


        const progressClass =
            getGoalProgressClass(percentage);


        const progressMessage =
            getGoalProgressMessage(percentage);


        const isCompleted =
            isGoalCompleted(goal);


        const goalStatus =
            getGoalStatus(isCompleted);


        const daysRemaining =
            calculateDaysRemaining(
                goal.targetDate
            );


        const daysRemainingMessage =
            getDaysRemainingMessage(
                daysRemaining,
                isCompleted
            );
        const deadlineClass =
            getGoalDeadlineClass(
                daysRemaining,
                isCompleted
            );


        const goalItem =
            document.createElement("div");


        goalItem.className =
            isCompleted
                ? "goal-card goal-card-completed"
                : "goal-card";


        goalItem.classList.add(
            "dashboard-card"
        );


        // =========================
        // Goal HTML
        // =========================

        goalItem.innerHTML = `

            <div class="card-header">
                <div class="goal-title-section">

                    <h3 class="goal-title">

                        <span class="goal-icon">
                            ${goal.icon || "🎯"}
                        </span>

                        <span>
                            ${goal.name}
                        </span>

                    </h3>


                    <span class="goal-percentage-badge ${percentageClass}">
                        ${Math.round(percentage)}%
                    </span>

                </div>

                <div class="goal-actions">

                    <button
                        class="add-money-btn"
                        data-id="${goal.id}">
                        + Add Money
                    </button>


                    <button
                        class="edit-goal-btn"
                        data-id="${goal.id}">
                        Edit
                    </button>


                    <button
                        class="delete-goal-btn"
                        data-id="${goal.id}">
                        Delete
                    </button>

                </div>

            </div>


            <p>
                ₹${goal.savedAmount.toLocaleString("en-IN")}
                /
                ₹${goal.targetAmount.toLocaleString("en-IN")}
            </p>

            <p class="remaining-amount">
                ${isCompleted
                    ? "🎉 Goal achieved!"
                    : `💰 ₹${remainingAmount.toLocaleString("en-IN")} remaining`
                }
            </p>


            <div class="progress-bar">

                <div
                    class="progress ${progressClass}"
                    style="width: ${Math.min(
                        percentage,
                        100
                    )}%">
                </div>

            </div>


            <p class="progress-message">
                ${progressMessage}
            </p>


            <p class="${goalStatus.className}">
                ${goalStatus.text}
            </p>


            <small>
                Target Date: ${goal.targetDate}
            </small>

            <br>

            <p class="goal-deadline ${deadlineClass}">
                ${daysRemainingMessage}
            </p>

        `;


        goalsList.appendChild(goalItem);

        


        // =========================
        // Delete Goal
        // =========================

        const deleteButton =
            goalItem.querySelector(
                ".delete-goal-btn"
            );


        deleteButton.addEventListener(
            "click",
            () => {

                const goalId =
                    Number(
                        deleteButton.dataset.id
                    );


                const isConfirmed =
                    confirm(
                        "Are you sure you want to delete this goal?"
                    );


                if (!isConfirmed) {
                    return;
                }


                goals = deleteGoal(
                    goals,
                    goalId
                );


                updateGoalsDisplay();


                showSuccessMessage(
                    "Goal deleted successfully! 🗑️"
                );

            }
        );


        // =========================
        // Edit Goal
        // =========================

        const editButton =
            goalItem.querySelector(
                ".edit-goal-btn"
            );


        editButton.addEventListener(
            "click",
            () => {

                const goalId =
                    Number(
                        editButton.dataset.id
                    );


                const selectedGoal =
                    goals.find(
                        goal =>
                            goal.id === goalId
                    );


                if (!selectedGoal) {
                    return;
                }


                editingGoalId = goalId;


                document.getElementById(
                    "goal-name"
                ).value =
                    selectedGoal.name;

                document.getElementById(
                    "goal-icon"
                ).value =
                    selectedGoal.icon || "🎯";


                document.getElementById(
                    "target-amount"
                ).value =
                    selectedGoal.targetAmount;


                document.getElementById(
                    "saved-amount"
                ).value =
                    selectedGoal.savedAmount;


                document.getElementById(
                    "target-date"
                ).value =
                    selectedGoal.targetDate;


                goalFormContainer.style.display =
                    "block";


                goalForm.querySelector(
                    'button[type="submit"]'
                ).textContent =
                    "Update Goal";


                goalFormContainer.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );


        // =========================
        // Add Money
        // =========================

        const addMoneyButton =
            goalItem.querySelector(
                ".add-money-btn"
            );
        if (isCompleted) {
                addMoneyButton.style.display = "none";
            }

        addMoneyButton.addEventListener(
            "click",
            () => {

                const goalId =
                    Number(
                        addMoneyButton.dataset.id
                    );


                const amount =
                    Number(
                        prompt(
                            "Enter amount to add:"
                        )
                    );


                // Validate amount

                if (!amount || amount <= 0) {

                    showErrorMessage(
                        "Please enter a valid amount."
                    );

                    return;

                }


                const currentGoal =
                    goals.find(
                        goal =>
                            goal.id === goalId
                    );


                if (!currentGoal) {
                    return;
                }


                const remainingAmount =
                    currentGoal.targetAmount -
                    currentGoal.savedAmount;


                // Prevent adding more
                // than target amount

                if (amount > remainingAmount) {

                    showErrorMessage(
                        `You can add a maximum of ₹${remainingAmount.toLocaleString("en-IN")}.`
                    );

                    return;

                }


                // Add money

                goals = addMoneyToGoal(
                    goals,
                    goalId,
                    amount
                );


                const updatedGoal =
                    goals.find(
                        goal =>
                            goal.id === goalId
                    );


                // Update UI

                updateGoalsDisplay();


                // Show success message

                if (
                    updatedGoal &&
                    isGoalCompleted(updatedGoal)
                ) {

                    showSuccessMessage(
                        "🎉 Congratulations! Goal completed!"
                    );

                } else {

                    showSuccessMessage(
                        "Money added successfully! 💰"
                    );

                }

            }
        );

    }); // End forEach


    // =========================
    // Update Statistics
    // =========================

    renderGoalStats();

}

// =========================
// Show Form
// =========================

addGoalButton.addEventListener(
    "click",
    () => {

        editingGoalId = null;

        goalForm.reset();

        goalForm.querySelector(
            'button[type="submit"]'
        ).textContent = "Add Goal";


        goalFormContainer.style.display =
            "block";

    }
);


// =========================
// Cancel
// =========================

cancelGoalButton.addEventListener(
    "click",
    () => {

        goalForm.reset();

        goalFormContainer.style.display =
            "none";

    }
);


// =========================
// Add Goal
// =========================

goalForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const name =
            document.getElementById(
                "goal-name"
            ).value.trim();

        const icon =
        document.getElementById(
            "goal-icon"
        ).value;


        const targetAmount =
            Number(
                document.getElementById(
                    "target-amount"
                ).value
            );


        const savedAmount =
            Number(
                document.getElementById(
                    "saved-amount"
                ).value
            );


        const targetDate =
            document.getElementById(
                "target-date"
            ).value;


        // Validation

        if (!name) {

            showErrorMessage("Please enter a goal name.");

            return;

        }


        if (targetAmount <= 0) {

            showErrorMessage("Target amount must be greater than ₹0.");

            return;

        }


        if (savedAmount < 0) {

            showErrorMessage("Saved amount cannot be negative.");

            return;

        }

        if (savedAmount > targetAmount) {

            showErrorMessage(
                "Saved amount cannot be greater than target amount."
            );

            return;

        }


        if (!targetDate) {

            showErrorMessage("Please select a target date.");

            return;

        }

        const selectedDate =
                new Date(targetDate);


            const today =
                new Date();


            today.setHours(
                0,
                0,
                0,
                0
            );


            if (selectedDate < today) {

                showErrorMessage(
                    "Target date cannot be in the past."
                );

                return;

            }


        // Edit Goal

        if (editingGoalId) {

            const existingGoal =
                goals.find(
                    goal => goal.id === editingGoalId
                );


            if (existingGoal) {

                const updatedGoal = {

                    ...existingGoal,

                    name: name,

                    icon: icon,

                    targetAmount: targetAmount,

                    savedAmount: savedAmount,

                    targetDate: targetDate

                };


                goals = updateGoal(
                    goals,
                    updatedGoal
                );

            }


            editingGoalId = null;


        } else {

            // Add New Goal

            const newGoal = {

                id: Date.now(),

                name: name,

                targetAmount: targetAmount,

                savedAmount: savedAmount,

                targetDate: targetDate,

                icon: icon

            };


            goals = addGoal(
                goals,
                newGoal
            );

        }


        // Update UI

        updateGoalsDisplay();


        // Reset Form

        goalForm.reset();


        // Hide Form

        goalFormContainer.style.display =
            "none";


        // Reset Button Text

        goalForm.querySelector(
            'button[type="submit"]'
        ).textContent = "Add Goal";


        // Success Message

        showSuccessMessage(
            "Goal saved successfully! 🎉"
        );

    }
);
// =========================
// Initial Load
// =========================

updateGoalsCount(goals);

renderGoals(goals);

renderGoalStats(goals);