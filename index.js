const hold = (operation, ms) => {
    const symbol = Symbol();
    let value = symbol;
    return () => {
        if(value === symbol) {
            value = operation();
            setTimeout(() => {
                value = symbol;
            }, ms);
        }
        return value;
    };
};

module.exports = hold;