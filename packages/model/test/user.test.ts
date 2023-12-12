import {
  isUserDegree,
  isUserRole,
  userDegree,
  userRole,
  toUserListItem,
} from '../src';

describe('User', () => {
  describe('Role', () => {
    it.each(userRole)('should recognise correct role - %s', (role) => {
      expect(isUserRole(role)).toEqual(true);
    });

    it('should not recognise incorrect role', () => {
      expect(isUserRole('not-a-role')).toEqual(false);
    });
  });

  describe('User degree', () => {
    it.each(userDegree)('should recognise correct degree - %s', (degree) => {
      expect(isUserDegree(degree)).toEqual(true);
    });

    it('should not recognise incorrect degree', () => {
      expect(isUserDegree('not-a-degree')).toEqual(false);
    });
  });

  describe('toUserListItem', () => {
    it('should convert user response to algolia user item response', () => {
      expect(
        toUserListItem({
          id: 'user-1',
          createdDate: '2020-09-07T17:36:54Z',
          lastModifiedDate: '2020-09-07T17:36:54Z',
          onboarded: true,
          displayName: 'Jane Doe',
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@asap.com',
          jobTitle: 'Assistant Professor',
          institution: 'University of Toronto',
          country: 'Canada',
          city: 'Toronto',
          orcid: '0000-0001-8203-6901',
          orcidWorks: [],
          expertiseAndResourceTags: ['Blood', 'Parkinson'],
          questions: [],
          role: 'Grantee',
          social: {
            github: '',
            googleScholar: '',
            linkedIn: '',
            orcid: '',
            researchGate: '',
            researcherId: '',
            twitter: '',
          },
          workingGroups: [],
          interestGroups: [],
          labs: [{ id: 'cd7be4902', name: 'Brighton' }],
          teams: [
            {
              displayName: 'Alessi',
              id: 'team-alessi',
              role: 'Lead PI (Core Leadership)',
              inactiveSinceDate: '',
            },
            {
              displayName: 'De Camilli',
              id: 'team-de-camilli',
              role: 'Project Manager',
              inactiveSinceDate: '',
            },
          ],
        }),
      ).toEqual({
        _tags: ['Blood', 'Parkinson'],
        alumniSinceDate: undefined,
        avatarUrl: undefined,
        city: 'Toronto',
        country: 'Canada',
        createdDate: '2020-09-07T17:36:54Z',
        degree: undefined,
        dismissedGettingStarted: undefined,
        displayName: 'Jane Doe',
        email: 'jane.doe@asap.com',
        firstName: 'Jane',
        id: 'user-1',
        institution: 'University of Toronto',
        jobTitle: 'Assistant Professor',
        labs: [{ id: 'cd7be4902', name: 'Brighton' }],
        lastName: 'Doe',
        membershipStatus: undefined,
        onboarded: true,
        role: 'Grantee',
        teams: [
          {
            displayName: 'Alessi',
            id: 'team-alessi',
            role: 'Lead PI (Core Leadership)',
          },
          {
            displayName: 'De Camilli',
            id: 'team-de-camilli',
            role: 'Project Manager',
          },
        ],
      });
    });
  });
});
