class PercentExpression {
    constructor(value) {
        this.value = value;
    }

    interpret() {
        return this.value.interpret() / 100;
    }
}

module.exports = PercentExpression;