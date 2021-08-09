import { render } from '@testing-library/react';

import {
  getSvgAspectRatio,
  isInternalLink,
  getIconFromUrl,
  isLink,
  getListStrWithSuffix,
  capitalizeText,
} from '../utils';

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
    description          | href                                                                          | full
    ${'external link'}   | ${`https://parkinsonsroadmap.org/`}                                           | ${`https://parkinsonsroadmap.org/`}
    ${'external link'}   | ${`//parkinsonsroadmap.org/`}                                                 | ${`${window.location.protocol}//parkinsonsroadmap.org/`}
    ${'external link'}   | ${`//${window.location.hostname}:${Number(window.location.port || 80) - 1}/`} | ${`http://${window.location.hostname}:${Number(window.location.port || 80) - 1}/`}
    ${'external mailto'} | ${`mailto:test@${window.location.hostname}`}                                  | ${`mailto:test@${window.location.hostname}`}
  `('for an $href to be an $description', ({ href, full }) => {
    it('returns false and full url', () => {
      const [internal, fullUrl] = isInternalLink(href);
      expect(internal).toBe(false);
      expect(fullUrl).toEqual(full);
    });
  });

  describe.each`
    href                                                                          | stripped
    ${`${window.location.protocol}//${window.location.host}`}                     | ${`/`}
    ${`${window.location.protocol}//${window.location.host}/page`}                | ${`/page`}
    ${`//${window.location.host}`}                                                | ${`/`}
    ${`//${window.location.host}/page`}                                           | ${`/page`}
    ${`/`}                                                                        | ${`/`}
    ${`/page`}                                                                    | ${`/page`}
    ${`.`}                                                                        | ${`/`}
    ${`./page`}                                                                   | ${`/page`}
    ${`..`}                                                                       | ${`/`}
    ${`../page`}                                                                  | ${`/page`}
    ${`page`}                                                                     | ${`/page`}
    ${`#`}                                                                        | ${`/`}
    ${`#elementId`}                                                               | ${`/#elementId`}
    ${`#fragment`}                                                                | ${`/#fragment`}
    ${`?query`}                                                                   | ${`/?query`}
    ${`?query=123`}                                                               | ${`/?query=123`}
    ${`${window.location.protocol}//${window.location.host}/page?query#fragment`} | ${`/page?query#fragment`}
  `('for an internal link with a router to %s', ({ href, stripped }) => {
    it('returns true and stripped url', () => {
      const [internal, strippedUrl] = isInternalLink(href);
      expect(internal).toBe(true);
      expect(strippedUrl).toEqual(stripped);
    });
  });
});

describe('getIconFromUrl', () => {
  it.each`
    title                | href
    ${'Google Drive'}    | ${`https://drive.google.com/wrong`}
    ${'Protocols'}       | ${`https://protocols.io/wrong`}
    ${'Slack'}           | ${`https://asap.slack.com/wrong`}
    ${'Google Calendar'} | ${`http://calendar.google.com/r/calendar?12w3`}
  `('$href renders a svg with title "$title"', ({ href, title }) => {
    const { getByTitle } = render(<>{getIconFromUrl(href)}</>);
    expect(getByTitle(title)).toBeInTheDocument();
  });

  it('returns undefined for unknown urls', () => {
    expect(getIconFromUrl('http://example.com')).toBeUndefined();
  });

  it('returns undefined for invalid urls', () => {
    expect(getIconFromUrl('not a url')).toBeUndefined();
  });
});

describe('isLink', () => {
  it('returns false when the input is not a valid link', () => {
    expect(isLink('not valid')).toBeFalsy();
  });
  it('returns true when the input is a valid link', () => {
    expect(isLink('https://example.com')).toBeTruthy();
  });
});

describe('getListStrWithSuffix', () => {
  it('returns an empty string when the input is an not valid', () => {
    expect(getListStrWithSuffix([])).toBe('');
    expect(getListStrWithSuffix(undefined)).toBe('');
  });

  it('returns a string that represents a unique list of the values', () => {
    expect(getListStrWithSuffix(['one', 'two', 'three', 'one'])).toEqual(
      'one, two, and three',
    );
    expect(getListStrWithSuffix(['one lab', 'two labs', 'three labs'])).toEqual(
      'one lab, two labs, and three labs',
    );
  });
});

describe('capitalizeText', () => {
  it('capitalizes a give string', () => {
    expect(capitalizeText('mike lab')).toEqual('Mike Lab');
    expect(capitalizeText('mike-lab')).toEqual('Mike-lab');
    expect(capitalizeText('mike        lab')).toEqual('Mike Lab');
    expect(capitalizeText('mike ')).toEqual('Mike');
  });
});
