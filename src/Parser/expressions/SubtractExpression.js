class SubtractExpression {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }

    interpret() {
        return this.left.interpret() - this.right.interpret();
    }
}

module.exports = SubtractExpression;