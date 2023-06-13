import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Model } from '@asap-hub/model';

import { Stringifier } from 'csv-stringify';

import {
  MAX_RESULTS,
  squidexUsersResponseToStream,
  userToCSV,
} from '../export';

beforeEach(jest.resetAllMocks);

describe('userToCSV', () => {
  it('handles flat data', () => {
    const userResponse: gp2Model.UserResponse = {
      ...gp2Fixtures.createUserResponse(),
      displayName: 'Tony Stark',
      email: 'T@ark.io',
      firstName: 'Tony',
      lastName: 'Stark',
      region: 'Europe',
      role: 'Trainee',
      onboarded: true,
      fundingStreams: 'funding stream',
      biography: 'this is a biography',
      social: {
        googleScholar: 'googleScholar',
        orcid: 'orcid',
        blog: 'blog',
        twitter: 'twitter',
        linkedIn: 'linkedIn',
        github: 'github',
      },
    };
    expect(userToCSV(userResponse)).toEqual({
      email: 'T@ark.io',
      firstName: 'Tony',
      lastName: 'Stark',
      region: 'Europe',
      role: 'Trainee',
      fundingStreams: 'funding stream',
      biography: 'this is a biography',
      googleScholar: 'googleScholar',
      orcid: 'orcid',
      blog: 'blog',
      twitter: 'twitter',
      linkedIn: 'linkedIn',
      github: 'github',
      createdDate: expect.anything(),
      keywords: expect.anything(),
      questions: expect.anything(),
      location: expect.anything(),
      contributingCohorts: expect.anything(),
      degrees: expect.anything(),
      primaryPosition: expect.anything(),
      workingGroups: expect.anything(),
      projects: expect.anything(),
      onboarded: expect.anything(),
    });
  });

  it('joins country and city into location when city is available', () => {
    const userResponse: gp2Model.UserResponse = {
      ...gp2Fixtures.createUserResponse(),
      country: 'Portugal',
      city: 'Lisbon',
    };
    const { location } = userToCSV(userResponse);
    expect(location).toEqual('Portugal, Lisbon');
  });

  it('location contains only the country when city is unavailable', () => {
    const userResponse: gp2Model.UserResponse = {
      ...gp2Fixtures.createUserResponse(),
      country: 'Portugal',
      city: undefined,
    };
    const { location } = userToCSV(userResponse);
    expect(location).toEqual('Portugal');
  });

  it('flattens and order degrees', () => {
    const userResponse: gp2Model.UserResponse = {
      ...gp2Fixtures.createUserResponse(),
      degrees: ['MBA', 'BA', 'PhD'],
    };
    const { degrees } = userToCSV(userResponse);
    expect(degrees).toMatchInlineSnapshot(`
      "BA,
      MBA,
      PhD"
    `);
  });

  it.each([
    { value: true, expected: 'Yes' },
    { value: false, expected: 'No' },
  ])(
    'transforms the boolean $value into $valueOutput',
    ({ value, expected }) => {
      const userResponse: gp2Model.UserResponse = {
        ...gp2Fixtures.createUserResponse(),
        onboarded: value,
      };
      const { onboarded } = userToCSV(userResponse);
      expect(onboarded).toEqual(expected);
    },
  );

  it('flattens the first three positions into primaryPosition, secondaryPosition and tertiaryPosition', () => {
    const userResponse: gp2Model.UserResponse = {
      ...gp2Fixtures.createUserResponse(),
      positions: [
        {
          role: 'CEO',
          department: 'Research',
          institution: 'Stark Industries',
        },
        {
          role: 'CTO',
          department: 'Technology',
          institution: 'YLD',
        },
        {
          role: 'CFO',
          department: 'Finance',
          institution: 'Bank of America',
        },
      ],
    };
    const { primaryPosition, secondaryPosition, tertiaryPosition } =
      userToCSV(userResponse);
    expect(primaryPosition).toEqual('CEO in Research at Stark Industries');
    expect(secondaryPosition).toEqual('CTO in Technology at YLD');
    expect(tertiaryPosition).toEqual('CFO in Finance at Bank of America');
  });
  it('positions are left empty if there are no positions', () => {
    const userResponse: gp2Model.UserResponse = {
      ...gp2Fixtures.createUserResponse(),
      positions: [],
    };
    const { primaryPosition, secondaryPosition, tertiaryPosition } =
      userToCSV(userResponse);
    expect(primaryPosition).toBeUndefined();
    expect(secondaryPosition).toBeUndefined();
    expect(tertiaryPosition).toBeUndefined();
  });
  it('flattens and orders projects', () => {
    const userResponse: gp2Model.UserResponse = {
      ...gp2Fixtures.createUserResponse(),
      projects: [
        { id: '1', title: 'project 1', status: 'Active', members: [] },
        { id: '2', title: 'project 2', status: 'Active', members: [] },
        { id: '3', title: 'project 3', status: 'Active', members: [] },
      ],
    };
    const { projects } = userToCSV(userResponse);
    expect(projects).toMatchInlineSnapshot(`
      "project 1,
      project 2,
      project 3"
    `);
  });
  it('flattens and orders working groups', () => {
    const userResponse: gp2Model.UserResponse = {
      ...gp2Fixtures.createUserResponse(),
      workingGroups: [
        { id: '1', title: 'working group 1', members: [] },
        { id: '2', title: 'working group 2', members: [] },
        { id: '3', title: 'working group 3', members: [] },
      ],
    };
    const { workingGroups } = userToCSV(userResponse);
    expect(workingGroups).toMatchInlineSnapshot(`
      "working group 1,
      working group 2,
      working group 3"
    `);
  });
  it('flattens and orders contibruting cohorts', () => {
    const userResponse: gp2Model.UserResponse = {
      ...gp2Fixtures.createUserResponse(),
      contributingCohorts: [
        {
          name: 'CALYPSO',
          role: 'Investigator',
          studyUrl: 'first-study',
          contributingCohortId: '1',
        },
        {
          name: 'DATATOP',
          role: 'Co-Investigator',
          studyUrl: 'second-study',
          contributingCohortId: '2',
        },
        {
          name: 'ICEBERG',
          role: 'Lead Investigator',
          contributingCohortId: '3',
        },
      ],
    };
    const { contributingCohorts } = userToCSV(userResponse);
    expect(contributingCohorts).toMatchInlineSnapshot(
      `
      "CALYPSO Investigator first-study,
      DATATOP Co-Investigator second-study,
      ICEBERG Lead Investigator"
    `,
    );
  });

  it('formats the createdDate', () => {
    const userResponse: gp2Model.UserResponse = {
      ...gp2Fixtures.createUserResponse(),
      createdDate: '2021-12-28T14:00:00.000Z',
    };
    const { createdDate } = userToCSV(userResponse);
    expect(createdDate).toEqual('28th December 2021');
  });

  it('formats the activatedDate', () => {
    const userResponse: gp2Model.UserResponse = {
      ...gp2Fixtures.createUserResponse(),
      activatedDate: '2021-12-28T14:00:00.000Z',
    };
    const { activatedDate } = userToCSV(userResponse);
    expect(activatedDate).toEqual('28th December 2021');
  });
  it('allows and undefined social', () => {
    const userResponse: gp2Model.UserResponse = {
      ...gp2Fixtures.createUserResponse(),
      social: undefined,
    };
    const { googleScholar, orcid, blog, twitter, linkedIn, github } =
      userToCSV(userResponse);
    expect(googleScholar).toBeUndefined();
    expect(orcid).toBeUndefined();
    expect(blog).toBeUndefined();
    expect(twitter).toBeUndefined();
    expect(linkedIn).toBeUndefined();
    expect(github).toBeUndefined();
  });

  it('formats the undefined activatedDate', () => {
    const userResponse: gp2Model.UserResponse = {
      ...gp2Fixtures.createUserResponse(),
      activatedDate: undefined,
    };
    const { activatedDate } = userToCSV(userResponse);
    expect(activatedDate).toBeUndefined();
  });
});

