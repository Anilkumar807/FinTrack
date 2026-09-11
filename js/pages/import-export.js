/* =========================
   IMPORT / EXPORT PAGE
========================= */


/* =========================
   STORAGE KEY
========================= */

const STORAGE_KEY =
    "fintrack_transactions";


/* =========================
   DOM ELEMENTS
========================= */

const exportButton =
    document.getElementById(
        "export-transactions-btn"
    );


const importFile =
    document.getElementById(
        "import-file"
    );


const selectedFileName =
    document.getElementById(
        "selected-file-name"
    );


const importButton =
    document.getElementById(
        "import-transactions-btn"
    );


const messageElement =
    document.getElementById(
        "import-export-message"
    );
const csvPreviewSection =
    document.getElementById(
        "csv-preview-section"
    );


const csvPreviewBody =
    document.getElementById(
        "csv-preview-body"
    );


const csvPreviewSummary =
    document.getElementById(
        "csv-preview-summary"
    );


/* =========================
   GET TRANSACTIONS
========================= */

function getTransactions() {

    const savedTransactions =
        localStorage.getItem(
            STORAGE_KEY
        );


    return savedTransactions
        ? JSON.parse(savedTransactions)
        : [];

}


/* =========================
   SAVE TRANSACTIONS
========================= */

function saveTransactions(
    transactions
) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(transactions)
    );

}


/* =========================
   SHOW MESSAGE
========================= */

function showMessage(
    message,
    type = "success"
) {

    messageElement.textContent =
        message;


    messageElement.className =
        "success-message show";


    if (type === "error") {

        messageElement.style.background =
            "#dc2626";

    }

    else {

        messageElement.style.background =
            "#16a34a";

    }


    setTimeout(
        () => {

            messageElement.classList.remove(
                "show"
            );

        },
        3000
    );

}


/* =========================
   EXPORT TRANSACTIONS
========================= */

