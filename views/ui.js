class UI {
    constructor(data) {
        this.data = data;
    }

    displayItems() {
        this.data.getItems().forEach(item => {
            console.log(item);
        });
    }

    run() {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const askForItem = () => {
            readline.question('Enter an item: ', item => {
                if (item === 'exit') {
                    readline.close();
                } else {
                    this.data.addItem(item);
                    this.displayItems();
                    askForItem();
                }
            });
        };

        askForItem();
    }
}

module.exports = UI;