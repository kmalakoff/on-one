import assert from 'assert';
import { EventEmitter } from 'events';

import oo from 'on-one';

describe('on-one', () => {
  describe('does not call multiple times', () => {
    it('single event', () => {
      const ee = new EventEmitter();
      const results = [];
      oo(ee, 'hello', (err, value) => results.push({ err, value }));
      ee.emit('hello', 'hey');
      assert.equal(results.length, 1);
      assert.equal(results[0].err, null);
      assert.equal(results[0].value, 'hey');

      ee.emit('hello', 'you');
      assert.equal(results.length, 1);
    });

    it('multiple events (first)', () => {
      const ee = new EventEmitter();
      const results = [];
      oo(ee, ['hello', 'world'], (err, value) => results.push({ err, value }));
      ee.emit('hello', 'hey');
      assert.equal(results.length, 1);
      assert.equal(results[0].err, null);
      assert.equal(results[0].value, 'hey');

      ee.emit('hello', 'you');
      assert.equal(results.length, 1);

      ee.emit('world', 'universe');
      assert.equal(results.length, 1);
    });

    it('multiple events (second)', () => {
      const ee = new EventEmitter();
      const results = [];
      oo(ee, ['hello', 'world'], (err, value) => results.push({ err, value }));
      ee.emit('world', 'universe');
      assert.equal(results.length, 1);
      assert.equal(results[0].err, null);
      assert.equal(results[0].value, 'universe');

      ee.emit('hello', 'hey');
      assert.equal(results.length, 1);

      ee.emit('hello', 'you');
      assert.equal(results.length, 1);
    });
  });

  describe('error-first callback pattern', () => {
    it('error event passes error as first argument', () => {
      const ee = new EventEmitter();
      let receivedErr: unknown;
      let receivedEventName: unknown;
      oo(ee, ['error', 'end'], (err, eventName) => {
        receivedErr = err;
        receivedEventName = eventName;
      });
      const testError = new Error('test error');
      ee.emit('error', testError);
      assert.strictEqual(receivedErr, testError);
      assert.equal(receivedEventName, 'error');
    });

    it('end event passes null as first argument', () => {
      const ee = new EventEmitter();
      let receivedErr: unknown;
      let receivedEventName: unknown;
      oo(ee, ['error', 'end'], (err, eventName) => {
        receivedErr = err;
        receivedEventName = eventName;
      });
      ee.emit('end');
      assert.strictEqual(receivedErr, null);
      assert.equal(receivedEventName, 'end');
    });

    it('close event passes null as first argument', () => {
      const ee = new EventEmitter();
      let receivedErr: unknown;
      let receivedEventName: unknown;
      oo(ee, ['error', 'close'], (err, eventName) => {
        receivedErr = err;
        receivedEventName = eventName;
      });
      ee.emit('close');
      assert.strictEqual(receivedErr, null);
      assert.equal(receivedEventName, 'close');
    });

    it('works with stream-like error/end/close/finish pattern', () => {
      const ee = new EventEmitter();
      let receivedErr: unknown;
      let receivedEventName: unknown;
      oo(ee, ['error', 'end', 'close', 'finish'], (err, eventName) => {
        receivedErr = err;
        receivedEventName = eventName;
      });
      ee.emit('finish');
      assert.strictEqual(receivedErr, null);
      assert.equal(receivedEventName, 'finish');
    });

    it('error-first check works correctly for success', () => {
      const ee = new EventEmitter();
      let wasError = false;
      let wasSuccess = false;
      oo(ee, ['error', 'end'], (err) => {
        if (err) {
          wasError = true;
        } else {
          wasSuccess = true;
        }
      });
      ee.emit('end');
      assert.equal(wasError, false);
      assert.equal(wasSuccess, true);
    });

    it('error-first check works correctly for error', () => {
      const ee = new EventEmitter();
      let wasError = false;
      let wasSuccess = false;
      oo(ee, ['error', 'end'], (err) => {
        if (err) {
          wasError = true;
        } else {
          wasSuccess = true;
        }
      });
      ee.emit('error', new Error('fail'));
      assert.equal(wasError, true);
      assert.equal(wasSuccess, false);
    });
  });

  describe('passes event name as last argument', () => {
    it('single event', () => {
      const ee = new EventEmitter();
      let receivedErr: unknown;
      let receivedValue: unknown;
      let receivedEventName: unknown;
      oo(ee, 'hello', (err, value, eventName) => {
        receivedErr = err;
        receivedValue = value;
        receivedEventName = eventName;
      });
      ee.emit('hello', 'hey');
      assert.equal(receivedErr, null);
      assert.equal(receivedValue, 'hey');
      assert.equal(receivedEventName, 'hello');
    });

    it('works with multiple arguments', () => {
      const ee = new EventEmitter();
      let receivedArgs: unknown[];
      oo(ee, 'data', (...args) => {
        receivedArgs = args;
      });
      ee.emit('data', 'first', 'second', 'third');
      assert.deepEqual(receivedArgs, [null, 'first', 'second', 'third', 'data']);
    });

    it('works with no arguments', () => {
      const ee = new EventEmitter();
      let receivedArgs: unknown[];
      oo(ee, 'close', (...args) => {
        receivedArgs = args;
      });
      ee.emit('close');
      assert.deepEqual(receivedArgs, [null, 'close']);
    });
  });
});
