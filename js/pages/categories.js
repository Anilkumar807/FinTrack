/* =========================
   CATEGORIES PAGE
========================= */


/* =========================
   STORAGE KEY
========================= */

const CATEGORY_STORAGE_KEY =
    "fintrack_categories";


/* =========================
   DEFAULT CATEGORIES
========================= */

const defaultCategories = [

    /* Income */

    {
        id: 1,
        name: "Salary",
        type: "income"
    },

    {
        id: 2,
        name: "Freelance",
        type: "income"
    },

    {
        id: 3,
        name: "Investment",
        type: "income"
    },


    /* Expenses */

    {
        id: 4,
        name: "Food & Dining",
        type: "expense"
    },

    {
        id: 5,
        name: "Shopping",
        type: "expense"
    },

    {
        id: 6,
        name: "Transport",
        type: "expense"
    },

    {
        id: 7,
        name: "Utilities",
        type: "expense"
    }

];


/* =========================
   GET CATEGORIES
========================= */

function getCategories() {

    const savedCategories =
        localStorage.getItem(
            CATEGORY_STORAGE_KEY
        );


    if (!savedCategories) {

        localStorage.setItem(
            CATEGORY_STORAGE_KEY,
            JSON.stringify(defaultCategories)
        );


        return defaultCategories;

    }


    return JSON.parse(
        savedCategories
    );

}


/* =========================
   SAVE CATEGORIES
========================= */

function saveCategories(categories) {

    localStorage.setItem(
        CATEGORY_STORAGE_KEY,
        JSON.stringify(categories)
    );

}


/* =========================
   DOM ELEMENTS
========================= */

const addCategoryButton =
    document.getElementById(
        "add-category-btn"
    );


const categoryModal =
    document.getElementById(
        "category-modal"
    );


const closeCategoryModal =
    document.getElementById(
        "close-category-modal"
    );


const cancelCategoryButton =
    document.getElementById(
        "cancel-category-btn"
    );


const categoryForm =
    document.getElementById(
        "category-form"
    );


const categoryName =
    document.getElementById(
        "category-name"
    );


const categoryType =
    document.getElementById(
        "category-type"
    );


const incomeCategoryList =
    document.getElementById(
        "income-category-list"
    );


const expenseCategoryList =
    document.getElementById(
        "expense-category-list"
    );


const incomeCategoryCount =
    document.getElementById(
        "income-category-count"
    );


const expenseCategoryCount =
    document.getElementById(
        "expense-category-count"
    );


const totalCategoryCount =
    document.getElementById(
        "total-category-count"
    );


const searchCategory =
    document.getElementById(
        "search-category"
    );


/* =========================
   EDITING CATEGORY ID
========================= */

let editingCategoryId = null;


/* =========================
   RENDER CATEGORIES
========================= */

function renderCategories() {

    const categories =
        getCategories();


    const searchValue =
        searchCategory.value
            .trim()
            .toLowerCase();


    const filteredCategories =
        categories.filter(category =>
            category.name
                .toLowerCase()
                .includes(searchValue)
        );


    const incomeCategories =
        filteredCategories.filter(
            category =>
                category.type === "income"
        );


    const expenseCategories =
        filteredCategories.filter(
            category =>
                category.type === "expense"
        );


    /* Clear Lists */

    incomeCategoryList.innerHTML = "";

    expenseCategoryList.innerHTML = "";


    /* Income Categories */

    if (incomeCategories.length === 0) {

        incomeCategoryList.innerHTML = `
            <p class="empty-message">
                No income categories found.
            </p>
        `;

    }

    else {

        incomeCategories.forEach(category => {

            incomeCategoryList.innerHTML += `

                <div class="category-item">

                    <div class="category-info">

                        <div class="category-icon income-icon">
                            ↑
                        </div>

                        <strong>
                            ${category.name}
                        </strong>

                    </div>


                    <div class="category-actions">

                        <button
                            class="edit-category-btn"
                            data-id="${category.id}"
                        >
                            ✏️
                        </button>


                        <button
                            class="delete-category-btn"
                            data-id="${category.id}"
                        >
                            🗑️
                        </button>

                    </div>

                </div>

            `;

        });

    }


    /* Expense Categories */

    if (expenseCategories.length === 0) {

        expenseCategoryList.innerHTML = `
            <p class="empty-message">
                No expense categories found.
            </p>
        `;

    }

    else {

        expenseCategories.forEach(category => {

            expenseCategoryList.innerHTML += `

                <div class="category-item">

                    <div class="category-info">

                        <div class="category-icon expense-icon">
                            ↓
                        </div>

                        <strong>
                            ${category.name}
                        </strong>

                    </div>


                    <div class="category-actions">

                        <button
                            class="edit-category-btn"
                            data-id="${category.id}"
                        >
                            ✏️
                        </button>


                        <button
                            class="delete-category-btn"
                            data-id="${category.id}"
                        >
                            🗑️
                        </button>

                    </div>

                </div>

            `;

        });

    }


    addCategoryEventListeners();

}


