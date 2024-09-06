class Data {
    constructor(db) {
        this.collection = db.collection('expenses');
    }

    async addExpense(expense) {
        await this.collection.insertOne(expense);
    }

    async getExpenses() {
        return await this.collection.find({}).toArray();
    }
}

module.exports = Data;