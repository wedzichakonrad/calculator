import NumberExpression from './expressions/NumberExpression.js';
import AddExpression from './expressions/AddExpression.js';
import SubtractExpression from './expressions/SubtractExpression.js';
import MultiplyExpression from './expressions/MultiplyExpression.js';
import DivisionExpression from './expressions/DivisionExpression.js';
import PowerExpression from './expressions/PowerExpression.js';
import SquareRootExpression from './expressions/SquareRootExpression.js';
import PiExpression from './expressions/PiExpression.js';
import LogarithmExpression from './expressions/LogarithmExpression.js';
import PercentExpression from './expressions/PercentExpression.js';
import SineExpression from './expressions/SineExpression.js';
import CosineExpression from './expressions/CosineExpression.js';
import FactorialExpression from './expressions/FactorialExpression.js';

const expressionTypes = {
    ADD: '+',
    SUBTRACT: '-',
    MULTIPLY: '*',
    DIVIDE: ':',
    FACTORIAL: '!',
    POWER: '^',
    SQUAREROOT: '√',
    PI: 'π',
    LOGARITHM: 'log',
    SINE: 'sin',
    COSINE: 'cos',
    PERCENT: '%',
    OPEN_PARENTHESIS: '(',
    CLOSE_PARENTHESIS: ')',
};

function tokenize(input) {
    return input.split(' ').filter(Boolean).map(token => isNaN(token) ? token : new NumberExpression(parseFloat(token)));
}

function parse(input) {
    const tokens = tokenize(input);
    
    const stack = [];
    const output = [];
    
    for (const tokenIndex in tokens) {
        const token = tokens[tokenIndex];
        const previousToken = tokens[parseInt(tokenIndex) - 1];
        const nextToken = tokens[parseInt(tokenIndex) + 1];

        if (typeof token === 'string') {

            // Obsługa działań

            if (token === expressionTypes.OPEN_PARENTHESIS) {
                stack.push(token); // Wrzucamy nawias do kolejki

            } else if (token === expressionTypes.CLOSE_PARENTHESIS) {
                while (stack.length > 0 && stack[stack.length - 1] !== expressionTypes.OPEN_PARENTHESIS) {
                    output.push(stack.pop()); // Wszystko co jest w nawiasie ( poza znakiem naiwasu ) wrzucamy do outputa
                }
                stack.pop(); // Usuwamy otwierający nawias z kolejki
                
            // Obsługa funkcji jedno-parametrowych
            } else if (token === expressionTypes.SQUAREROOT) {
                output.push(new SquareRootExpression(nextToken));

            } else if (token === expressionTypes.FACTORIAL) {
                output.push(new FactorialExpression(previousToken));

            } else if (token === expressionTypes.PI) {
                output.push(new PiExpression())

            } else if (token === expressionTypes.PERCENT) {
                output.push(new PercentExpression(previousToken))

            } else if (token === expressionTypes.SINE) {
                output.push(new SineExpression(nextToken))

            } else if (token === expressionTypes.COSINE) {
                output.push(new CosineExpression(nextToken))

            } else {
                // Obsługa dwu-parametrowych operatorów i funkcji ( wraz z kolejnością działań )
                while (stack.length > 0 && precedence(stack[stack.length - 1]) >= precedence(token)) {
                    output.push(stack.pop());
                }
                stack.push(token);
            }
        } else {
            // Obsługa operatora liczbowego
            if (previousToken !== expressionTypes.SQUAREROOT && 
                previousToken !== expressionTypes.SINE && 
                previousToken !== expressionTypes.COSINE && 
                nextToken !== expressionTypes.PERCENT && 
                nextToken !== expressionTypes.FACTORIAL) {
                output.push(token);
            }
        }
    }

    while (stack.length > 0) {
        output.push(stack.pop());
    }

    return buildAST(output);
}


function precedence(op) {
    switch (op) {
        case expressionTypes.ADD:
        case expressionTypes.SUBTRACT:
            return 1;
        case expressionTypes.MULTIPLY:
        case expressionTypes.DIVIDE:
            return 2;
        case expressionTypes.POWER:
            return 3;
        case expressionTypes.LOGARITHM:
            return 4;
        default:
            return 0;
    }
}

function buildAST(output) {
    let stack = [];

    for (let token of output) {
        if (typeof token !== 'string') {
            stack.push(token);
        } else {
            const right = stack.pop();
            const left = stack.pop();

            switch (token) {
                case expressionTypes.ADD:
                    stack.push(new AddExpression(left, right));
                    break;
                case expressionTypes.SUBTRACT:
                    stack.push(new SubtractExpression(left, right));
                    break;
                case expressionTypes.MULTIPLY:
                    stack.push(new MultiplyExpression(left, right));
                    break;
                case expressionTypes.DIVIDE:
                    stack.push(new DivisionExpression(left, right));
                    break;
                case expressionTypes.POWER:
                    stack.push(new PowerExpression(left, right));
                    break;
                case expressionTypes.LOGARITHM:
                    stack.push(new LogarithmExpression(left, right));
                    break;
                default:
                    throw new Error(`Unknown operator: ${token}`);
            }
        }
    }

    return stack[0];
}

export { expressionTypes, parse };