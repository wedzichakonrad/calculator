class CosineExpression {
    constructor(value) {
        this.value = value;
    }

    interpret() {
        return Math.cos(this.value.interpret());
    }
}

module.exports = CosineExpression;