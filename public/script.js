// Document ready function
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.modal');
  M.Modal.init(elems);

  var timeElems = document.querySelectorAll('.timepicker');
  M.Timepicker.init(timeElems);
});

// Handle form submission
document.getElementById('expenseForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('expenseName').value;
  const amount = document.getElementById('expenseAmount').value;
  const description = document.getElementById('expenseDescription').value;
  const time = document.getElementById('expenseTime').value;

  const expenseData = { name, amount, description, time };

  try {
    const response = await fetch('http://localhost:3000/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expenseData),
    });

    if (response.ok) {
      document.getElementById('successMessage').style.display = 'block';
      setTimeout(() => {
        document.getElementById('successMessage').style.display = 'none';
      }, 3000);

      // Clear the form after success
      document.getElementById('expenseForm').reset();
    } else {
      alert('Failed to add expense. Please try again.');
    }
  } catch (error) {
    console.error('Error adding expense:', error);
    alert('Error connecting to the server. Please try again.');
  }
});

// Fetch expenses
document.getElementById('fetchExpenses').addEventListener('click', async () => {
  try {
    const response = await fetch('http://localhost:3000/expenses');
    const expenses = await response.json();

    const expenseList = document.getElementById('expenseList').querySelector('.row');
    expenseList.innerHTML = '';
    expenses.forEach(expense => {
      const div = document.createElement('div');
      div.className = 'col s12 m6';
      div.innerHTML = `
        <div class="card">
          <div class="card-content">
            <span class="card-title">${expense.name}</span>
            <p>Amount: ${expense.amount}</p>
            <p>Description: ${expense.description}</p>
            <p>Time: ${expense.time}</p>
          </div>
        </div>
      `;
      expenseList.appendChild(div);
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
  }
});

// Establish a connection to the server using socket.io
const socket = io();

// Listen for 'newExpense' event from the server
socket.on('newExpense', (expense) => {
  console.log('New expense received:', expense);
  // Dynamically add the new expense to the list
  const expenseList = document.getElementById('expenseList').querySelector('.row');
  const newExpenseCard = document.createElement('div');
  newExpenseCard.className = 'col s12 m6';
  newExpenseCard.innerHTML = `
    <div class="card">
      <div class="card-content">
        <span class="card-title">${expense.name}</span>
        <p>Amount: ${expense.amount}</p>
        <p>Description: ${expense.description}</p>
        <p>Time: ${expense.time}</p>
      </div>
    </div>
  `;
  expenseList.appendChild(newExpenseCard);
});
