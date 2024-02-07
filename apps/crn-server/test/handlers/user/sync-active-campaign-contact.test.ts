import { getContactPayload } from '../../../src/handlers/user/sync-active-campaign-contact';
import { getUserResponse } from '../../fixtures/users.fixtures';

const fieldIdByTitle = {
  Network: '1',
  Lab: '2',
  ORCID: '3',
  Nickname: '4',
  Middlename: '5',
  Alumnistatus: '6',
  Country: '7',
  Institution: '8',
  'Working Group': '9',
  'Interest Group': '10',
  LinkedIn: '11',
  'CRN Team 1': '12',
  'CRN Team Role 1': '13',
  'CRN Team Status 1': '14',
  'CRN Team 2': '15',
  'CRN Team Role 2': '16',
  'CRN Team Status 2': '17',
  'CRN Team 3': '18',
  'CRN Team Role 3': '19',
  'CRN Team Status 3': '20',
};

describe('getContactPayload', () => {
  it('returns the contact payload', () => {
    expect(
      getContactPayload(fieldIdByTitle, {
        ...getUserResponse(),
        teams: [
          {
            id: '1',
            displayName: 'A',
            role: 'ASAP Staff',
            teamInactiveSince: '2024-04-16',
          },
          {
            id: '2',
            displayName: 'B',
            role: 'Collaborating PI',
          },
          {
            id: '3',
            displayName: 'C',
            role: 'Key Personnel',
          },
        ],
        workingGroups: [
          {
            id: 'WG-1',
            name: 'Working Group 1',
            role: 'Member',
            active: true,
          },
          {
            id: 'WG-2',
            name: 'Working Group 2',
            role: 'Member',
            active: true,
          },
        ],
        interestGroups: [
          {
            id: 'IG-1',
            active: true,
            name: 'Interest Group I',
          },
          {
            id: 'IG-2',
            active: true,
            name: 'Interest Group II',
          },
          {
            id: 'IG-3',
            active: true,
            name: 'Interest Group III',
          },
        ],
      }),
    ).toEqual({
      firstName: 'Tom',
      lastName: 'Hardy',
      email: 'H@rdy.io',
      fieldValues: [
        { field: '12', value: 'A' },
        { field: '13', value: 'ASAP Staff' },
        { field: '14', value: 'Inactive' },
        { field: '15', value: 'B' },
        { field: '16', value: 'Collaborating PI' },
        { field: '17', value: 'Active' },
        { field: '18', value: 'C' },
        { field: '19', value: 'Key Personnel' },
        { field: '20', value: 'Active' },
        { field: '2', value: 'Brighton, Liverpool' },
        { field: '3', value: '123-456-789' },
        { field: '4', value: 'Iron Man' },
        { field: '5', value: 'Edward' },
        { field: '6', value: 'Alumni' },
        { field: '7', value: 'United Kingdom' },
        { field: '8', value: 'some institution' },
        { field: '9', value: 'Working Group 1, Working Group 2' },
        {
          field: '10',
          value: 'Interest Group I, Interest Group II, Interest Group III',
        },
        { field: '11', value: '' },
        { field: '1', value: '||ASAP CRN||' },
      ],
    });
  });
});
