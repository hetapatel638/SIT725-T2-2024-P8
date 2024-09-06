import pkg from 'mongodb';
const { MongoClient } = pkg;
import { expect } from 'chai';
import Data from '../models/data.mjs'; // Adjust the path and extension as necessary

describe('Data class', () => {
  let connection;
  let db;
  let data;

  before(async () => {
    connection = await MongoClient.connect('mongodb+srv://patelheta2512:cbx7EmgcTVmIphtR@cluster0.vtk6v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db('jest');
    data = new Data(db);
  });

  after(async () => {
    await connection.close();
  });

  beforeEach(async () => {
    await db.collection('expenses').deleteMany({});
  });

  // Function to generate dynamic expenses
  const generateExpense = (name, amount, description, time) => ({
    name: name || `Test Expense ${Math.random().toString(36).substring(7)}`,
    amount: amount || Math.floor(Math.random() * 500),
    description: description || 'Random Description',
    time: time || new Date().toLocaleTimeString()
  });

  it('addExpense should insert a new expense', async () => {
    const expense = generateExpense('Test Expense', 100, 'Test Description', '12:00');
    await data.addExpense(expense);

    const insertedExpense = await db.collection('expenses').findOne({ name: expense.name });
    expect(insertedExpense).to.include(expense);
  });

  it('getExpenses should return all expenses', async () => {
    const expenses = [
      generateExpense('electronics', 50, 'KMart', '10:00 AM'),
      generateExpense('groceries', 150, 'Coles', '02:00 PM'),
      generateExpense(), // Dynamic expense with random data
    ];
    await db.collection('expenses').insertMany(expenses);

    const fetchedExpenses = await data.getExpenses();
    expect(fetchedExpenses).to.deep.include.members(expenses);
  });
});
