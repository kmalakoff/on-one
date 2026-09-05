const assert = require('assert');
const onOne = require('on-one');

describe('exports .cjs', () => {
  it('default', () => {
    assert.equal(typeof onOne, 'function');
  });
});
