// Selectors
const display = document.querySelector('.display')
const numpad = document.querySelector('.numpad')
const operators = document.querySelector('.operators');
const controls = document.querySelector('.controls')

// State
const state = {
    leftNum: '',
    operator: '',
    rightNum: '',
    result: '',
    display: '',
    error: '',
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
    // Pressing a digit after an operation starts in a fresh state.
    if (state.result) {
        init(state);
    }

    const target = setNumberTarget();
    switch (type) {
        case 'digit': 
            // Append digit value if target string is not too long, and update state.display
            if (state[target].length < 9) {
                state[target] += value;
            }
            break;

        case 'sign':   
            state[target] = !state[target].includes('-') 
                ? '-' + state[target]
                : state[target].slice(1)
            break;

        case 'decimal': 
            if (!state[target].includes('.')) {
                if (state[target] === '') {
                    state[target] += '0';
                }
                state[target] += '.';
            }
            break;
    }
    state.display = state[target];
}


function pressBackspaceButton() {
    const target = setNumberTarget();
    state[target] = state[target].substring(0,state[target].length -1);
    state.display = state[target];
}

function pressOperatorButton(operator) {
    // If there is a valid result (from equal-button or operator-button), then move result to leftNum.
    if (state.result && state.result !== 'div/0') {
        state.leftNum = state.result;
        state.result = '';
    }

    // Set the operator when a leftNum is present.
    if (state.leftNum) {
        state.operator = operator;
    }
}

function operate() {
    if (state.leftNum && state.operator && state.rightNum) {
        // Check for divide-by-0. Else, choose operator function and run operation. Write result string to state.result.
        if (state.operator === 'divide' && state.rightNum === '0') {
            state.error = 'div/0';
            state.display = state.error;
        } else {
            const operatorFn = operations[state.operator];
            state.result = String(operatorFn(Number(state.leftNum), Number(state.rightNum)));
            
            // Limit number of digits, then write result to display and clear other variables.
            if (state.result.length > 9) {
                state.result = state.result.slice(0, 9) + '...'            
            }
        }

        
        state.display = state.result
        state.leftNum = ''
        state.rightNum = ''
        state.operator = ''
    }
}


// UI/render functions
function render() {
    display.textContent = state.display;
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
    logState();
});

operators.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    
    operate();
    const operator = btn.dataset.type;
    if (operator != 'operate') {
        pressOperatorButton(operator);
    }
    render();
    logState();
})

controls.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const control = btn.dataset.type;
    switch (control) {
        case 'backspace':
            pressBackspaceButton();
            break;
        case 'clear':
            init();
            break;    
    } 
    render();
    logState();
})

// Initialization
function init() {
    state.leftNum = '';
    state.rightNum = '';
    state.operator = '';
    state.display = '';
    state.result = '';
}
