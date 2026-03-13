// Selectors
const display = document.querySelector('.display')
const numpad = document.querySelector('.numpad')
const operators = document.querySelector('.operators');
const clearBtn = document.querySelector('#clear')
const backspaceBtn = document.querySelector('#backspace')
// const equalsBtn = document.querySelector('#equals')


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
function setNumberTarget() {
    return state.operator ? 'rightNum' : 'leftNum';
}

function pressNumpadButton(type, value) {
    logState()
    const target = setNumberTarget();
    console.log(type)
    console.log(value)
    console.log(target)
    switch (type) {
        case 'digit': 
            // Pressing a digit after an operation starts in a fresh state.
            if (state.result) {
                init(state);
            }
        
            // Select target (leftNum, rightNum), append buttonString if target string is not too long, and update state.display
            if (state[target].length < 9) {
                state[target] += value;
            }
            break;

        case 'sign':
            state[target] = String(0 - Number(state[target]))
            break;

        case 'decimal': 
            break;
    }
    state.display = state[target];
    logState()
}


function pressBackspaceButton(state) {
    const target = state.operator ? 'rightNum' : 'leftNum';
    state[target] = state[target].substring(0,state[target].length -1);
    state.display = state[target];
    logState()
}

function pressOperatorButton(state, operator) {
    // If there is a valid result (from equal-button or operator-button), then move result to leftNum.
    if (state.result && state.result !== 'div/0') {
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
        // Check for divide-by-0. Else, choose operator function and run operation. Write result string to state.result.
        if (state.operator === 'divide' && state.rightNum === '0') {
            state.result = 'div/0';
        } else {
            const operatorFn = operations[state.operator];
            state.result = String(operatorFn(Number(state.leftNum), Number(state.rightNum)));
        }
        
        logState()
        // Limit number of digits, then write result to display and clear other variables.
        if (state.result.length > 9) {
            state.result = state.result.slice(0, 9) + '...'            
        }
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
numpad.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const {type, value} = btn.dataset;
    pressNumpadButton(type, value);
    render();
});

operators.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    operate();
    const operator = btn.dataset;
    if (operator != 'operate') {
        pressOperatorButton(operator);
    }
    render();
})


// operators.forEach((button) =>
//     button.addEventListener('click', (e) => {
        
//         operate(state, operations);
//         pressOperatorButton(state, e.target.id);
//         render();
//     })
// );

// equalsBtn.addEventListener('click', () => {
//     operate(state, operations)
//     render()
// })

clearBtn.addEventListener('click', () => {
    init(state)
    render()
});

backspaceBtn.addEventListener('click', () => {
    pressBackspaceButton(state);
    render();
});

// Initialization
function init(state) {
    state.leftNum = '';
    state.rightNum = '';
    state.operator = '';
    state.display = '';
    state.result = '';
}

logState()
