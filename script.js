const display = document.querySelector('.display')
const clearBtn = document.querySelector('#clear')
const backspaceBtn = document.querySelector('#backspace')
const numpad = document.querySelectorAll('.numpad button:not(#plusMinus)')
const operators = document.querySelectorAll('.operators button');
const equalsBtn = document.querySelector('#equals')

let operator = ''
let inputString = ''
let values = []

let operations = {
    'add':      (acc, num) =>  acc + num,
    'subtract': (acc, num) =>  acc - num,
    'multiply': (acc, num) =>  acc * num,
    'divide':   (acc, num) =>  acc / num,
}

function init() {
    values = []
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
     
    let i = 0;
    if (operator != '') {
        i = 1;
    }
    values[i] = parseFloat(inputString)

    log()
}
// NOT WORKING YET.
// function pressBackspaceButton() {
//     inputString = inputString.substring(0,inputString.length -1);
//     refreshDisplay(inputString);
//     log()
// }

function pressOperatorButton(operatorString) {
    // If there are two inputs, then do the operation before setting the operator and clearing the inputstring.
    if (values.length == 2) {
        operate()
    }
    operator = operatorString
    inputString = ''
    log()
}

function operate() {
    if (values.length == 2 && operator != '') {
        result = values.reduce(operations[operator])
        init()
        values = [result]
        refreshDisplay(result)
    }
    log()
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

backspaceBtn.addEventListener('click', () => pressBackspaceButton())
