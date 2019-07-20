const hold = (operation, ms) => {
    const symbol = Symbol();
    let value = symbol;
    return function x(){
        if(value === symbol) {
            value = operation();
            x.interval = setTimeout(() => {
                value = symbol;
                delete x.interval;
            }, ms);
        }
        return value;
    };
};

module.exports = hold;