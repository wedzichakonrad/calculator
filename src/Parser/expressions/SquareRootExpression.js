class SquareRootExpression {
    constructor(value) {
        this.value = value;
    }

    interpret() {
        return Math.sqrt(this.value.interpret());
    }
}

module.exports = SquareRootExpression;