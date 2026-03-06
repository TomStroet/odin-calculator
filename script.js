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
    leftNum: null,
    rightNum: null,
    result: null
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
    if (state.result) {
        state.display = '';
        state.result = null;
    }
    state.display += buttonString;
    logState()
}

function pressOperatorButton(state, operator) {
    if (!state.leftNum && state.display) {
        state.leftNum = parseFloat(state.display);
        state.display = '';
    }
    if (state.leftNum && state.operator && state.display) {
        operate(state, operations)
    }
    if (state.result) {
        state.leftNum = state.result;
    }
    if (state.leftNum) {
        state.operator = operator;
    }
    logState()
}

function operate(state, operations) {
    if (state.leftNum && state.operator && state.display) {
        state.rightNum = parseFloat(state.display);
        logState()
        state.result = operations[state.operator](state.leftNum, state.rightNum)
        state.leftNum = null
        state.rightNum = null
        state.operator = ''
        logState()
        state.display = state.result
    }
    logState()
}


// UI/render functions
function render() {
    display.textContent = state.display;
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
        pressOperatorButton(state, e.target.id);
        if (state.result) {
            render();
        }
    })
);

equalsBtn.addEventListener('click', () => {
    operate(state, operations)
    render()
})

clearBtn.addEventListener('click', () => init())

backspaceBtn.addEventListener('click', () => pressBackspaceButton())


// Initialization
function init() {
    values = []
    operator = ''
    inputString = ''
    refreshDisplay(inputString)
}


// NOT WORKING YET.
// function pressBackspaceButton() {
//     inputString = inputString.substring(0,inputString.length -1);
//     refreshDisplay(inputString);
//     log()
// }

logState()
