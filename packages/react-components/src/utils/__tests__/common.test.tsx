import { render } from '@testing-library/react';

import { createUserResponse } from '@asap-hub/fixtures';
import { GroupLeader, TeamResponse } from '@asap-hub/model';

import {
  equals,
  getIconFromUrl,
  getSvgAspectRatio,
  isInternalLink,
  isLink,
  splitListBy,
  buildTabsConfig,
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

describe('tabbed card utils', () => {
  const leaders: ReadonlyArray<Pick<GroupLeader, 'user' | 'role'>> = [
    {
      user: {
        ...createUserResponse(),
        displayName: 'Alumni Leader 1',
        alumniSinceDate: '2021-01-01',
      },
      role: 'Chair',
    },
    {
      user: {
        ...createUserResponse(),
        displayName: 'Alumni Leader 2',
        alumniSinceDate: '2021-01-01',
      },
      role: 'Project Manager',
    },
    {
      user: { ...createUserResponse(), displayName: 'Active Leader 1' },
      role: 'Project Manager',
    },
  ];

  const teams: ReadonlyArray<
    Pick<TeamResponse, 'id' | 'displayName' | 'inactiveSince'>
  > = [
    { displayName: 'Inactive Team 1', id: '1', inactiveSince: '2021-01-01' },
    { displayName: 'Active Team 1', id: '2' },
    { displayName: 'Inactive Team 2', id: '3', inactiveSince: '2021-01-01' },
  ];

  describe('splitListBy', () => {
    it('splits a group leaders between alumni/not alumni', () => {
      const [alumni, notAlumni] = splitListBy(
        ['user', 'alumniSinceDate'],
        leaders,
      );
      expect(alumni.length).toBe(2);
      expect(notAlumni.length).toBe(1);
    });

    it('splits a team list between active/inactive', () => {
      const [inactive, active] = splitListBy(['inactiveSince'], teams);
      expect(inactive.length).toBe(2);
      expect(active.length).toBe(1);
    });
  });

  describe('buildTabsConfig', () => {
    describe('Leaders Tabs', () => {
      const buildLeaderTabs = (disableActiveTab: boolean = false) =>
        buildTabsConfig({
          disableActiveTab,
          items: leaders,
          label: 'Leaders',
          lookupProps: ['user', 'alumniSinceDate'],
        });

      it('creates tabbed card config for leaders of an inactive group', () => {
        const [activeTab, inactiveTab] = buildLeaderTabs(true);

        expect(activeTab.tabTitle).toBe('Active Leaders (0)');
        expect(activeTab.items.length).toBe(0);
        expect(activeTab.disabled).toBeTruthy();

        expect(inactiveTab.tabTitle).toBe('Past Leaders (3)');
        expect(inactiveTab.items.length).toBe(3);
        expect(inactiveTab.disabled).toBeFalsy();
      });

      it('creates tabbed card config for leaders of an active group', () => {
        const [activeTab, inactiveTab] = buildLeaderTabs();

        expect(activeTab.tabTitle).toBe('Active Leaders (1)');
        expect(activeTab.items.length).toBe(1);
        expect(activeTab.disabled).toBeFalsy();

        expect(inactiveTab.tabTitle).toBe('Past Leaders (2)');
        expect(inactiveTab.items.length).toBe(2);
        expect(inactiveTab.disabled).toBeFalsy();
      });
    });

    describe('Teams Tabs', () => {
      const buildTeamsTabs = (disableActiveTab: boolean = false) =>
        buildTabsConfig({
          disableActiveTab,
          items: teams,
          label: 'Teams',
          lookupProps: ['inactiveSince'],
          truncateFrom: 8,
        });

      it('creates tabbed card config for teams of an inactive group', () => {
        const [activeTab, inactiveTab] = buildTeamsTabs(true);

        expect(activeTab.tabTitle).toBe('Active Teams (0)');
        expect(activeTab.items.length).toBe(0);
        expect(activeTab.disabled).toBeTruthy();

        expect(inactiveTab.tabTitle).toBe('Past Teams (3)');
        expect(inactiveTab.items.length).toBe(3);
        expect(inactiveTab.disabled).toBeFalsy();
        expect(activeTab.truncateFrom).toBe(8);
      });

      it('creates tabbed card config for teams of an active group', () => {
        const [activeTab, inactiveTab] = buildTeamsTabs();

        expect(activeTab.tabTitle).toBe('Active Teams (1)');
        expect(activeTab.items.length).toBe(1);
        expect(activeTab.disabled).toBeFalsy();
        expect(activeTab.truncateFrom).toBe(8);

        expect(inactiveTab.tabTitle).toBe('Past Teams (2)');
        expect(inactiveTab.items.length).toBe(2);
        expect(inactiveTab.disabled).toBeFalsy();
        expect(activeTab.truncateFrom).toBe(8);
      });
    });
  });
});
