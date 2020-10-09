/* JS-code inspired by "Freshman-tech" calc-tutorial, functions for % and +/- added. */


const calculator = {
  displayValue: '0',
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
  isNegative: false,
};

function inputDigit(digit) {
  const { displayValue, waitingForSecondOperand } = calculator;

  if (waitingForSecondOperand === true) {
    calculator.displayValue = digit;
    calculator.waitingForSecondOperand = false;
  } 

  else if(calculator.displayValue == ("-0")) {
    calculator.displayValue = "-" + digit;
  }
  
  else {
    calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
  }

  console.log(calculator);
}

function inputDecimal(dot) {
  if (calculator.waitingForSecondOperand === true) { 
      calculator.displayValue = "0."
      calculator.waitingForSecondOperand = false;
    return; 
  }
  if (!calculator.displayValue.includes(dot)) {
    calculator.displayValue += dot;
  }
}

function handleOperator(nextOperator) {
  const { firstOperand, displayValue, operator } = calculator
  const inputValue = parseFloat(displayValue);
  const isNegative = calculator.isNegative;

  //kollar om det redan finns en operator och i så fall skrivs den över.
  // ingen beräkning utförs. 
  if (operator && calculator.waitingForSecondOperand)  {
    calculator.operator = nextOperator;
    return;
  } 

  //kollar om operand 1 är tom och att inputValue inte är ett Nan-värde(ex. komma)).
  if (firstOperand == null && !isNaN(inputValue)) {
    //uppdaterar operand 1 med värdet.
    calculator.firstOperand = inputValue;
  } 

  else if (firstOperand == "-" + "0") {
    calculator.firstOperand = "-" + inputValue;
  }

  //om operand 1 har ett värde utförs beräkning av resultat. 
  else if (operator) {
    const result = calculate(firstOperand, inputValue, operator);
    calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
    //för att kunna fortsätta räkna på resultatet
    calculator.firstOperand = result;
  }

  //opertorn läggs till om calculatorn väntar på nästa operand
  calculator.waitingForSecondOperand = true;
  calculator.operator = nextOperator;
}

function calculate(firstOperand, secondOperand, operator) {

  if (operator === '+') {
    return firstOperand + secondOperand;
  } else if (operator === '-') {
    return firstOperand - secondOperand;
  } else if (operator === '*') {
    return firstOperand * secondOperand;
  } else if (operator === '/') {
    return firstOperand / secondOperand;
  }
}

function resetCalculator() {
  calculator.displayValue = '0';
  calculator.firstOperand = null;
  calculator.waitingForSecondOperand = false;
  calculator.operator = null;
  calculator.isNegative = false;
}

function updateDisplay() {
  const display = document.querySelector('.screen');
  display.value = calculator.displayValue;
}

updateDisplay();

const keys = document.querySelector('.keys');

keys.addEventListener('click', event => {
  const { target } = event;
  const { value } = target;

  if (!target.matches('button')) {
    return;
  }

  switch (value) {
    case '+':
    case '-':
    case '*':
    case '/':
    case '=':
      handleOperator(value);
      break;

    case '.':
      inputDecimal(value);
      break;

    case 'allclear':
      resetCalculator();
      break;

    case '%':
      calculator.displayValue = calculator.displayValue * 0.01;
      break;

    case '+/-':
      //om negativt - gör positivt
      if (calculator.displayValue.charAt(0) == "-") {
        calculator.displayValue = calculator.displayValue.substring(1);
        calculator.isNegative = false;
      }
      else {
        calculator.displayValue = "-" + calculator.displayValue;
        calculator.isNegative = true;
      }
      break;

    default:
      if (Number.isInteger(parseFloat(value))) {
        inputDigit(value);
      }
  }

  updateDisplay();
});

