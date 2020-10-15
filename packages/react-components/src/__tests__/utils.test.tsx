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

describe('createMailTo', () => {
  it('generates a mailto link', () => {
    expect(new URL(createMailTo('test@example.com')).protocol).toBe('mailto:');
  });

  it('escapes the email address', () => {
    expect(
      decodeURIComponent(new URL(createMailTo('te?st@example.com')).pathname),
    ).toBe('te?st@example.com');
  });

  it('does not escape the @ for email client compatibility', () => {
    expect(createMailTo('test@example.com')).toContain('@');
  });
});