/* =========================
   SUMMARY COUNTS
========================= */

function updateCategorySummary() {

    const categories =
        getCategories();


    const incomeCount =
        categories.filter(
            category =>
                category.type === "income"
        ).length;


    const expenseCount =
        categories.filter(
            category =>
                category.type === "expense"
        ).length;


    incomeCategoryCount.textContent =
        incomeCount;


    expenseCategoryCount.textContent =
        expenseCount;


    totalCategoryCount.textContent =
        categories.length;

}


/* =========================
   OPEN ADD MODAL
========================= */

addCategoryButton.addEventListener(
    "click",
    () => {

        editingCategoryId = null;


        categoryForm.reset();


        document.getElementById(
            "category-modal-title"
        ).textContent =
            "Add Category";


        categoryModal.classList.add(
            "show"
        );

    }
);


/* =========================
   CLOSE MODAL
========================= */

function closeModal() {

    categoryModal.classList.remove(
        "show"
    );


    categoryForm.reset();


    editingCategoryId = null;

}


closeCategoryModal.addEventListener(
    "click",
    closeModal
);


cancelCategoryButton.addEventListener(
    "click",
    closeModal
);


/* =========================
   ADD / UPDATE CATEGORY
========================= */

categoryForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const name =
            categoryName.value.trim();


        const type =
            categoryType.value;


        if (!name) {

            return;

        }


        const categories =
            getCategories();


        /* EDIT CATEGORY */

        if (editingCategoryId !== null) {

            const category =
                categories.find(
                    item =>
                        item.id ===
                        editingCategoryId
                );


            if (category) {

                category.name =
                    name;


                category.type =
                    type;

            }

        }


        /* ADD CATEGORY */

        else {

            const newCategory = {

                id: Date.now(),

                name: name,

                type: type

            };


            categories.push(
                newCategory
            );

        }


        saveCategories(
            categories
        );


        closeModal();


        renderCategories();


        updateCategorySummary();

    }
);


/* =========================
   EDIT / DELETE EVENTS
========================= */

function addCategoryEventListeners() {

    const editButtons =
        document.querySelectorAll(
            ".edit-category-btn"
        );


    const deleteButtons =
        document.querySelectorAll(
            ".delete-category-btn"
        );


    /* EDIT */

    editButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const id =
                    Number(
                        button.dataset.id
                    );


                const categories =
                    getCategories();


                const category =
                    categories.find(
                        item =>
                            item.id === id
                    );


                if (!category) {

                    return;

                }


                editingCategoryId =
                    category.id;


                categoryName.value =
                    category.name;


                categoryType.value =
                    category.type;


                document.getElementById(
                    "category-modal-title"
                ).textContent =
                    "Edit Category";


                categoryModal.classList.add(
                    "show"
                );

            }
        );

    });


    /* DELETE */

    deleteButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const id =
                    Number(
                        button.dataset.id
                    );


                const confirmDelete =
                    confirm(
                        "Are you sure you want to delete this category?"
                    );


                if (!confirmDelete) {

                    return;

                }


                const categories =
                    getCategories();


                const updatedCategories =
                    categories.filter(
                        item =>
                            item.id !== id
                    );


                saveCategories(
                    updatedCategories
                );


                renderCategories();


                updateCategorySummary();

            }
        );

    });

}


/* =========================
   SEARCH
========================= */

searchCategory.addEventListener(
    "input",
    () => {

        renderCategories();

    }
);


/* =========================
   CLOSE ON OUTSIDE CLICK
========================= */

categoryModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            categoryModal
        ) {

            closeModal();

        }

    }
);


/* =========================
   INITIAL LOAD
========================= */

renderCategories();

updateCategorySummary();