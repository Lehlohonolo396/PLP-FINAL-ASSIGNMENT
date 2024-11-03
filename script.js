const expenseForm = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');

document.addEventListener('DOMContentLoaded', loadExpenses);

// Submit form to add a new expense
expenseForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('expense-name').value;
  const amount = document.getElementById('expense-amount').value;
  const date = document.getElementById('expense-date').value;

  const response = await fetch('http://localhost:3000/api/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, amount, date })
  });

  const expense = await response.json();
  addExpenseToList(expense);

  expenseForm.reset();
});

// Load expenses from the server
async function loadExpenses() {
  const response = await fetch('http://localhost:3000/api/expenses');
  const expenses = await response.json();
  expenseList.innerHTML = '';
  expenses.forEach(addExpenseToList);
}

// Add an expense to the UI list
function addExpenseToList(expense) {
  const li = document.createElement('li');
  li.innerHTML = `
    <span>${expense.name}</span>
    <span>$${expense.amount}</span>
    <span>${expense.date}</span>
    <span class="delete-btn" onclick="deleteExpense(${expense.id})">Delete</span>
  `;
  expenseList.appendChild(li);
}

// Delete expense from the server and UI
async function deleteExpense(id) {
  await fetch(`http://localhost:3000/api/expenses/${id}`, { method: 'DELETE' });
  
  // Reload the list
  loadExpenses();
}
