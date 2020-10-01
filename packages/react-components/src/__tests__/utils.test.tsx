import React from 'react';

import { getSvgAspectRatio, createMailTo } from '../utils';

describe('getSvgAspectRatio', () => {
  it('throws if the element does not contain a svg', () => {
    expect(() => getSvgAspectRatio(<div />)).toThrow(/contain.+svg/i);
  });

  it('returns the view box width to height ratio of a svg', () => {
    expect(
      getSvgAspectRatio(
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" />,
      ),
    ).toBe(1.5);
  });
});

describe('Create MailTo link', () => {
  it('generates a mailto', () => {
    expect(createMailTo('test@gmail.com')).toEqual('mailto:test%40gmail.com');
  });

  it('generates a mailto with + sign ', () => {
    expect(createMailTo('test+jajaja@gmail.com')).toEqual(
      'mailto:test%2Bjajaja%40gmail.com',
    );
  });

  it('generates a mailto with ?', () => {
    expect(createMailTo('tim?seckinger@yld.io')).toEqual(
      'mailto:tim%3Fseckinger%40yld.io',
    );
  });
});
