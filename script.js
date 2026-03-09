// Selectors
const display = document.querySelector('.display')
const clearBtn = document.querySelector('#clear')
const backspaceBtn = document.querySelector('#backspace')
const numpad = document.querySelectorAll('.numpad button:not(#plusMinus)')
const operators = document.querySelectorAll('.operators button');
const equalsBtn = document.querySelector('#equals')


// State
const state = {
    display: '',
    operator: '',
    leftNum: '',
    rightNum: '',
    result: ''
}


// Utility functions
const operations = {
    add:      (a, b) =>  a + b,
    subtract: (a, b) =>  a - b,
    multiply: (a, b) =>  a * b,
    divide:   (a, b) =>  a / b,
}


// App logic
function pressNumberButton(state, buttonString) {
    // Pressing a number after an operation starts in a fresh state.
    if (state.result) {
        init(state);
    }

    // Select which number to record and display: left or right.
    if (!state.operator) {
        state.leftNum += buttonString;
        state.display = state.leftNum
    } else {
        state.rightNum += buttonString;
        state.display = state.rightNum;
    }
    logState()
}

function pressOperatorButton(state, operator) {
    // If there is a result (from equal-button or operator-button), then move result to leftNum.
    if (state.result) {
        state.leftNum = state.result;
        state.result = '';
    }

    // Set the operator when a leftNum is present.
    if (state.leftNum) {
        state.operator = operator;
    }
    logState()
}

function operate(state, operations) {
    if (state.leftNum && state.operator && state.rightNum) {
        // Choose operator function and run operation. Write result string to state.result.
        const operatorFn = operations[state.operator];
        state.result = operatorFn(parseFloat(state.leftNum), parseFloat(state.rightNum)).toString();

        logState()
        // Write result to display and clear other variables.
        state.display = state.result
        state.leftNum = ''
        state.rightNum = ''
        state.operator = ''
        logState()
    }
    logState()
}


// UI/render functions
function render() {
    display.textContent = state.display  ;
}

function logState() {
    console.log(state)
}


// Event handlers
numpad.forEach((button) => 
    button.addEventListener('click', () => {
        pressNumberButton(state, button.textContent);
        render();
    })
);

operators.forEach((button) =>
    button.addEventListener('click', (e) => {
        operate(state, operations);
        pressOperatorButton(state, e.target.id);
        render();
    })
);

equalsBtn.addEventListener('click', () => {
    operate(state, operations)
    render()
})

clearBtn.addEventListener('click', () => {
    init(state)
    render()
});

// backspaceBtn.addEventListener('click', () => pressBackspaceButton())


// Initialization
function init(state) {
    state.leftNum = '';
    state.rightNum = '';
    state.operator = '';
    state.display = '';
    state.result = '';
}


// NOT WORKING YET.
// function pressBackspaceButton() {
//     inputString = inputString.substring(0,inputString.length -1);
//     refreshDisplay(inputString);
//     log()
// }

logState()
