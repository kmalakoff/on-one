import assert from 'assert';
import onOne from 'on-one';

describe('exports .mjs', () => {
  it('default', () => {
    assert.equal(typeof onOne, 'function');
  });
});
