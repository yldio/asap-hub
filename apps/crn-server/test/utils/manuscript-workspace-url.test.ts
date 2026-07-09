import {
  ManuscriptResponse,
  ManuscriptWorkspaceContext,
} from '@asap-hub/model';
import {
  buildProjectWorkspacePath,
  buildTeamWorkspacePath,
  getManuscriptComplianceRedirectUrl,
  getManuscriptWorkspaceContextFromResponse,
  getUserCollaboratingTeamId,
  isUserBasedManuscript,
  isUserPartOfProject,
  resolveManuscriptWorkspacePath,
} from '../../src/utils/manuscript-workspace-url';

const origin = 'https://hub.asap.science';

const baseManuscript = (
  overrides: Partial<ManuscriptResponse> = {},
): ManuscriptResponse =>
  ({
    id: 'manuscript-1',
    title: 'Test Manuscript',
    count: 1,
    assignedUsers: [],
    discussions: [],
    versions: [
      {
        id: 'version-1',
        teams: [
          {
            id: 'team-alpha',
            displayName: 'Team Alpha',
            projectId: 'project-alpha',
            projectType: 'Resource Project',
          },
          {
            id: 'team-beta',
            displayName: 'Team Beta',
            projectId: 'project-beta',
            projectType: 'Resource Project',
          },
        ],
      },
    ],
    teamId: 'team-alpha',
    ...overrides,
  }) as ManuscriptResponse;

