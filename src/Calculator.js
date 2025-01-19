import { parse, expressionTypes } from './Parser/Parser.js';

const expressionTypesArr = Object.values(expressionTypes);
const logButton = document.querySelector('[data-value="log"]')

// obsługa pierwszego znaku ( usuniecie spacji )
const removeEmptySpace = (value) => {
  const splitValue = value.split('')

  if (splitValue[0] === ' ') {
    splitValue.shift();
    return splitValue.join('')
  }
  
  return splitValue.join('')
}

const initializeCalculator = () => {
  const buttons = document.querySelectorAll('[data-value]')

  for (const button of buttons) {
    if (button.dataset.value === 'remove' || button.dataset.value === 'C'){
      button.onclick = () => removeExpression(button.dataset.value);
    } else {
      button.onclick = () => addNewExpression(button.dataset.value);
    }
  }
}

// dodawanie nowych wyrażeń
const addNewExpression = expression => {
  const input = document.querySelector('#expression')
  const isExpressionAnOperator = expressionTypesArr.includes(expression);
  const splitExpression = input.value.split(' ').filter(Boolean);
  const previousExpression = splitExpression[splitExpression.length - 1];
  const secondToPreviousExpression = splitExpression[splitExpression.length - 2];

  // obsługa do zamiany na wartość ujemną
  if (expression === '+/-') {
    input.value += '-'
    return;
  }
  
  // obsułga zapisu logarytmu, w trakcie podawania funkcji logarytmicznej parametrów, przycisk logarytmu zmienia kolor, 
  // biały oznacza żę możemy podać podstawe logarytmu, po podaniu podstawy, przycisk zmieni kolor na jasnozielony,
  // jasnozielony kolor oznacza że po wciśnięciu go będziemy mieli możliwość podania drugiego parametru 
  // funkcji logarytmicznej wówczas kolor zmieni się na ciemnozielony, po wprowadzeniu 2 parametru, przycisk będzie ponownie biały
  if (secondToPreviousExpression === 'log' && expression === 'log') {
    input.value += ` `;
    logButton.style.background = 'green'
    return;
  } else if (previousExpression === 'log' && !isNaN(expression)) {
    logButton.style.background = 'greenyellow'
  } else {
    logButton.style.background = 'white'
  }

    // obsługa zapisu kropki/przecinka
  if ((expression === '.' && isNaN(previousExpression)) || (expression === '.' && previousExpression?.includes('.'))) return;
       
    // obsługa do zapisu reszty działań i funkcji
  if (isExpressionAnOperator) input.value += ` ${expression} `;

    // obsługa do zapisu cyfr
  if (!isExpressionAnOperator) input.value += expression;

  const formattedValue = removeEmptySpace(input.value);
  input.value = formattedValue;

  calculate();
}

// usuwanie wyrażeń
const removeExpression = expression => {
  const input = document.querySelector('#expression')
  const splitExpression = input.value.split(' ').filter(Boolean);
  const lastExpression = splitExpression[splitExpression.length - 1]

  if (splitExpression.length === 0 ) return;

  logButton.style.background = 'white'

  if (expression === 'C') {
    input.value = '';
  } else {
    // usuwanie operatorów, jeśli usuwamy znak, to usuwamy ostatni element tablicy
    if (expressionTypesArr.includes(lastExpression)) {
      splitExpression.pop()
    } else {
      // usuwanie liczb, jeśli usuwamy liczbe to musimy usuwać po jednej cyfrze
      const splitLastExpression = lastExpression.split('');
      splitLastExpression.pop();
      splitExpression.pop()
      splitExpression.push(splitLastExpression.join(''))
    }

    const mappedSplitExpression = splitExpression.map((exp, index, arr) => {
      // obługa większości operatórw matematycznych, oddziela operator od reszty wyrażenia
      if (expressionTypesArr.includes(exp)) {
        return ` ${exp} `;

        // obsługa specjalnych wyrażeń jak logarytm który ma 2 argumenty ORAZ wartości 
        // ujemnej ponieważ używamy tego samego znaku '-' do odejmowania i wartości ujemnej
      } else if ((!expressionTypesArr.includes(exp) && arr[index - 2] === 'log') || (!isNaN(exp) && exp < 0 && !expressionTypesArr.includes(arr[index - 1]))) {
        return ` ${exp}`;
      } else {

        // obsługa liczb, kiedy piszemy liczby nie chcemy ich rozdzielać spacjami
        return exp;
      }
    })

    const formattedValue = removeEmptySpace(mappedSplitExpression.join(''));
    input.value = formattedValue;
  }
  
  calculate();
}

const calculate = () => {
  const input = document.querySelector('#expression')
  const output = document.querySelector('output')

  try {
    const ast = parse(input.value)
    output.innerHTML = ast.interpret()
  } catch {
    if (input.value === '') {
      output.innerHTML = ''
    } else {
      output.innerHTML = 'Error in expression'
    }
  }
}

initializeCalculator()

export { initializeCalculator };
