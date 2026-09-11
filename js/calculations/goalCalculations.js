export function calculateGoalPercentage(
    savedAmount,
    targetAmount
) {
    if (targetAmount <= 0) {
        return 0;
    }
    return (
        savedAmount / targetAmount
    ) * 100;
}

export function isGoalCompleted(goal) {
    return (
        goal.savedAmount >= goal.targetAmount
    );
}

export function calculateTotalGoals(goals) {
    return goals.length;
}


export function calculateTotalTarget(goals) {

    return goals.reduce(
        (total, goal) =>
            total + goal.targetAmount,
        0
    );

}


export function calculateTotalSaved(goals) {
    return goals.reduce(
        (total, goal) =>
            total + goal.savedAmount,
        0
    );
}


export function calculateCompletedGoals(goals) {

    return goals.filter(
        goal => isGoalCompleted(goal)
    ).length;

}
export function calculateDaysRemaining(targetDate) {

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    const target =
        new Date(targetDate);

    target.setHours(
        0,
        0,
        0,
        0
    );


    const difference =
        target - today;


    const daysRemaining =
        Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );


    return daysRemaining;

}

export function getDaysRemainingMessage(
    daysRemaining,
    isCompleted
) {

    if (isCompleted) {

        return "🎉 Goal Completed!";

    }


    if (daysRemaining === 0) {

        return "🔥 Target is today!";

    }


    if (daysRemaining === 1) {

        return "⏳ 1 day remaining";

    }


    if (daysRemaining > 1) {

        return `⏳ ${daysRemaining} days remaining`;

    }


    return "⚠️ Target date passed";

}
export function getGoalStatus(isCompleted) {

    if (isCompleted) {

        return {
            text: "🎉 Completed",
            className: "goal-completed"
        };

    }


    return {
        text: "⏳ In Progress",
        className: "goal-in-progress"
    };

}

export function getGoalProgressClass(percentage) {

    if (percentage <= 25) {
        return "progress-low";
    }


    if (percentage <= 50) {
        return "progress-medium";
    }


    if (percentage <= 75) {
        return "progress-good";
    }


    return "progress-high";

}
export function getGoalProgressMessage(percentage) {

    if (percentage === 0) {

        return "🚀 Let's get started!";

    }


    if (percentage <= 25) {

        return "🌱 Just getting started";

    }


    if (percentage <= 50) {

        return "💪 Keep going!";

    }


    if (percentage <= 75) {

        return "🔥 Great progress!";

    }


    if (percentage < 100) {

        return "🎯 Almost there!";

    }


    return "🎉 Goal achieved!";

}
export function getGoalDeadlineClass(
    daysRemaining,
    isCompleted
) {

    if (isCompleted) {
        return "deadline-completed";
    }


    if (daysRemaining < 0) {
        return "deadline-overdue";
    }


    if (daysRemaining <= 7) {
        return "deadline-warning";
    }


    return "deadline-safe";

}