import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Model } from '@asap-hub/model';

import { Stringifier } from 'csv-stringify';

import {
  MAX_SQUIDEX_RESULTS,
  squidexUsersResponseToStream,
  userToCSV,
} from '../export';

afterEach(() => {
  jest.clearAllMocks();
});
describe('userToCSV', () => {
  it('handles flat data', () => {
    const output: gp2Model.UserResponse = {
      ...gp2Fixtures.createUserResponse(),
      displayName: 'Tony Stark',
      email: 'T@ark.io',
      firstName: 'Tony',
      lastName: 'Stark',
      region: 'Europe' as const,
      role: 'Trainee' as const,
      onboarded: true,
      fundingStreams: 'funding stream',
    };
    expect(userToCSV(output)).toEqual({
      email: 'T@ark.io',
      firstName: 'Tony',
      lastName: 'Stark',
      region: 'Europe',
      role: 'Trainee',
      fundingStreams: 'funding stream',
      createdDate: expect.anything(),
      location: expect.anything(),
      contributingCohorts: expect.anything(),
      degrees: expect.anything(),
      primaryPosition: expect.anything(),
      workingGroups: expect.anything(),
      projects: expect.anything(),
      onboarded: expect.anything(),
    });
  });
  it('joins country and city into location when city is avaiblable', () => {
    const outputWithCity: gp2Model.UserResponse = {
      ...gp2Fixtures.createUserResponse(),
      country: 'Portugal',
      city: 'Lisbon',
    };
    const outputWithoutCity: gp2Model.UserResponse = {
      ...gp2Fixtures.createUserResponse(),
      country: 'Portugal',
      city: undefined,
    };
    expect(userToCSV(outputWithCity).location).toMatchInlineSnapshot(
      `"Portugal, Lisbon"`,
    );
    expect(userToCSV(outputWithoutCity).location).toMatchInlineSnapshot(
      `"Portugal"`,
    );
  });
  it('flattens and order degrees', () => {
    const output: gp2Model.UserResponse = {
      ...gp2Fixtures.createUserResponse(),
      degrees: ['MBA', 'BA', 'PhD'],
    };
    expect(userToCSV(output).degrees).toMatchInlineSnapshot(`
      "BA,
      MBA,
      PhD"
    `);
  });
  it.each<{ value: boolean; valueOutput: string }>([
    { value: true, valueOutput: 'Yes' },
    { value: false, valueOutput: 'No' },
  ])(
    'transforms the boolean $value into $valueOutput',
    ({ value, valueOutput }) => {
      const output: gp2Model.UserResponse = {
        ...gp2Fixtures.createUserResponse(),
        onboarded: value,
      };
      expect(userToCSV(output).onboarded).toBe(valueOutput);
    },
  );
  it('flattens the first three positions into primaryPosition, secondaryPosition and terciaryPosition', () => {
    const output: gp2Model.UserResponse = {
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
    expect(userToCSV(output).primaryPosition).toMatchInlineSnapshot(
      `"CEO in Research at Stark Industries"`,
    );
    expect(userToCSV(output).secondaryPosition).toMatchInlineSnapshot(
      `"CTO in Technology at YLD"`,
    );
    expect(userToCSV(output).terciaryPosition).toMatchInlineSnapshot(
      `"CFO in Finance at Bank of America"`,
    );
  });
  it('positions are left empty if there are no positions', () => {
    const output: gp2Model.UserResponse = {
      ...gp2Fixtures.createUserResponse(),
      positions: [],
    };
    expect(userToCSV(output).primaryPosition).toBeUndefined();
    expect(userToCSV(output).secondaryPosition).toBeUndefined();
    expect(userToCSV(output).terciaryPosition).toBeUndefined();
  });
  it('flattens and orders projects', () => {
    const output: gp2Model.UserResponse = {
      ...gp2Fixtures.createUserResponse(),
      projects: [
        { id: '1', title: 'project 1', status: 'Active' as const, members: [] },
        { id: '2', title: 'project 2', status: 'Active' as const, members: [] },
        { id: '3', title: 'project 3', status: 'Active' as const, members: [] },
      ],
    };
    expect(userToCSV(output).projects).toMatchInlineSnapshot(`
      "project 1,
      project 2,
      project 3"
    `);
  });
  it('flattens and orders working groups', () => {
    const output: gp2Model.UserResponse = {
      ...gp2Fixtures.createUserResponse(),
      workingGroups: [
        { id: '1', title: 'working group 1', members: [] },
        { id: '2', title: 'working group 2', members: [] },
        { id: '3', title: 'working group 3', members: [] },
      ],
    };
    expect(userToCSV(output).workingGroups).toMatchInlineSnapshot(`
      "working group 1,
      working group 2,
      working group 3"
    `);
  });
  it('flattens and orders contibruting cohorts', () => {
    const output: gp2Model.UserResponse = {
      ...gp2Fixtures.createUserResponse(),
      contributingCohorts: [
        'contibruting cohort 1',
        'contibruting cohort 2',
        'contibruting cohort 3',
      ],
    };
    expect(userToCSV(output).contributingCohorts).toMatchInlineSnapshot(
      `"contibruting cohort 1, contibruting cohort 2, contibruting cohort 3"`,
    );
  });
  it('formats the createdDate', () => {
    const output: gp2Model.UserResponse = {
      ...gp2Fixtures.createUserResponse(),
      createdDate: '2020-09-23T20:45:22.000Z',
    };
    expect(userToCSV(output).createdDate).toMatchInlineSnapshot(
      `"23rd September 2020"`,
    );
  });
});

describe('squidexUsersResponseToStream', () => {
  const mockCsvStream = {
    write: jest.fn(),
    end: jest.fn(),
  };

  it('streams one page of results', async () => {
    await squidexUsersResponseToStream(
      mockCsvStream as unknown as Stringifier,
      () => Promise.resolve(gp2Fixtures.createUsersResponse(1)),
      (a) => a,
    );
    expect(mockCsvStream.write).toHaveBeenCalledWith(
      gp2Fixtures.createUserResponse({ id: String(0) }),
    );
    expect(mockCsvStream.write).toHaveBeenCalledTimes(1);
    expect(mockCsvStream.end).toHaveBeenCalledTimes(1);
  });

  it('streams multiple pages of results', async () => {
    await squidexUsersResponseToStream(
      mockCsvStream as unknown as Stringifier,
      () =>
        Promise.resolve({
          ...gp2Fixtures.createUsersResponse(1),
          total: MAX_SQUIDEX_RESULTS + 1,
        }),
      (a) => a,
    );
    expect(mockCsvStream.write).toHaveBeenCalledWith(
      gp2Fixtures.createUserResponse({ id: String(0) }),
    );
    expect(mockCsvStream.write).toHaveBeenCalledWith(
      gp2Fixtures.createUserResponse({ id: String(0) }),
    );
    expect(mockCsvStream.write).toHaveBeenCalledTimes(2);
    expect(mockCsvStream.end).toHaveBeenCalledTimes(1);
  });

  it('streams transformed results', async () => {
    await squidexUsersResponseToStream(
      mockCsvStream as unknown as Stringifier,
      () => Promise.resolve(gp2Fixtures.createUsersResponse(1)),
      (a: gp2Model.UserResponse) => ({ name: a.firstName }),
    );
    expect(mockCsvStream.write).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Tony',
      }),
    );
    expect(mockCsvStream.write).toHaveBeenCalledTimes(1);
  });
});
