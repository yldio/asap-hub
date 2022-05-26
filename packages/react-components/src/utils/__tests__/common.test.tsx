import { createResearchOutputResponse } from '@asap-hub/fixtures';
import { render } from '@testing-library/react';
import { equals, getIdentifierType, isDirty } from '../common';

import {
  getSvgAspectRatio,
  isInternalLink,
  getIconFromUrl,
  isLink,
} from '../index';

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

  it('Returns empty string when the URL is invalid', () => {
    expect(isInternalLink(`http://`)).toEqual([false, '']);
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

describe('isDirty', () => {
  const researchOutputResponse = createResearchOutputResponse();
  const payload = {
    title: researchOutputResponse.title,
    description: researchOutputResponse.description,
    link: researchOutputResponse.link,
    type: researchOutputResponse.type,
    tags: researchOutputResponse.tags,
    methods: researchOutputResponse.methods,
    organisms: researchOutputResponse.organisms,
    environments: researchOutputResponse.environments,
    teams: researchOutputResponse.teams,
    labs: researchOutputResponse.labs,
    authors: researchOutputResponse.authors,
    subtype: researchOutputResponse.subtype,
    labCatalogNumber: researchOutputResponse.labCatalogNumber,
  };

  it('returns true for edit mode when values differ from the initial ones', () => {
    expect(
      isDirty(payload, { ...researchOutputResponse, title: 'Test title 3' }),
    ).toBeTruthy();
  });

  it('returns false for edit mode when values equal the initial ones', () => {
    expect(isDirty(payload, researchOutputResponse)).toBeFalsy();
  });

  it('returns true when the initial values are changed', () => {
    expect(isDirty({ payload })).toBeTruthy();
  });

  // type !== '
  // identifierType !== identifierType.Empty
  // identifier !== ''
  // labCatalogNumber !== '
  it('returns true when the initial values are the ones', () => {
    expect(
      isDirty({
        title: '',
        description: '',
        link: '',
        type: undefined,
        tags: [],
        methods: [],
        organisms: [],
        environments: [],
        teams: [{ teamId: '12' }],
        labs: [],
        authors: [],
        subtype: undefined,
        labCatalogNumber: '',
      }),
    ).toBeFalsy();
  });
});

describe('equals', () => {
  const testArray = ['Team ASAP', 'Team Chen', 'Team Allesi'];
  it('returns true when both array contain the same elements', () => {
    expect(equals(testArray, testArray.reverse())).toBeTruthy();
  });
  it('returns false when arrays differ', () => {
    expect(equals(testArray, testArray.slice(0, 1))).toBeFalsy();
  });
});

describe('getIdentifierType', () => {
  it('returns DOI when doi is present', () => {
    expect(
      getIdentifierType({ ...createResearchOutputResponse(), doi: 'abc' }),
    ).toEqual('DOI');
  });
  it('returns RRID when rrid is present', () => {
    expect(
      getIdentifierType({ ...createResearchOutputResponse(), rrid: 'abc' }),
    ).toEqual('RRID');
  });
  it('returns Accession Number when accession is present', () => {
    expect(
      getIdentifierType({
        ...createResearchOutputResponse(),
        accession: 'abc',
      }),
    ).toEqual('Accession Number');
  });
  it('returns empty when there is no identifier present', () => {
    expect(
      getIdentifierType({
        ...createResearchOutputResponse(),
        accession: '',
        rrid: '',
        doi: '',
      }),
    ).toEqual('');
  });
});
