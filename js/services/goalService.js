import { goals } from "../../data/goals.js";


export function saveGoals(goals) {

    localStorage.setItem(
        "fintrack_goals",
        JSON.stringify(goals)
    );

}


export function getGoals() {

    const storedGoals =
        localStorage.getItem("fintrack_goals");


    if (storedGoals) {

        return JSON.parse(storedGoals);

    }


    return [];

}
export function deleteGoal(goals, goalId) {

    const updatedGoals =
        goals.filter(
            goal => goal.id !== goalId
        );


    saveGoals(updatedGoals);


    return updatedGoals;

}
export function addGoal(goals, newGoal) {

    const updatedGoals = [
        newGoal,
        ...goals
    ];


    saveGoals(updatedGoals);


    return updatedGoals;

}
export function updateGoal(
    goals,
    updatedGoal
) {

    const updatedGoals =
        goals.map(
            goal =>

                goal.id === updatedGoal.id
                    ? updatedGoal
                    : goal
        );


    saveGoals(updatedGoals);


    return updatedGoals;

}
export function addMoneyToGoal(
    goals,
    goalId,
    amount
) {

    const updatedGoals =
        goals.map(
            goal => {

                if (goal.id === goalId) {

                    const newSavedAmount =
                        Math.min(
                            goal.savedAmount + amount,
                            goal.targetAmount
                        );


                    return {

                        ...goal,

                        savedAmount:
                            newSavedAmount

                    };

                }

                return goal;

            }
        );

    saveGoals(updatedGoals);

    return updatedGoals;

}