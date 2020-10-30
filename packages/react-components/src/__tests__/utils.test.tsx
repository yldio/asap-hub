import React from 'react';

import { getSvgAspectRatio, isInternalLink } from '../utils';

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

describe('isInternalLink', () => {
  describe.each`
    description          | href
    ${'external link'}   | ${`https://parkinsonsroadmap.org/`}
    ${'external link'}   | ${`//parkinsonsroadmap.org/`}
    ${'external link'}   | ${`//${window.location.hostname}:${Number(window.location.port || 80) - 1}/`}
    ${'external mailto'} | ${`mailto:test@${window.location.hostname}`}
  `('for an $href to be an $description', ({ href }) => {
    it('returns false', () => {
      expect(isInternalLink(href)).toBe(false);
    });
  });

  describe.each([
    `${window.location.protocol}//${window.location.host}`,
    `${window.location.protocol}//${window.location.host}/page`,
    `//${window.location.host}`,
    `//${window.location.host}/page`,
    `/`,
    `/page`,
    `.`,
    `./page`,
    `..`,
    `../page`,
    `page`,
    `#`,
    `#fragment`,
    `?query`,
    `${window.location.protocol}//${window.location.host}/page?query#fragment`,
  ])('for an internal link with a router to %s', (href: string) => {
    it('returns true', () => {
      expect(isInternalLink(href)).toBe(true);
    });
  });
});