exportButton.addEventListener(
    "click",
    () => {

        const transactions =
            getTransactions();


        if (
            transactions.length === 0
        ) {

            showMessage(
                "No transactions available to export.",
                "error"
            );

            return;

        }


        /* CSV HEADER */

        let csvContent =
            "title,category,type,amount,date\n";


        /* CSV DATA */

        transactions.forEach(
            transaction => {

                const title =
                    `"${transaction.title}"`;

                const category =
                    `"${transaction.category}"`;

                const type =
                    transaction.type;

                const amount =
                    transaction.amount;

                const date =
                    transaction.date;


                csvContent +=
                    `${title},${category},${type},${amount},${date}\n`;

            }
        );


        /* CREATE FILE */

        const blob =
            new Blob(
                [csvContent],
                {
                    type:
                        "text/csv"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            "fintrack-transactions.csv";


        document.body.appendChild(
            link
        );


        link.click();


        document.body.removeChild(
            link
        );


        URL.revokeObjectURL(
            url
        );


        showMessage(
            "Transactions exported successfully!"
        );

    }
);


/* =========================
   FILE SELECT + CSV PREVIEW
========================= */

let previewTransactions = [];


importFile.addEventListener(
    "change",
    () => {

        const file =
            importFile.files[0];


        if (!file) {

            selectedFileName.textContent =
                "No file selected";


            importButton.disabled =
                true;


            csvPreviewSection.style.display =
                "none";


            return;

        }


        selectedFileName.textContent =
            file.name;


        const reader =
            new FileReader();


        reader.onload =
            event => {

                const csvData =
                    event.target.result;


                const lines =
                    csvData
                        .split("\n")
                        .filter(
                            line =>
                                line.trim() !== ""
                        );


                if (
                    lines.length <= 1
                ) {

                    showMessage(
                        "CSV file has no transaction data.",
                        "error"
                    );


                    importButton.disabled =
                        true;


                    return;

                }


                const headers =
                    lines[0]
                        .split(",")
                        .map(
                            header =>
                                header
                                    .trim()
                                    .toLowerCase()
                    );


                const requiredHeaders = [
                    "title",
                    "category",
                    "type",
                    "amount",
                    "date"
                ];


                const isValidFormat =
                    requiredHeaders.every(
                        header =>
                            headers.includes(
                                header
                            )
                    );


                if (!isValidFormat) {

                    showMessage(
                        "Invalid CSV format.",
                        "error"
                    );


                    importButton.disabled =
                        true;


                    csvPreviewSection.style.display =
                        "none";


                    return;

                }


                previewTransactions = [];

                let invalidCount = 0;


                for (
                    let i = 1;
                    i < lines.length;
                    i++
                ) {

                    const values =
                        lines[i]
                            .split(",")
                            .map(
                                value =>
                                    value
                                        .trim()
                                        .replace(
                                            /^"|"$/g,
                                            ""
                                        )
                            );


                    const transaction = {

                        title:
                            values[
                                headers.indexOf(
                                    "title"
                                )
                            ],


                        category:
                            values[
                                headers.indexOf(
                                    "category"
                                )
                            ],


                        type:
                            values[
                                headers.indexOf(
                                    "type"
                                )
                            ],


                        amount:
                            Number(
                                values[
                                    headers.indexOf(
                                        "amount"
                                    )
                                ]
                            ),


                        date:
                            values[
                                headers.indexOf(
                                    "date"
                                )
                            ]

                    };


                    /* VALIDATION */

                    if (

                        !transaction.title ||

                        !transaction.category ||

                        ![
                            "income",
                            "expense"
                        ].includes(
                            transaction.type
                        ) ||

                        transaction.amount <= 0 ||

                        !transaction.date

                    ) {

                        invalidCount++;

                        continue;

                    }


                    previewTransactions.push(
                        transaction
                    );

                }


                renderCSVPreview();


                csvPreviewSummary.textContent =
                    `${previewTransactions.length} valid transaction(s) found. ${
                        invalidCount > 0
                            ? invalidCount +
                              " invalid row(s) skipped."
                            : ""
                    }`;


                csvPreviewSection.style.display =
                    "block";


                importButton.disabled =
                    previewTransactions.length === 0;

            };


        reader.readAsText(
            file
        );

    }
);

/* =========================
   RENDER CSV PREVIEW
========================= */

function renderCSVPreview() {

    csvPreviewBody.innerHTML =
        "";


    previewTransactions.forEach(
        transaction => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${transaction.title}
                </td>

                <td>
                    ${transaction.category}
                </td>

                <td>
                    ${transaction.type}
                </td>

                <td>
                    ₹${Number(
                        transaction.amount
                    ).toLocaleString("en-IN")}
                </td>

                <td>
                    ${transaction.date}
                </td>

            `;


            csvPreviewBody.appendChild(
                row
            );

        }
    );

}

function isDuplicateTransaction(
    transaction,
    existingTransactions
) {

    return existingTransactions.some(existing => {

        return (

            String(existing.title || "")
                .trim()
                .toLowerCase()
            ===
            String(transaction.title || "")
                .trim()
                .toLowerCase()

            &&

            String(existing.category || "")
                .trim()
                .toLowerCase()
            ===
            String(transaction.category || "")
                .trim()
                .toLowerCase()

            &&

            String(existing.type || "")
                .trim()
                .toLowerCase()
            ===
            String(transaction.type || "")
                .trim()
                .toLowerCase()

            &&

            Number(existing.amount)
            ===
            Number(transaction.amount)

            &&

            String(existing.date || "")
                .trim()
            ===
            String(transaction.date || "")
                .trim()

        );

    });

}
/* =========================
   IMPORT TRANSACTIONS
========================= */

importButton.addEventListener("click", () => {

    if (previewTransactions.length === 0) {

        showMessage(
            "Please select a valid CSV file first.",
            "error"
        );

        return;

    }


    /* GET EXISTING TRANSACTIONS */

    const existingTransactions =
        getTransactions();


    /* FILTER NEW TRANSACTIONS ONLY */

    const newTransactions = [];


    previewTransactions.forEach(transaction => {

        const formattedTransaction = {

            id: crypto.randomUUID(),

            title: transaction.title.trim(),

            category: transaction.category.trim(),

            type: transaction.type
                .trim()
                .toLowerCase(),

            amount: Number(transaction.amount),

            date: transaction.date.trim()

        };


        /* CHECK DUPLICATE */

        const isDuplicate =
            isDuplicateTransaction(
                formattedTransaction,
                [
                    ...existingTransactions,
                    ...newTransactions
                ]
            );


        /* ADD ONLY IF NOT DUPLICATE */

        if (!isDuplicate) {

            newTransactions.push(
                formattedTransaction
            );

        }

    });


    /* COMBINE TRANSACTIONS */

    const updatedTransactions = [

        ...existingTransactions,

        ...newTransactions

    ];


    /* SAVE */

    localStorage.setItem(
        "fintrack_transactions",
        JSON.stringify(updatedTransactions)
    );


    /* SUCCESS MESSAGE */

    if (newTransactions.length === 0) {

        showMessage(
            "No new transactions imported. Duplicate transactions skipped.",
            "info"
        );

    } else {

        showMessage(
            `${newTransactions.length} new transaction(s) imported successfully!`,
            "success"
        );

    }


    /* RESET */

    importFile.value = "";

    selectedFileName.textContent =
        "No file selected";

    previewTransactions = [];

    csvPreviewBody.innerHTML = "";

    csvPreviewSection.style.display =
        "none";

    importButton.disabled = true;

});