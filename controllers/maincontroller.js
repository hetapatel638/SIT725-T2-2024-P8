const Data = require('../models/data');
const UI = require('../views/ui');

class MainController {
    constructor() {
        this.data = new Data();
        this.ui = new UI(this.data);
    }

    run() {
        this.ui.run();
    }
}

module.exports = MainController;