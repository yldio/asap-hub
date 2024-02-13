import { GP2FieldIdByTitle } from '@asap-hub/server-common';
import { getContactPayload } from '../../../src/handlers/user/sync-active-campaign-contact';
import { getUserResponse } from '../../fixtures/user.fixtures';

const fieldIdByTitle = {
  Network: '1',
  ORCID: '3',
  Nickname: '4',
  Middlename: '5',
  Region: '6',
  Country: '7',
  Institution: '8',
  'Working Group': '9',
  'Interest Group': '10',
  LinkedIn: '11',
  Department: '12',
  'GP2 Hub Role': '13',
  'GP2 Working Group': '14',
  Project: '15',
};

const userResponse = getUserResponse();

describe('getContactPayload', () => {
  it('returns the contact payload when user has more than one project and working group', () => {
    expect(
      getContactPayload(fieldIdByTitle, {
        ...userResponse,
        workingGroups: [
          {
            ...userResponse.workingGroups[0]!,
            title: 'Steering Committee',
          },
          {
            ...userResponse.workingGroups[0]!,
            title: 'Complex Disease Network',
          },
        ],
        projects: [
          { ...userResponse.projects[0]!, title: 'scRNA-seq analysis' },
          { ...userResponse.projects[0]!, title: 'Pathogenic variants' },
          { ...userResponse.projects[0]!, title: 'Runs of homozygosity' },
        ],
      }),
    ).toEqual({
      firstName: 'Tony',
      lastName: 'Stark',
      email: 'T@ark.io',
      fieldValues: [
        { field: '3', value: '1234-5678-9123-4567' },
        { field: '4', value: 'Iron Man' },
        { field: '5', value: 'Edward' },
        { field: '7', value: 'Spain' },
        { field: '6', value: 'Europe' },
        { field: '12', value: 'Research' },
        { field: '8', value: 'Stark Industries' },
        { field: '13', value: 'Trainee' },
        { field: '14', value: 'Steering Committee, Complex Disease Network' },
        {
          field: '15',
          value:
            'scRNA-seq analysis, Pathogenic variants, Runs of homozygosity',
        },
        { field: '11', value: 'https://www.linkedin.com' },
        { field: '1', value: '||GP2||' },
      ],
    });
  });

  it('returns the contact payload when user has one or none project and working group', () => {
    expect(
      getContactPayload(fieldIdByTitle, {
        ...userResponse,
        workingGroups: [
          {
            ...userResponse.workingGroups[0]!,
            title: 'Steering Committee',
          },
        ],
        projects: [],
      }),
    ).toEqual({
      firstName: 'Tony',
      lastName: 'Stark',
      email: 'T@ark.io',
      fieldValues: [
        { field: '3', value: '1234-5678-9123-4567' },
        { field: '4', value: 'Iron Man' },
        { field: '5', value: 'Edward' },
        { field: '7', value: 'Spain' },
        { field: '6', value: 'Europe' },
        { field: '12', value: 'Research' },
        { field: '8', value: 'Stark Industries' },
        { field: '13', value: 'Trainee' },
        { field: '14', value: 'Steering Committee' },
        { field: '15', value: '' },
        { field: '11', value: 'https://www.linkedin.com' },
        { field: '1', value: '||GP2||' },
      ],
    });
  });

  it('throws an error when fields are missing from fieldIdByTitle', () => {
    const fieldIdByTitle = {
      Network: '1',
      ORCID: '3',
      Country: '7',
      Institution: '8',
      'Working Group': '9',
      'Interest Group': '10',
      LinkedIn: '11',
      'GP2 Hub Role': '13',
      'GP2 Working Group': '14',
      Project: '15',
    };
    expect(() =>
      getContactPayload(
        fieldIdByTitle as unknown as GP2FieldIdByTitle,
        userResponse,
      ),
    ).toThrow(
      'The following fields Nickname, Middlename, Region, Department are missing from the ActiveCampaign environment',
    );
  });
});
