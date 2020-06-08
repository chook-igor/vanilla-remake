const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const currency = document.getElementById('currency');
const balanceClrChange = document.getElementById('balance-info');
const totalInUsd = document.getElementById('balance-in-usd');
const totalInEuro = document.getElementById('balance-in-euro');
let totalCurency = '';

const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions'));

let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add a text and amount');
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();
    text.value = '';
    amount.value = '';
  }
}

function generateID() {
  return Math.floor(Math.random() * 100000000);
}

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');

  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(
    transaction.amount
  )}</span> <button class="delete-btn" onclick="removeTransaction(${
    transaction.id
  })">x</button>`;
  list.appendChild(item);
}

function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1).toFixed(2);

  balance.innerText = `\u20b4 ${total}`;
  money_plus.innerText = `\u20b4 ${income}`;
  money_minus.innerText = `\u20b4 ${expense}`;
  
  if (total < 0) balanceClrChange.style.color = "red";
  else if (total>0) balanceClrChange.style.color = "green";
  else balanceClrChange.style.color = "black";
  totalCurency = total;
  currencyValueJson();
} 
  
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

form.addEventListener('submit', addTransaction);

async function currencyValueJson() {
  fetch('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5')
  .then(res => res.json())
  .then ( data => { 
    totalInUsd.innerText = `$  ${(totalCurency / data[0].buy).toFixed(2)}`
    totalInEuro.innerText = `\u20ac  ${(totalCurency / data[1].buy).toFixed(2)}`
  })
}