describe('manuscript-workspace-url', () => {
  describe('getManuscriptComplianceRedirectUrl', () => {
    it('prefixes the redirect path with the hub origin', () => {
      expect(
        getManuscriptComplianceRedirectUrl('manuscript-1', origin, {
          tab: 'discussions',
        }),
      ).toBe(
        'https://hub.asap.science/compliance/manuscripts/manuscript-1?tab=discussions',
      );
    });

    it('includes the discussions tab query param when requested', () => {
      expect(
        getManuscriptComplianceRedirectUrl('manuscript-1', origin, {
          tab: 'discussions',
        }),
      ).toBe(
        'https://hub.asap.science/compliance/manuscripts/manuscript-1?tab=discussions',
      );
    });

    it('omits the tab query param when no tab is requested', () => {
      expect(getManuscriptComplianceRedirectUrl('manuscript-1', origin)).toBe(
        'https://hub.asap.science/compliance/manuscripts/manuscript-1',
      );
    });
  });

  describe('getManuscriptWorkspaceContextFromResponse', () => {
    it('builds workspace context from a team manuscript', () => {
      expect(
        getManuscriptWorkspaceContextFromResponse(baseManuscript()),
      ).toEqual({
        manuscriptId: 'manuscript-1',
        submittingTeamId: 'team-alpha',
        contributingTeamIds: ['team-alpha', 'team-beta'],
        projectsByTeamId: {
          'team-alpha': { id: 'project-alpha', type: 'Resource Project' },
          'team-beta': { id: 'project-beta', type: 'Resource Project' },
        },
      });
    });

    it('builds project context for project-linked manuscripts', () => {
      expect(
        getManuscriptWorkspaceContextFromResponse(
          baseManuscript({
            teamId: undefined,
            projectId: 'project-1',
            projectType: 'Discovery Project',
          }),
        ),
      ).toEqual({
        manuscriptId: 'manuscript-1',
        submittingTeamId: 'team-alpha',
        contributingTeamIds: ['team-alpha', 'team-beta'],
        project: {
          id: 'project-1',
          type: 'Discovery Project',
        },
        projectsByTeamId: {
          'team-alpha': { id: 'project-alpha', type: 'Resource Project' },
          'team-beta': { id: 'project-beta', type: 'Resource Project' },
        },
      });
    });

    it('returns null when the manuscript has no versions', () => {
      expect(
        getManuscriptWorkspaceContextFromResponse(
          baseManuscript({ versions: [] }),
        ),
      ).toBeNull();
    });

    it('uses the latest version to determine contributing teams', () => {
      expect(
        getManuscriptWorkspaceContextFromResponse(
          baseManuscript({
            teamId: undefined,
            versions: [
              {
                id: 'version-1',
                teams: [{ id: 'team-alpha', displayName: 'Team Alpha' }],
              },
              {
                id: 'version-2',
                teams: [{ id: 'team-gamma', displayName: 'Team Gamma' }],
              },
            ],
          } as Partial<ManuscriptResponse>),
        ),
      ).toEqual({
        manuscriptId: 'manuscript-1',
        submittingTeamId: 'team-gamma',
        contributingTeamIds: ['team-gamma'],
        projectsByTeamId: {},
      });
    });

    it('falls back to the first contributing team when teamId is missing', () => {
      expect(
        getManuscriptWorkspaceContextFromResponse(
          baseManuscript({ teamId: undefined }),
        ),
      ).toEqual({
        manuscriptId: 'manuscript-1',
        submittingTeamId: 'team-alpha',
        contributingTeamIds: ['team-alpha', 'team-beta'],
        projectsByTeamId: {
          'team-alpha': { id: 'project-alpha', type: 'Resource Project' },
          'team-beta': { id: 'project-beta', type: 'Resource Project' },
        },
      });
    });

    it('omits the project when projectType is missing', () => {
      expect(
        getManuscriptWorkspaceContextFromResponse(
          baseManuscript({ projectId: 'project-1', projectType: undefined }),
        ),
      ).toEqual({
        manuscriptId: 'manuscript-1',
        submittingTeamId: 'team-alpha',
        contributingTeamIds: ['team-alpha', 'team-beta'],
        projectsByTeamId: {
          'team-alpha': { id: 'project-alpha', type: 'Resource Project' },
          'team-beta': { id: 'project-beta', type: 'Resource Project' },
        },
      });
    });

    it('omits the project when projectId is missing', () => {
      expect(
        getManuscriptWorkspaceContextFromResponse(
          baseManuscript({
            projectId: undefined,
            projectType: 'Discovery Project',
          }),
        ),
      ).toEqual({
        manuscriptId: 'manuscript-1',
        submittingTeamId: 'team-alpha',
        contributingTeamIds: ['team-alpha', 'team-beta'],
        projectsByTeamId: {
          'team-alpha': { id: 'project-alpha', type: 'Resource Project' },
          'team-beta': { id: 'project-beta', type: 'Resource Project' },
        },
      });
    });
  });

  describe('resolveManuscriptWorkspacePath', () => {
    const manuscriptContext =
      getManuscriptWorkspaceContextFromResponse(baseManuscript())!;

    it('includes the discussions tab in the resolved team workspace path', () => {
      expect(
        resolveManuscriptWorkspacePath(
          manuscriptContext,
          {
            openScienceTeamMember: false,
            teams: [{ id: 'team-beta' }],
            projects: [],
          },
          { tab: 'discussions' },
        ),
      ).toBe('/network/teams/team-beta/workspace?tab=discussions#manuscript-1');
    });

    it('includes the discussions tab in the resolved project workspace path', () => {
      const projectContext = getManuscriptWorkspaceContextFromResponse(
        baseManuscript({
          teamId: undefined,
          projectId: 'project-1',
          projectType: 'Trainee Project',
        }),
      )!;

      expect(
        resolveManuscriptWorkspacePath(
          projectContext,
          {
            openScienceTeamMember: false,
            teams: [],
            projects: [{ id: 'project-1' }],
          },
          { tab: 'discussions', projectWorkspaceEnabled: true },
        ),
      ).toBe(
        '/projects/trainee/project-1/workspace?tab=discussions#manuscript-1',
      );
    });

    describe('Open science members', () => {
      describe('Feature flag is enabled', () => {
        const options = { projectWorkspaceEnabled: true };

        it('redirects to the project workspace for user based manuscript', () => {
          const context = getManuscriptWorkspaceContextFromResponse(
            baseManuscript({
              teamId: undefined,
              projectId: 'project-1',
              projectType: 'Discovery Project',
            }),
          )!;

          expect(
            resolveManuscriptWorkspacePath(
              context,
              {
                openScienceTeamMember: true,
                teams: [],
                projects: [],
              },
              options,
            ),
          ).toBe('/projects/discovery/project-1/workspace#manuscript-1');
        });

        it('redirects to the project workspace for team based manuscript', () => {
          expect(
            resolveManuscriptWorkspacePath(
              manuscriptContext,
              {
                openScienceTeamMember: true,
                teams: [],
                projects: [],
              },
              options,
            ),
          ).toBe('/projects/resource/project-alpha/workspace#manuscript-1');
        });

        it('redirects to team workspace when there is no project linked to the team', () => {
          const manuscript = baseManuscript({});
          manuscript.versions![0]!.teams = [
            {
              id: 'team-alpha',
              displayName: 'Team Alpha',
              projectId: undefined,
              projectType: undefined,
            },
          ];

          expect(
            resolveManuscriptWorkspacePath(
              getManuscriptWorkspaceContextFromResponse(manuscript)!,
              {
                openScienceTeamMember: true,
                teams: [{ id: 'team-alpha' }],
                projects: [],
              },
              options,
            ),
          ).toBe('/network/teams/team-alpha/workspace#manuscript-1');
        });
      });

      describe('Feature flag is disabled', () => {
        const options = { projectWorkspaceEnabled: false };

        it('redirects to the team workspace for user based manuscript', () => {
          const context = getManuscriptWorkspaceContextFromResponse(
            baseManuscript({
              teamId: undefined,
              projectId: 'project-1',
              projectType: 'Discovery Project',
            }),
          )!;
          expect(
            resolveManuscriptWorkspacePath(
              context,
              {
                openScienceTeamMember: true,
                teams: [],
                projects: [],
              },
              options,
            ),
          ).toBe('/network/teams/team-alpha/workspace#manuscript-1');
        });

        it('redirects to the team workspace for team based manuscript', () => {
          expect(
            resolveManuscriptWorkspacePath(
              manuscriptContext,
              {
                openScienceTeamMember: true,
                teams: [],
                projects: [],
              },
              options,
            ),
          ).toBe('/network/teams/team-alpha/workspace#manuscript-1');
        });

        it('redirects to team workspace when there is no project linked to the team', () => {
          const manuscript = baseManuscript({});
          manuscript.versions![0]!.teams = [
            {
              id: 'team-alpha',
              displayName: 'Team Alpha',
              projectId: undefined,
              projectType: undefined,
            },
          ];

          expect(
            resolveManuscriptWorkspacePath(
              getManuscriptWorkspaceContextFromResponse(manuscript)!,
              {
                openScienceTeamMember: true,
                teams: [{ id: 'team-alpha' }],
                projects: [],
              },
              options,
            ),
          ).toBe('/network/teams/team-alpha/workspace#manuscript-1');
        });
      });

      it('returns null no submitting team or project exists', () => {
        const orphanContext: ManuscriptWorkspaceContext = {
          manuscriptId: 'manuscript-1',
          submittingTeamId: undefined,
          project: undefined,
          contributingTeamIds: ['team-alpha'],
          projectsByTeamId: {
            'team-alpha': {
              id: 'project-alpha',
              type: 'Discovery Project',
            },
          },
        };

        expect(
          resolveManuscriptWorkspacePath(orphanContext, {
            openScienceTeamMember: true,
            teams: [],
            projects: [],
          }),
        ).toBeNull();
      });

      it('treats Staff without open science membership as a regular user', () => {
        // if open science team member is true, we redirect to the team workspace even if the user is not a member of any of the linked teams
        expect(
          resolveManuscriptWorkspacePath(manuscriptContext, {
            openScienceTeamMember: true,
            teams: [{ id: 'team-other' }],
            projects: [],
          }),
        ).toBe('/network/teams/team-alpha/workspace#manuscript-1');

        // if open science team member is false, we return null if the user is not a member of any of the linked teams
        expect(
          resolveManuscriptWorkspacePath(manuscriptContext, {
            openScienceTeamMember: false,
            teams: [{ id: 'team-other' }],
            projects: [],
          }),
        ).toBeNull();
      });
    });

    describe('Grantee users', () => {
      describe('Feature flag is enabled', () => {
        const options = { projectWorkspaceEnabled: true };

        it('redirects project members to the project workspace for user based manuscript', () => {
          const context = getManuscriptWorkspaceContextFromResponse(
            baseManuscript({
              teamId: undefined,
              projectId: 'project-1',
              projectType: 'Trainee Project',
            }),
          )!;

          expect(
            resolveManuscriptWorkspacePath(
              context,
              {
                openScienceTeamMember: false,
                teams: [],
                projects: [{ id: 'project-1' }],
              },
              options,
            ),
          ).toBe('/projects/trainee/project-1/workspace#manuscript-1');
        });

        it('redirects non-project members to the collaborating team project workspace for user based manuscript', () => {
          const context = getManuscriptWorkspaceContextFromResponse(
            baseManuscript({
              teamId: undefined,
              projectId: 'project-1',
              projectType: 'Trainee Project',
            }),
          )!;

          expect(
            resolveManuscriptWorkspacePath(
              context,
              {
                openScienceTeamMember: false,
                teams: [{ id: 'team-alpha' }],
                projects: [],
              },
              options,
            ),
          ).toBe('/projects/resource/project-alpha/workspace#manuscript-1');
        });

        it('redirects project members to the project workspace for team based manuscript', () => {
          expect(
            resolveManuscriptWorkspacePath(
              manuscriptContext,
              {
                openScienceTeamMember: false,
                teams: [{ id: 'team-alpha' }],
                projects: [],
              },
              options,
            ),
          ).toBe('/projects/resource/project-alpha/workspace#manuscript-1');
        });

        it('prefers the submitting team when the user belongs to both teams', () => {
          expect(
            resolveManuscriptWorkspacePath(
              manuscriptContext,
              {
                openScienceTeamMember: false,
                teams: [{ id: 'team-alpha' }, { id: 'team-beta' }],
                projects: [],
              },
              options,
            ),
          ).toBe('/projects/resource/project-alpha/workspace#manuscript-1');
        });

        it('redirects non members of submitting team to the collaborating project workspace when there is a project linked to the team', () => {
          const context = getManuscriptWorkspaceContextFromResponse(
            baseManuscript({
              teamId: 'team-alpha',
              projectId: undefined,
              projectType: undefined,
            }),
          )!;

          expect(
            resolveManuscriptWorkspacePath(
              context,
              {
                openScienceTeamMember: false,
                teams: [{ id: 'team-beta' }],
                projects: [],
              },
              options,
            ),
          ).toBe('/projects/resource/project-beta/workspace#manuscript-1');
        });

        it('redirects non members of submitting team to the collaborating team workspace when there is no project linked to the team', () => {
          const manuscript = baseManuscript({});
          manuscript.versions![0]!.teams = [
            {
              id: 'team-alpha',
              displayName: 'Team Alpha',
              projectId: undefined,
              projectType: undefined,
            },
            {
              id: 'team-beta',
              displayName: 'Team Beta',
              projectId: undefined,
              projectType: undefined,
            },
          ];
          const context =
            getManuscriptWorkspaceContextFromResponse(manuscript)!;

          expect(
            resolveManuscriptWorkspacePath(
              context,
              {
                openScienceTeamMember: false,
                teams: [{ id: 'team-beta' }],
                projects: [],
              },
              options,
            ),
          ).toBe('/network/teams/team-beta/workspace#manuscript-1');
        });

        it('redirects to team workspace when there is no project linked to the team', () => {
          const manuscript = baseManuscript({});
          manuscript.versions![0]!.teams = [
            {
              id: 'team-alpha',
              displayName: 'Team Alpha',
              projectId: undefined,
              projectType: undefined,
            },
          ];

          expect(
            resolveManuscriptWorkspacePath(
              getManuscriptWorkspaceContextFromResponse(manuscript)!,
              {
                openScienceTeamMember: false,
                teams: [{ id: 'team-alpha' }],
                projects: [],
              },
              options,
            ),
          ).toBe('/network/teams/team-alpha/workspace#manuscript-1');
        });
      });

      describe('Feature flag is disabled', () => {
        const options = { projectWorkspaceEnabled: false };

        it('redirects to the collaborating team workspace for user based manuscript', () => {
          const context = getManuscriptWorkspaceContextFromResponse(
            baseManuscript({
              teamId: undefined,
              projectId: 'project-1',
              projectType: 'Trainee Project',
            }),
          )!;

          expect(
            resolveManuscriptWorkspacePath(
              context,
              {
                openScienceTeamMember: false,
                teams: [{ id: 'team-alpha' }],
                projects: [{ id: 'project-1' }],
              },
              options,
            ),
          ).toBe('/network/teams/team-alpha/workspace#manuscript-1');
        });

        it('redirects team members to the team workspace for team based manuscript', () => {
          const context = getManuscriptWorkspaceContextFromResponse(
            baseManuscript({
              teamId: 'team-alpha',
              projectId: 'undefined',
              projectType: undefined,
            }),
          )!;

          expect(
            resolveManuscriptWorkspacePath(
              context,
              {
                openScienceTeamMember: false,
                teams: [{ id: 'team-alpha' }],
                projects: [{ id: 'project-1' }],
              },
              options,
            ),
          ).toBe('/network/teams/team-alpha/workspace#manuscript-1');
        });

        it('prefers the submitting team when the user belongs to both teams', () => {
          expect(
            resolveManuscriptWorkspacePath(
              manuscriptContext,
              {
                openScienceTeamMember: false,
                teams: [{ id: 'team-alpha' }, { id: 'team-beta' }],
                projects: [],
              },
              options,
            ),
          ).toBe('/network/teams/team-alpha/workspace#manuscript-1');
        });

        it('redirects non members of submitting team to the collaborating team workspace', () => {
          const context = getManuscriptWorkspaceContextFromResponse(
            baseManuscript({
              teamId: 'team-alpha',
              projectId: undefined,
              projectType: undefined,
            }),
          )!;

          expect(
            resolveManuscriptWorkspacePath(
              context,
              {
                openScienceTeamMember: false,
                teams: [{ id: 'team-beta' }],
                projects: [],
              },
              options,
            ),
          ).toBe('/network/teams/team-beta/workspace#manuscript-1');
        });

        it('returns null when there is no matching collaborating team for user based manuscript', () => {
          const context = getManuscriptWorkspaceContextFromResponse(
            baseManuscript({
              teamId: undefined,
              projectId: 'project-1',
              projectType: 'Trainee Project',
            }),
          )!;

          expect(
            resolveManuscriptWorkspacePath(context, {
              openScienceTeamMember: false,
              teams: [],
              projects: [{ id: 'project-1' }],
            }),
          ).toBeNull();
        });
      });

      it('returns null when the user has no matching team or project', () => {
        expect(
          resolveManuscriptWorkspacePath(manuscriptContext, {
            openScienceTeamMember: false,
            teams: [{ id: 'team-other' }],
            projects: [],
          }),
        ).toBeNull();
      });
    });
  });

  describe('buildProjectWorkspacePath', () => {
    it.each`
      type                   | segment
      ${'Discovery Project'} | ${'discovery'}
      ${'Resource Project'}  | ${'resource'}
      ${'Trainee Project'}   | ${'trainee'}
    `(
      'maps the $type project type to the /$segment url segment',
      ({ type, segment }) => {
        expect(
          buildProjectWorkspacePath({ id: 'project-1', type }, 'manuscript-1'),
        ).toBe(`/projects/${segment}/project-1/workspace#manuscript-1`);
      },
    );

    it('includes the discussions tab query param before the hash', () => {
      expect(
        buildProjectWorkspacePath(
          {
            id: 'project-1',
            type: 'Discovery Project',
          },
          'manuscript-1',
          'discussions',
        ),
      ).toBe(
        '/projects/discovery/project-1/workspace?tab=discussions#manuscript-1',
      );
    });
  });

  describe('buildTeamWorkspacePath', () => {
    it('builds the team workspace path', () => {
      expect(buildTeamWorkspacePath('team-alpha', 'manuscript-1')).toBe(
        '/network/teams/team-alpha/workspace#manuscript-1',
      );
    });

    it('includes the discussions tab query param before the hash', () => {
      expect(
        buildTeamWorkspacePath('team-alpha', 'manuscript-1', 'discussions'),
      ).toBe(
        '/network/teams/team-alpha/workspace?tab=discussions#manuscript-1',
      );
    });
  });

  describe('isUserBasedManuscript', () => {
    it('returns true when the manuscript is linked to a project', () => {
      expect(
        isUserBasedManuscript({
          manuscriptId: 'manuscript-1',
          submittingTeamId: 'team-alpha',
          contributingTeamIds: ['team-alpha'],
          project: {
            id: 'project-1',
            type: 'Trainee Project',
          },
          projectsByTeamId: {
            'team-alpha': {
              id: 'project-alpha',
              type: 'Discovery Project',
            },
          },
        }),
      ).toBe(true);
    });

    it('returns false when the manuscript has no project', () => {
      expect(
        isUserBasedManuscript({
          manuscriptId: 'manuscript-1',
          submittingTeamId: 'team-alpha',
          contributingTeamIds: ['team-alpha'],
          projectsByTeamId: {
            'team-alpha': {
              id: 'project-alpha',
              type: 'Discovery Project',
            },
          },
        }),
      ).toBe(false);
    });
  });

  describe('isUserPartOfProject', () => {
    const project = {
      id: 'project-1',
      type: 'Discovery Project' as const,
      fundedTeamId: 'team-alpha',
    };

    it('returns true when the user belongs to the project', () => {
      expect(
        isUserPartOfProject(
          {
            openScienceTeamMember: false,
            teams: [],
            projects: [{ id: 'project-1' }],
          },
          project,
        ),
      ).toBe(true);
    });

    it('returns false when the user does not belong to the project', () => {
      expect(
        isUserPartOfProject(
          {
            openScienceTeamMember: false,
            teams: [],
            projects: [{ id: 'project-other' }],
          },
          project,
        ),
      ).toBe(false);
    });
  });

  describe('getUserCollaboratingTeamId', () => {
    const manuscriptContext: ManuscriptWorkspaceContext = {
      manuscriptId: 'manuscript-1',
      submittingTeamId: 'team-alpha',
      contributingTeamIds: ['team-alpha', 'team-beta'],
      projectsByTeamId: {
        'team-alpha': {
          id: 'project-alpha',
          type: 'Discovery Project',
        },
        'team-beta': {
          id: 'project-beta',
          type: 'Discovery Project',
        },
      },
    };

    it('returns the first user team that is a contributing team', () => {
      expect(
        getUserCollaboratingTeamId(manuscriptContext, {
          openScienceTeamMember: false,
          teams: [{ id: 'team-other' }, { id: 'team-beta' }],
          projects: [],
        }),
      ).toBe('team-beta');
    });

    it('returns null when none of the user teams are contributing teams', () => {
      expect(
        getUserCollaboratingTeamId(manuscriptContext, {
          openScienceTeamMember: false,
          teams: [{ id: 'team-other' }],
          projects: [],
        }),
      ).toBeNull();
    });
  });
});
