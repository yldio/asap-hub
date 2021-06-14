import { UserResponse } from '@asap-hub/model';
import { isUserOnboardable } from '../src/user';
import { userResponse } from './fixtures/user.fixtures';

describe('isUserOnboardable validation', () => {
  test('Should pass if the user profile is complete', async () => {
    expect(isUserOnboardable(userResponse)).toEqual({
      isOnboardable: true,
    });
  });

  test('Should fail if the user is not part of any team', async () => {
    const userIncompleteResponse: UserResponse = {
      ...userResponse,
      teams: [],
    };

    expect(isUserOnboardable(userIncompleteResponse)).toEqual({
      isOnboardable: false,
    });
  });

  test('Should fail if Main Research Interests are missing from user profile', async () => {
    const userIncompleteResponse: UserResponse = {
      ...userResponse,
      teams: [
        {
          id: 'team-id-1',
          displayName: 'Jackson, M',
          role: 'Lead PI (Core Leadership)',
          proposal: 'proposal-id-1',
          approach: undefined,
          responsibilities: 'Make sure coverage is high',
        },
      ],
    };

    expect(isUserOnboardable(userIncompleteResponse)).toEqual({
      isOnboardable: false,
    });
  });

  test('Should pass if Main Research Interests are present only in a single team the user belongs to', async () => {
    const userIncompleteResponse: UserResponse = {
      ...userResponse,
      teams: [
        {
          id: 'team-id-1',
          displayName: 'Jackson, M',
          role: 'Lead PI (Core Leadership)',
          proposal: 'proposal-id-1',
          approach: undefined,
          responsibilities: 'Make sure coverage is high',
        },
        {
          id: 'team-id-2',
          displayName: 'Test, B',
          role: 'Key Personnel',
          proposal: 'proposal-id-1',
          approach: 'some main research interests',
          responsibilities: 'Make sure coverage is high',
        },
      ],
    };

    expect(isUserOnboardable(userIncompleteResponse)).toEqual({
      isOnboardable: true,
    });
  });

  test('Should fail if Responsibilities are missing from user profile', async () => {
    const userIncompleteResponse: UserResponse = {
      ...userResponse,
      teams: [
        {
          id: 'team-id-1',
          displayName: 'Jackson, M',
          role: 'Lead PI (Core Leadership)',
          proposal: 'proposal-id-1',
          approach: 'some approach',
          responsibilities: undefined,
        },
      ],
    };

    expect(isUserOnboardable(userIncompleteResponse)).toEqual({
      isOnboardable: false,
    });
  });

  test('Should pass if Responsibilities are present only in a single team the user belongs to', async () => {
    const userIncompleteResponse: UserResponse = {
      ...userResponse,
      teams: [
        {
          id: 'team-id-1',
          displayName: 'Jackson, M',
          role: 'Lead PI (Core Leadership)',
          proposal: 'proposal-id-1',
          approach: 'some approach',
          responsibilities: undefined,
        },
        {
          id: 'team-id-2',
          displayName: 'Test, B',
          role: 'Key Personnel',
          proposal: 'proposal-id-1',
          approach: 'some approach',
          responsibilities: 'Make sure coverage is high',
        },
      ],
    };

    expect(isUserOnboardable(userIncompleteResponse)).toEqual({
      isOnboardable: true,
    });
  });

  test('Should fail if Research Questions are missing from user profile', async () => {
    const userIncompleteResponse: UserResponse = {
      ...userResponse,
      questions: [],
    };

    expect(isUserOnboardable(userIncompleteResponse)).toEqual({
      isOnboardable: false,
    });
  });

  test('Should fail if only a single Research Question is provided in user profile', async () => {
    const userIncompleteResponse: UserResponse = {
      ...userResponse,
      questions: ['question 1'],
    };

    expect(isUserOnboardable(userIncompleteResponse)).toEqual({
      isOnboardable: false,
    });
  });

  test('Should fail if Institution is missing from user profile', async () => {
    const userIncompleteResponse: UserResponse = {
      ...userResponse,
      institution: undefined,
    };

    expect(isUserOnboardable(userIncompleteResponse)).toEqual({
      isOnboardable: false,
    });
  });

  test('Should fail if Job Title is missing from user profile', async () => {
    const userIncompleteResponse: UserResponse = {
      ...userResponse,
      jobTitle: undefined,
    };

    expect(isUserOnboardable(userIncompleteResponse)).toEqual({
      isOnboardable: false,
    });
  });

  test('Should fail if Location is missing from user profile', async () => {
    const userIncompleteResponse: UserResponse = {
      ...userResponse,
      location: undefined,
    };

    expect(isUserOnboardable(userIncompleteResponse)).toEqual({
      isOnboardable: false,
    });
  });

  test('Should fail if Expertise and Resources are missing from user profile', async () => {
    const userIncompleteResponse: UserResponse = {
      ...userResponse,
      skills: [],
    };

    expect(isUserOnboardable(userIncompleteResponse)).toEqual({
      isOnboardable: false,
    });
  });

  test('Should fail if fewer than 5 Expertise and Resources are provided in user profile', async () => {
    const userIncompleteResponse: UserResponse = {
      ...userResponse,
      skills: ['skill 1', 'skill 2', 'skill 3', 'skill 4'],
    };

    expect(isUserOnboardable(userIncompleteResponse)).toEqual({
      isOnboardable: false,
    });
  });
});
