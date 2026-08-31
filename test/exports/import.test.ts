import assert from 'assert';
import onOne from 'on-one';

describe('exports .ts', () => {
  it('default', () => {
    assert.equal(typeof onOne, 'function');
  });
});
