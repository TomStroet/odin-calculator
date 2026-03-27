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
    // return the target state variable based on whether operator is filled. Order is always left -> operator -> right.
    return state.operator ? 'rightNum' : 'leftNum';
}

function pressNumpadButton(type, value) {
    // Pressing a digit after an operation starts in a fresh state.
    if (state.result || state.error) {
        init();
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
    if (state.result) {
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
            // run operation and store result
            const operatorFn = operations[state.operator];
            state.result = String(operatorFn(Number(state.leftNum), Number(state.rightNum)));
            
            // format result in case of more than 9 digits.
            if (state.result.length > 9) {
                let resultSliced = state.result.slice(0, 9);
                if (resultSliced.indexOf('.') === -1) {
                    resultSliced += '...';
                };
                state.result = resultSliced;
            };

            // push result to display
            state.display = state.result
        }
        
        // Clear state variables.
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
    btn.blur();
    render();
    logState()
});

operators.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    
    operate();
    const operator = btn.dataset.type;
    if (operator !== 'operate') {
        pressOperatorButton(operator);
    }
    btn.blur();
    render();
    logState()
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
    btn.blur();
    render();
})

document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        pressNumpadButton('digit', e.key)
    } else if (e.key === '.') {
        pressNumpadButton('decimal', e.key)
    } else if (['+', '-', '*', '/'].includes(e.key)) {
        operate()
        let operator = ''
        switch (e.key) {
            case '+': operator = 'add'; break;
            case '-': operator = 'subtract'; break;
            case '*': operator = 'multiply'; break;
            case '/': operator = 'divide'; break;
        }
        pressOperatorButton(operator)
    } else if (e.key === '=' || e.key === 'Enter') {
        operate(); 
    } else if (e.key === 'Delete' || e.key === 'Escape') {
        init();
    } else if (e.key === 'Backspace') {
        pressBackspaceButton();
    }
    render();
})


// Initialization
function init() {
    state.leftNum = '';
    state.rightNum = '';
    state.operator = '';
    state.display = '';
    state.result = '';
    state.error = '';
}
