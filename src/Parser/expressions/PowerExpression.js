class PowerExpression {
    constructor(base, exponent) {
        this.base = base;
        this.exponent = exponent;
    }

    interpret() {
        return Math.pow(this.base.interpret(), this.exponent.interpret());
    }
}

module.exports = PowerExpression;