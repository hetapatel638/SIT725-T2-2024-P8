export default class Data {
    constructor(db) {
      this.db = db;
    }
  
    async addExpense(expense) {
      await this.db.collection('expenses').insertOne(expense);
    }
  
    async getExpenses() {
      return await this.db.collection('expenses').find().toArray();
    }
  }