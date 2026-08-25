const display = document.getElementById("display");

const copyBtn = document.getElementById("copyBtn");

const historyBtn = document.getElementById("historyBtn");

const historyPanel = document.getElementById("historyPanel");

const historyList = document.getElementById("historyList");

const clearHistoryBtn =
    document.getElementById("clearHistoryBtn");

const themeToggle =
    document.getElementById("themeToggle");


let history = [];


/* Add Value */

function appendValue(value) {

    if (display.value === "Error") {
        display.value = "";
    }

    const currentValue = display.value;

    const operators = ["+", "-", "*", "/"];

    const lastCharacter =
        currentValue[currentValue.length - 1];


    /* Prevent multiple operators */

    if (
        operators.includes(value) &&
        operators.includes(lastCharacter)
    ) {

        display.value =
            currentValue.slice(0, -1) + value;

        return;
    }


    /* Prevent multiple decimal points */

    if (value === ".") {

        const parts =
            currentValue.split(/[+\-*/]/);

        const currentNumber =
            parts[parts.length - 1];

        if (currentNumber.includes(".")) {
            return;
        }

        if (
            currentNumber === "" ||
            currentNumber === undefined
        ) {

            display.value += "0.";
            return;
        }
    }


    display.value += value;
}


/* Clear */

function clearDisplay() {

    display.value = "";
}


/* Delete */

function deleteLast() {

    if (display.value === "Error") {

        display.value = "";

        return;
    }

    display.value =
        display.value.slice(0, -1);
}


/* Calculate */

function calculate() {

    if (display.value.trim() === "") {
        return;
    }

    try {

        const originalExpression =
            display.value;


        let expression =
            originalExpression;


        /* Percentage Support */

        expression =
            expression.replace(
                /(\d+(\.\d+)?)%/g,
                "($1/100)"
            );


        /* Only allow safe calculator characters */

        if (
            !/^[0-9+\-*/().\s]+$/.test(expression)
        ) {

            throw new Error(
                "Invalid expression"
            );
        }


        const result =
            Function(
                '"use strict"; return (' +
                expression +
                ')'
            )();


        if (
            !Number.isFinite(result)
        ) {

            throw new Error(
                "Invalid calculation"
            );
        }


        const roundedResult =
            Number.isInteger(result)
                ? result
                : parseFloat(
                    result.toFixed(10)
                );


        addToHistory(
            originalExpression +
            " = " +
            roundedResult
        );


        display.value =
            roundedResult;

    }

    catch (error) {

        display.value = "Error";
    }
}


/* Add History */

function addToHistory(item) {

    history.unshift(item);

    /* Keep latest 10 calculations */

    if (history.length > 10) {

        history.pop();
    }

    updateHistory();
}


/* Update History */

function updateHistory() {

    historyList.innerHTML = "";


    if (history.length === 0) {

        const li =
            document.createElement("li");

        li.textContent =
            "No calculations yet";

        li.className =
            "empty-history";

        historyList.appendChild(li);

        return;
    }


    history.forEach((item) => {

        const li =
            document.createElement("li");

        li.textContent = item;

        historyList.appendChild(li);
    });
}


/* Show / Hide History */

historyBtn.addEventListener(
    "click",
    () => {

        historyPanel.classList.toggle(
            "show"
        );
    }
);


/* Clear History */

clearHistoryBtn.addEventListener(
    "click",
    () => {

        history = [];

        updateHistory();
    }
);


/* Copy Result */

copyBtn.addEventListener(
    "click",
    async () => {

        if (
            display.value === "" ||
            display.value === "Error"
        ) {
            return;
        }


        try {

            await navigator.clipboard.writeText(
                display.value
            );


            copyBtn.textContent =
                "✅ Copied";


            setTimeout(() => {

                copyBtn.textContent =
                    "📋 Copy";

            }, 1500);

        }

        catch (error) {

            alert(
                "Unable to copy the result."
            );
        }
    }
);


/* Theme Toggle */

themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "light-mode"
        );


        if (
            document.body.classList.contains(
                "light-mode"
            )
        ) {

            themeToggle.textContent =
                "☀️";

        }

        else {

            themeToggle.textContent =
                "🌙";
        }
    }
);


/* Keyboard Support */

document.addEventListener(
    "keydown",
    (event) => {

        const key = event.key;


        if (
            !isNaN(key) ||
            [
                "+",
                "-",
                "*",
                "/",
                ".",
                "%"
            ].includes(key)
        ) {

            appendValue(key);
        }


        else if (key === "Enter") {

            event.preventDefault();

            calculate();
        }


        else if (key === "Backspace") {

            deleteLast();
        }


        else if (key === "Escape") {

            clearDisplay();
        }
    }
);