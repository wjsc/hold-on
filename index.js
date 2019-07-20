const EMPTY = Symbol();
module.exports = (operation, ms) => {
    let cache = EMPTY;
    return function hold(){
        if(cache === EMPTY) {
            cache = operation();
            hold.interval = setTimeout(() => {
                cache = EMPTY;
                delete hold.interval;
            }, ms);
        }
        return cache;
    };
};
