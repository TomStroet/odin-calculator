const display = document.querySelector('.display')
const clearBtn = document.querySelector('#clear')
const backspaceBtn = document.querySelector('#backspace')
const numpad = document.querySelectorAll('.numpad button:not(#plusMinus)')
const operators = document.querySelectorAll('.operators button');
const equalsBtn = document.querySelector('#equals')

let operator = ''
let inputString = ''
// let step = 0
let values = []

let operations = {
    'add':      (acc, num) =>  acc + num,
    'subtract': (acc, num) =>  acc - num,
    'multiply': (acc, num) =>  acc * num,
    'divide':   (acc, num) =>  acc / num,
}

function init() {
    values = []
    // step = 0
    operator = ''
    inputString = ''
    refreshDisplay(inputString)
}

function log() {
    console.log(`inputString ${inputString}`)
    console.log(`values: ${values}`)
    console.log(`operator ${operator}`)
    console.log(`Display: ${display.textContent}`)
}

function refreshDisplay(string) {
    display.textContent = string;
}

function pressNumberButton(buttonString) {
    inputString += buttonString;
    refreshDisplay(inputString)
    inputFloat = parseFloat(inputString)

    let i = 0;
    if (operator != '') {
        i = 1;
    }
    values[i] = inputFloat

    log()
}


function pressOperatorButton(operatorString) {
    if (values.length == 1) {
        // if values contains only one value, then set the operator and clear the inputstring so it is ready for the second number input.
        operator = operatorString;
        inputString = ''
    } else if (values.length == 2) {
        // If there are two inputs, then do the operation, then set the result as values[0], set the operator and clear the inputstring. 
        result = operate()
        values = [result]
        operator = operatorString
        inputString = ''
    }

    log()
}

function operate() {
    result = values.reduce(operations[operator])
    refreshDisplay(result)
    values = [result]
    operator = ''
    inputString = ''

    log()
    return result
}


numpad.forEach((button) => 
    button.addEventListener('click', () => {
        pressNumberButton(button.textContent);
    })
);

operators.forEach((button) =>
    button.addEventListener('click', (e) => {
        pressOperatorButton(e.target.id);
    })
);

equalsBtn.addEventListener('click', () => operate())

clearBtn.addEventListener('click', () => init())

backspaceBtn.addEventListener('click', () => {
    displayValue = displayValue.substring(0,displayValue.length -1);
    refreshDisplay(displayValue);
})
