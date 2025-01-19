class SineExpression {
    constructor(value) {
        this.value = value;
    }

    interpret() {
        return Math.sin(this.value.interpret());
    }
}

module.exports = SineExpression;