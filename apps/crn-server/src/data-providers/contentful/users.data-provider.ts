import { ListUserDataObject, UserDataObject } from '@asap-hub/model';
import { UserDataProvider } from '../types';

export class UserContentfulDataProvider implements UserDataProvider {
  async create(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  async update(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async fetchById(): Promise<UserDataObject | null> {
    return {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      createdDate: '2020-01-01',
      email: 'test@asap.science',
      expertiseAndResourceTags: [],
      labs: [],
      lastModifiedDate: '2020-01-01',
      teams: [],
      questions: [],
      role: 'Grantee',
      workingGroups: [],
    };
  }

  async fetch(): Promise<ListUserDataObject> {
    return {
      items: [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          createdDate: '2020-01-01',
          email: 'test@asap.science',
          expertiseAndResourceTags: [],
          labs: [],
          lastModifiedDate: '2020-01-01',
          teams: [],
          questions: [],
          role: 'Grantee',
          workingGroups: [],
        },
      ],
      total: 1,
    };
  }
}
