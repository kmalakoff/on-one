import assert from 'assert';
import { EventEmitter } from 'events';

import oo from 'on-one';

describe('on-one', () => {
  describe('does not call multiple times', () => {
    it('single event', () => {
      const ee = new EventEmitter();
      const args = [];
      oo(ee, 'hello', (value) => args.push(value));
      ee.emit('hello', 'hey');
      assert.equal(args.length, 1);
      assert.deepEqual(args[0], 'hey');

      ee.emit('hello', 'you');
      assert.equal(args.length, 1);
      assert.deepEqual(args[0], 'hey');
    });

    it('multiple events (first)', () => {
      const ee = new EventEmitter();
      const args = [];
      oo(ee, ['hello', 'world'], (value) => args.push(value));
      ee.emit('hello', 'hey');
      assert.equal(args.length, 1);
      assert.deepEqual(args[0], 'hey');

      ee.emit('hello', 'you');
      assert.equal(args.length, 1);
      assert.deepEqual(args[0], 'hey');

      ee.emit('world', 'universe');
      assert.equal(args.length, 1);
      assert.deepEqual(args[0], 'hey');
    });

    it('multiple events (second)', () => {
      const ee = new EventEmitter();
      const args = [];
      oo(ee, ['hello', 'world'], (value) => args.push(value));
      ee.emit('world', 'universe');
      assert.equal(args.length, 1);
      assert.deepEqual(args[0], 'universe');

      ee.emit('hello', 'hey');
      assert.equal(args.length, 1);
      assert.deepEqual(args[0], 'universe');

      ee.emit('hello', 'you');
      assert.equal(args.length, 1);
      assert.deepEqual(args[0], 'universe');
    });
  });

  describe('passes event name as last argument', () => {
    it('single event', () => {
      const ee = new EventEmitter();
      let receivedValue: unknown;
      let receivedEventName: unknown;
      oo(ee, 'hello', (value, eventName) => {
        receivedValue = value;
        receivedEventName = eventName;
      });
      ee.emit('hello', 'hey');
      assert.equal(receivedValue, 'hey');
      assert.equal(receivedEventName, 'hello');
    });

    it('multiple events (first)', () => {
      const ee = new EventEmitter();
      let receivedValue: unknown;
      let receivedEventName: unknown;
      oo(ee, ['hello', 'world'], (value, eventName) => {
        receivedValue = value;
        receivedEventName = eventName;
      });
      ee.emit('hello', 'hey');
      assert.equal(receivedValue, 'hey');
      assert.equal(receivedEventName, 'hello');
    });

    it('multiple events (second)', () => {
      const ee = new EventEmitter();
      let receivedValue: unknown;
      let receivedEventName: unknown;
      oo(ee, ['hello', 'world'], (value, eventName) => {
        receivedValue = value;
        receivedEventName = eventName;
      });
      ee.emit('world', 'universe');
      assert.equal(receivedValue, 'universe');
      assert.equal(receivedEventName, 'world');
    });

    it('works with multiple arguments', () => {
      const ee = new EventEmitter();
      let receivedArgs: unknown[];
      oo(ee, 'data', (...args) => {
        receivedArgs = args;
      });
      ee.emit('data', 'first', 'second', 'third');
      assert.deepEqual(receivedArgs, ['first', 'second', 'third', 'data']);
    });

    it('works with no arguments', () => {
      const ee = new EventEmitter();
      let receivedArgs: unknown[];
      oo(ee, 'close', (...args) => {
        receivedArgs = args;
      });
      ee.emit('close');
      assert.deepEqual(receivedArgs, ['close']);
    });
  });
});
