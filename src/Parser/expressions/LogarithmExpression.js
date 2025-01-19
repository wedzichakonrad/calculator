class LogarithmExpression {
    constructor(base, value) {
        this.base = base;
        this.value = value;
    }

    interpret() {
        return Math.log(this.value.interpret()) / Math.log(this.base.interpret());
    }
}

module.exports = LogarithmExpression;