document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/budgets')
      .then(response => response.json())
      .then(data => {
        const budgetsDiv = document.getElementById('budgets');
        data.forEach(budget => {
          const budgetItem = document.createElement('div');
          budgetItem.textContent = `Name: ${budget.name}, Amount: ${budget.amount}`;
          budgetsDiv.appendChild(budgetItem);
        });
      })
      .catch(error => console.error('Error fetching budgets:', error));
  });