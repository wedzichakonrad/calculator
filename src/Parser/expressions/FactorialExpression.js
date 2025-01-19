class FactorialExpression {
    constructor(value) {
        this.value = value;
    }

    interpret() {
        const val = this.value.interpret();
        if (val < 0 || !Number.isInteger(val)) {
            throw new Error("Silnia jest zdefiniowana tylko dla liczb całkowitych nieujemnych.");
        }
        return this.factorial(val);
    }

    factorial(n) {
        if (n === 0 || n === 1) {
            return 1;
        }
        return n * this.factorial(n - 1);
    }
}

module.exports = FactorialExpression;