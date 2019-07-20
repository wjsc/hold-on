const sinon = require('sinon');
const chai = require('chai');
const hold = require('../index');

describe('Hold On - Execution Tests', () => {
    it('One operation and one call | result', () => {
        const operation = sinon.stub().returns(50);
        const cachedOperation = hold(operation, 1);
        chai.expect(cachedOperation()).to.eql(50);
    });

    it('One operation and one call call | count', () => {
        const operation = sinon.fake();
        const cachedOperation = hold(operation, 1);
        cachedOperation();
        chai.expect(operation.callCount).to.eql(1);

    });

    it('One operation and one call with long cache time | result', () => {
        const operation = sinon.stub().returns(5000);
        const cachedOperation = hold(operation, 10000000);
        chai.expect(cachedOperation()).to.eql(5000);
        clearInterval(cachedOperation.interval);
    });

    it('One operation and one call  with long cache time | call count', () => {
        const operation = sinon.fake();
        const cachedOperation = hold(operation, 10000000);
        cachedOperation();
        chai.expect(operation.callCount).to.eql(1);
        clearInterval(cachedOperation.interval);
    });

    it('One operation with many calls | result', () => {
        const operation = sinon.stub().returns(50)
        const cachedOperation = hold(operation, 1);
        chai.expect(cachedOperation()).to.eql(50);
        chai.expect(cachedOperation()).to.eql(50);
        chai.expect(cachedOperation()).to.eql(50);
        chai.expect(cachedOperation()).to.eql(50);
        chai.expect(cachedOperation()).to.eql(50);
        chai.expect(cachedOperation()).to.eql(50);
        chai.expect(cachedOperation()).to.eql(50);
    });

    it('One operation with many calls | call count', () => {
        const operation = sinon.fake();
        const cachedOperation = hold(operation, 1);
        cachedOperation();
        cachedOperation();
        cachedOperation();
        cachedOperation();
        cachedOperation();
        cachedOperation();
        cachedOperation();
        cachedOperation();
        chai.expect(operation.callCount).to.eql(1);
    });

    it('One operation with many calls and expired | result', () => {
        const operation = sinon.stub();
        operation.onFirstCall().returns(50);
        operation.onSecondCall().returns(1000);
        const cachedOperation = hold(operation, 100);

        const clock = sinon.useFakeTimers();

        chai.expect(cachedOperation()).to.eql(50);
        chai.expect(cachedOperation()).to.eql(50);
        chai.expect(cachedOperation()).to.eql(50);
        chai.expect(cachedOperation()).to.eql(50);
        chai.expect(cachedOperation()).to.eql(50);
        chai.expect(cachedOperation()).to.eql(50);
        clock.tick(100);
        chai.expect(cachedOperation()).to.eql(1000);
    });

    it('One operation with many calls and expired | call count', () => {
        const operation = sinon.fake();
        const cachedOperation = hold(operation, 100);

        const clock = sinon.useFakeTimers();

        cachedOperation();
        cachedOperation();
        cachedOperation();
        cachedOperation();
        cachedOperation();
        cachedOperation();
        clock.tick(100);
        cachedOperation();
        chai.expect(operation.callCount).to.eql(2);
    });

    it('One operation with many calls and many expires | result', () => {
        const operation = sinon.stub();
        operation.onFirstCall().returns(50);
        operation.onSecondCall().returns(1000);
        operation.onThirdCall().returns(8000);
        const cachedOperation = hold(operation, 100);

        const clock = sinon.useFakeTimers();

        chai.expect(cachedOperation()).to.eql(50);
        chai.expect(cachedOperation()).to.eql(50);
        chai.expect(cachedOperation()).to.eql(50);
        chai.expect(cachedOperation()).to.eql(50);
        chai.expect(cachedOperation()).to.eql(50);
        chai.expect(cachedOperation()).to.eql(50);
        clock.tick(100);
        chai.expect(cachedOperation()).to.eql(1000);
        chai.expect(cachedOperation()).to.eql(1000);
        chai.expect(cachedOperation()).to.eql(1000);
        clock.tick(100);
        chai.expect(cachedOperation()).to.eql(8000);
    });


    it('One operation with many calls and many expires | call count', () => {
        const operation = sinon.fake();
        const cachedOperation = hold(operation, 100);

        const clock = sinon.useFakeTimers();

        cachedOperation();
        cachedOperation();
        cachedOperation();
        cachedOperation();
        cachedOperation();
        cachedOperation();
        clock.tick(100);
        cachedOperation();
        cachedOperation();
        cachedOperation();
        clock.tick(100);
        cachedOperation();
        chai.expect(operation.callCount).to.eql(3);
    });

    it('One operation with many calls and many expires | result', () => {
        const operationA = sinon.stub();
        operationA.onFirstCall().returns(50);
        operationA.onSecondCall().returns(1000);
        operationA.onThirdCall().returns(8000);
        const cachedOperationA = hold(operationA, 100);
        const operationB = sinon.stub();
        operationB.onFirstCall().returns(99);
        operationB.onSecondCall().returns(9999);
        const cachedOperationB = hold(operationB, 200);

        const clock = sinon.useFakeTimers();

        chai.expect(cachedOperationA()).to.eql(50);
        chai.expect(cachedOperationA()).to.eql(50);
        chai.expect(cachedOperationA()).to.eql(50);
        chai.expect(cachedOperationA()).to.eql(50);
        chai.expect(cachedOperationA()).to.eql(50);
        chai.expect(cachedOperationA()).to.eql(50);
        chai.expect(cachedOperationB()).to.eql(99);
        chai.expect(cachedOperationB()).to.eql(99);
        chai.expect(cachedOperationB()).to.eql(99);
        chai.expect(cachedOperationB()).to.eql(99);
        chai.expect(cachedOperationB()).to.eql(99);
        chai.expect(cachedOperationB()).to.eql(99);
        clock.tick(100);
        chai.expect(cachedOperationA()).to.eql(1000);
        chai.expect(cachedOperationA()).to.eql(1000);
        chai.expect(cachedOperationA()).to.eql(1000);
        chai.expect(cachedOperationB()).to.eql(99);
        chai.expect(cachedOperationB()).to.eql(99);
        chai.expect(cachedOperationB()).to.eql(99);
        clock.tick(100);
        chai.expect(cachedOperationA()).to.eql(8000);
        chai.expect(cachedOperationB()).to.eql(9999);
    });


    it('Many operations with many calls and many expires | call count', () => {
        const operationA = sinon.fake();
        const cachedOperationA = hold(operationA, 100);
        const operationB = sinon.fake();
        const cachedOperationB = hold(operationB, 200);

        const clock = sinon.useFakeTimers();

        cachedOperationA();
        cachedOperationA();
        cachedOperationA();
        cachedOperationA();
        cachedOperationA();
        cachedOperationA();
        cachedOperationB();
        cachedOperationB();
        cachedOperationB();
        cachedOperationB();
        cachedOperationB();
        cachedOperationB();
        clock.tick(100);
        cachedOperationA();
        cachedOperationA();
        cachedOperationA();
        cachedOperationB();
        cachedOperationB();
        cachedOperationB();
        clock.tick(100);
        cachedOperationA();
        cachedOperationB();
        chai.expect(operationA.callCount).to.eql(3);
        chai.expect(operationB.callCount).to.eql(2);
    });

});

describe('Hold On - Interval Managment Tests', () => {
    it('Does not exposes an interval when it was not invoked', () => {
        const operation = sinon.fake();
        const cachedOperation = hold(operation, 1);
        chai.expect(typeof cachedOperation.interval ).to.eql('undefined');
    });

    it('Exposes an interval', () => {
        const operation = sinon.fake();
        const cachedOperation = hold(operation, 1);
        cachedOperation();
        chai.expect(typeof cachedOperation.interval ).to.eql('object');
        chai.expect(typeof cachedOperation.interval.id ).to.eql('number');
        chai.expect(typeof cachedOperation.interval.ref ).to.eql('function');
        chai.expect(typeof cachedOperation.interval.unref ).to.eql('function');
        chai.expect(typeof cachedOperation.interval.refresh ).to.eql('function');
    });

    it('Does not exposes an interval when cache was expired', () => {
        const operation = sinon.fake();
        const cachedOperation = hold(operation, 100);
        const clock = sinon.useFakeTimers();
        cachedOperation();
        clock.tick(100);
        chai.expect(typeof cachedOperation.interval ).to.eql('undefined');
    });
})