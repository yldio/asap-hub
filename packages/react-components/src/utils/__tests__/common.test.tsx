import { render } from '@testing-library/react';
import { ResearchOutputResponse, TeamResponse } from '@asap-hub/model';
import { createResearchOutputResponse } from '@asap-hub/fixtures';

import {
  equals,
  getIconFromUrl,
  getSvgAspectRatio,
  isInternalLink,
  isLink,
  splitListBy,
  getResearchOutputAssociation,
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

describe('equals', () => {
  const testArray = ['Team ASAP', 'Team Chen', 'Team Allesi'];

  it('returns true when both array contain the same elements in the same order', () => {
    expect(equals(testArray, testArray.slice())).toBeTruthy();
  });
  it('returns false when both arrays have the same values in diff order', () => {
    expect(equals(testArray, testArray.slice().reverse())).toBeFalsy();
  });
  it('returns false when arrays differ', () => {
    expect(equals(testArray, testArray.slice(0, 1))).toBeFalsy();
  });
});

describe('splitListBy', () => {
  const teams: ReadonlyArray<
    Pick<TeamResponse, 'id' | 'displayName' | 'inactiveSince'>
  > = [
    { displayName: 'Inactive Team 1', id: '1', inactiveSince: '2021-01-01' },
    { displayName: 'Active Team 1', id: '2' },
    { displayName: 'Inactive Team 2', id: '3', inactiveSince: '2021-01-01' },
  ];
  it('splits a team list between active/inactive based on the passed condition', () => {
    const [inactiveTeams, activeTeams] = splitListBy(
      teams,
      (team) => !!team?.inactiveSince,
    );
    expect(inactiveTeams.length).toBe(2);
    expect(activeTeams.length).toBe(1);
  });
});

describe('getResearchOutputAssociation', () => {
  it('returns team for a research output with only a team', () => {
    const researchOutput: ResearchOutputResponse = {
      ...createResearchOutputResponse(),
      teams: [{ id: '1', displayName: 'Team ASAP' }],
      workingGroups: undefined,
    };
    expect(getResearchOutputAssociation(researchOutput)).toEqual('team');
  });
  it('returns teams for a research output with more than one teams', () => {
    const researchOutput: ResearchOutputResponse = {
      ...createResearchOutputResponse(),
      teams: [
        { id: '1', displayName: 'Team ASAP' },
        { id: '2', displayName: 'Second team' },
      ],
      workingGroups: undefined,
    };
    expect(getResearchOutputAssociation(researchOutput)).toEqual('teams');
  });
  it('returns working group for a research output that has a working group', () => {
    const researchOutput: ResearchOutputResponse = {
      ...createResearchOutputResponse(),
      teams: [
        { id: '1', displayName: 'Team ASAP' },
        { id: '2', displayName: 'Second team' },
      ],
      workingGroups: [{ id: '1', title: 'Working group' }],
    };
    expect(getResearchOutputAssociation(researchOutput)).toEqual(
      'working group',
    );
  });
});