describe('squidexUsersResponseToStream', () => {
  const mockCsvStream = {
    write: jest.fn(),
    end: jest.fn(),
  };

  it('streams one page of results', async () => {
    const usersResponse = gp2Fixtures.createUsersResponse();
    await squidexUsersResponseToStream(
      mockCsvStream as unknown as Stringifier,
      jest.fn().mockResolvedValue(usersResponse),
      jest.fn((x) => x),
    );
    expect(mockCsvStream.write).toHaveBeenCalledWith(
      gp2Fixtures.createUserResponse({ id: '0' }),
    );
    expect(mockCsvStream.write).toHaveBeenCalledTimes(1);
    expect(mockCsvStream.end).toHaveBeenCalledTimes(1);
  });

  it('streams multiple pages of results', async () => {
    await squidexUsersResponseToStream(
      mockCsvStream as unknown as Stringifier,
      jest.fn().mockResolvedValue({
        ...gp2Fixtures.createUsersResponse(),
        total: MAX_RESULTS + 1,
      }),
      jest.fn((x) => x),
    );
    expect(mockCsvStream.write).toHaveBeenCalledWith(
      gp2Fixtures.createUserResponse({ id: '0' }),
    );
    expect(mockCsvStream.write).toHaveBeenCalledWith(
      gp2Fixtures.createUserResponse({ id: '0' }),
    );
    expect(mockCsvStream.write).toHaveBeenCalledTimes(2);
    expect(mockCsvStream.end).toHaveBeenCalledTimes(1);
  });

  it('streams transformed results', async () => {
    await squidexUsersResponseToStream(
      mockCsvStream as unknown as Stringifier,
      jest.fn().mockResolvedValue(gp2Fixtures.createUsersResponse()),
      jest.fn(({ firstName }: gp2Model.UserResponse) => ({ name: firstName })),
    );
    expect(mockCsvStream.write).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Tony',
      }),
    );
    expect(mockCsvStream.write).toHaveBeenCalledTimes(1);
  });
});
