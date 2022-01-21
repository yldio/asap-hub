import { UserResponse } from '@asap-hub/model';
import { isUserOnboardable } from '../src/user';
import { getUserResponse } from './fixtures/user.fixtures';

describe('isUserOnboardable validation', () => {
  test('Should pass if the user profile is complete', async () => {
    expect(isUserOnboardable(getUserResponse())).toEqual({
      isOnboardable: true,
    });
  });

  test('Should fail if Resonsibilities are missing from user profile', async () => {
    const userResponse: UserResponse = getUserResponse();
    userResponse.responsibilities = null;

    expect(isUserOnboardable(userResponse)).toEqual({
      isOnboardable: false,
      responsibilities: { valid: false },
    });
  });

  test('Should fail if Institution is missing from user profile', async () => {
    const userIncompleteResponse: UserResponse = {
      ...getUserResponse(),
      institution: undefined,
    };

    expect(isUserOnboardable(userIncompleteResponse)).toEqual({
      isOnboardable: false,
      institution: { valid: false },
    });
  });

  test('Should fail if Job Title is missing from user profile', async () => {
    const userIncompleteResponse: UserResponse = {
      ...getUserResponse(),
      jobTitle: undefined,
    };

    expect(isUserOnboardable(userIncompleteResponse)).toEqual({
      isOnboardable: false,
      jobTitle: { valid: false },
    });
  });

  test('Should fail if City is missing from user profile', async () => {
    const userIncompleteResponse: UserResponse = {
      ...getUserResponse(),
      city: undefined,
    };

    expect(isUserOnboardable(userIncompleteResponse)).toEqual({
      isOnboardable: false,
      city: { valid: false },
    });
  });

  test('Should fail if Country is missing from user profile', async () => {
    const userIncompleteResponse: UserResponse = {
      ...getUserResponse(),
      country: undefined,
    };

    expect(isUserOnboardable(userIncompleteResponse)).toEqual({
      isOnboardable: false,
      country: { valid: false },
    });
  });

  test('Should fail if Expertise and Resources are missing from user profile', async () => {
    const userIncompleteResponse: UserResponse = {
      ...getUserResponse(),
      expertiseAndResourceTags: [],
    };

    expect(isUserOnboardable(userIncompleteResponse)).toEqual({
      isOnboardable: false,
      expertiseAndResourceTags: { valid: false },
    });
  });

  test('Should fail if fewer than 5 Expertise and Resources are provided in user profile', async () => {
    const userIncompleteResponse: UserResponse = {
      ...getUserResponse(),
      expertiseAndResourceTags: [
        'expertise 1',
        'expertise 2',
        'expertise 3',
        'expertise 4',
      ],
    };

    expect(isUserOnboardable(userIncompleteResponse)).toEqual({
      isOnboardable: false,
      expertiseAndResourceTags: { valid: false },
    });
  });
  test('Should fail if biography is missing from user profile', async () => {
    const userIncompleteResponse: UserResponse = {
      ...getUserResponse(),
      biography: undefined,
    };

    expect(isUserOnboardable(userIncompleteResponse)).toEqual({
      isOnboardable: false,
      biography: { valid: false },
    });
  });

  describe('When user role is not Staff', () => {
    test('Should fail if the user is not part of any team', async () => {
      const userIncompleteResponse: UserResponse = {
        ...getUserResponse(),
        role: 'Grantee',
        teams: [],
      };

      expect(isUserOnboardable(userIncompleteResponse)).toEqual({
        isOnboardable: false,
        teams: { valid: false },
      });
    });

    test('Should fail if Research Interests are missing from user profile', async () => {
      const userResponse: UserResponse = {
        ...getUserResponse(),
        role: 'Grantee',
        researchInterests: null,
      };

      expect(isUserOnboardable(userResponse)).toEqual({
        isOnboardable: false,
        researchInterests: { valid: false },
      });
    });
    test('Should fail if Research Questions are missing from user profile', async () => {
      const userIncompleteResponse: UserResponse = {
        ...getUserResponse(),
        role: 'Grantee',
        questions: [],
      };

      expect(isUserOnboardable(userIncompleteResponse)).toEqual({
        isOnboardable: false,
        questions: { valid: false },
      });
    });

    test('Should fail if only a single Research Question is provided in user profile', async () => {
      const userIncompleteResponse: UserResponse = {
        ...getUserResponse(),
        role: 'Grantee',
        questions: ['question 1'],
      };

      expect(isUserOnboardable(userIncompleteResponse)).toEqual({
        isOnboardable: false,
        questions: { valid: false },
      });
    });
  });
  describe('when user role is Staff', () => {
    test('Should pass when the user is not part of any team', async () => {
      const userIncompleteResponse: UserResponse = {
        ...getUserResponse(),
        role: 'Staff',
        teams: [],
      };
      expect(isUserOnboardable(userIncompleteResponse)).toEqual({
        isOnboardable: true,
      });
    });
    test('Should pass with Research Interests missing from user profile', async () => {
      const userResponse: UserResponse = {
        ...getUserResponse(),
        role: 'Staff',
        researchInterests: null,
      };

      expect(isUserOnboardable(userResponse)).toEqual({
        isOnboardable: true,
      });
    });
    test('Should pass with Research Questions missing from user profile', async () => {
      const userIncompleteResponse: UserResponse = {
        ...getUserResponse(),
        role: 'Staff',
        questions: [],
      };

      expect(isUserOnboardable(userIncompleteResponse)).toEqual({
        isOnboardable: true,
      });
    });
  });
});
