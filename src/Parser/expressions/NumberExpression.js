class NumberExpression {
    constructor(value) {
        this.value = value;
    }

    interpret() {
        return this.value;
    }
}

module.exports = NumberExpression;