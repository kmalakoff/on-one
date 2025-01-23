import assert from 'assert';
import { EventEmitter } from 'events';

// @ts-ignore
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
});
