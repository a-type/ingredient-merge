import { thing } from '../thing';

describe('thing', () => {
  it('echoes', () => {
    expect(thing('foo')).toEqual('foo');
  });
});
