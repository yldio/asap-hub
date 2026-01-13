import { Frame } from '@asap-hub/frontend-utils';
import { UserPatchRequest, UserResponse } from '@asap-hub/model';
import {
  OpenQuestionsModal,
  RoleModal,
  UserProfileResearch,
  UserProjectsCard,
  WorkingGroupsTabbedCard,
  UserTeamsTabbedCard,
  ExpertiseAndResourcesModal,
} from '@asap-hub/react-components';
import { useCurrentUserCRN } from '@asap-hub/react-context';
import { network } from '@asap-hub/routing';
import { Route, Routes } from 'react-router-dom';

import { usePatchUserById } from './state';
import InterestGroupsCard from './interest-groups/InterestGroupsCard';
import { useResearchTags } from '../../shared-state';
import { useProjectsByUserId } from '../../projects/state';

type ResearchProps = {
  user: UserResponse;
};
const Research: React.FC<ResearchProps> = ({ user }) => {
  const researchTagsSuggestions = useResearchTags();
  const userProjects = useProjectsByUserId(user.id);

  // Dummy data for testing - TODO: replace with real API call
   /* const userProjects = {
    total: 8,
    items: [
      {
        id: 'project-1',
        title: 'CRISPR Gene Editing in Human Cells',
        status: 'Active' as const,
        projectType: 'Discovery Project' as const,
        startDate: '2023-01-15',
        endDate: '2025-12-31',
        tags: ['CRISPR', 'Gene Editing', 'Stem Cells'],
        projectId: 'DP-001',
        grantId: 'NIH-R01-12345',
      },
      {
        id: 'project-2',
        title: 'High-Throughput Screening Platform',
        status: 'Completed' as const,
        projectType: 'Resource Project' as const,
        startDate: '2022-03-01',
        endDate: '2024-02-28',
        tags: ['Drug Discovery', 'Automation', 'Assay Development'],
        projectId: 'RP-002',
        grantId: 'NSF-CHE-67890',
      },
      {
        id: 'project-3',
        title: 'Molecular Biology Training Program',
        status: 'Active' as const,
        projectType: 'Resource Project' as const,
        startDate: '2023-09-01',
        endDate: '2024-08-31',
        tags: ['Training', 'Education', 'Molecular Biology'],
        projectId: 'TP-003',
        grantId: 'NIH-T32-54321',
      },
      {
        id: 'project-4',
        title: 'Neural Circuit Mapping Initiative',
        status: 'Active' as const,
        projectType: 'Discovery Project' as const,
        startDate: '2023-06-01',
        endDate: '2026-05-31',
        tags: ['Neuroscience', 'Brain Mapping', 'Imaging'],
        projectId: 'DP-004',
        grantId: 'NIH-R01-67890',
      },
      {
        id: 'project-5',
        title: 'Bioinformatics Core Facility',
        status: 'Completed' as const,
        projectType: 'Resource Project' as const,
        startDate: '2021-09-01',
        endDate: '2024-08-31',
        tags: ['Bioinformatics', 'Data Analysis', 'Genomics'],
        projectId: 'RP-005',
        grantId: 'NSF-DBI-11234',
      },
      {
        id: 'project-6',
        title: 'Stem Cell Differentiation Protocols',
        status: 'Closed' as const,
        projectType: 'Resource Project' as const,
        startDate: '2020-01-01',
        endDate: '2023-12-31',
        tags: ['Stem Cells', 'Differentiation', 'Protocols'],
        projectId: 'RP-006',
        grantId: 'NIH-R01-44556',
      },
      {
        id: 'project-7',
        title: 'Computational Biology Summer Program',
        status: 'Active' as const,
        projectType: 'Resource Project' as const,
        startDate: '2024-06-01',
        endDate: '2024-08-31',
        tags: ['Computation', 'Summer Program', 'Training'],
        projectId: 'TP-007',
        grantId: 'NSF-REU-77889',
      },
      {
        id: 'project-8',
        title: 'Protein Structure Prediction Tools',
        status: 'Completed' as const,
        projectType: 'Discovery Project' as const,
        startDate: '2022-01-01',
        endDate: '2024-12-31',
        tags: ['Protein Structure', 'AI', 'Prediction'],
        projectId: 'DP-008',
        grantId: 'NIH-R01-99000',
      },
    ],
  } */;

  const { id } = useCurrentUserCRN() ?? {};
  const route = network({}).users({}).user({ userId: user.id }).research({});

  const patchUser = usePatchUserById(user.id);

  const commonModalProps = {
    backHref: route.$,
    onSave: (patchedUser: UserPatchRequest) => patchUser(patchedUser),
  };

  return (
    <>
      <UserProfileResearch
        {...user}
        userProfileGroupsCard={
          <Frame title={null} fallback={null}>
            <InterestGroupsCard user={user} />
          </Frame>
        }
        userProfileProjectsCard={
          <Frame title={null} fallback={null}>
            <UserProjectsCard projects={userProjects.items} />
          </Frame>
        }
        userProfileWorkingGroupsCard={
          <Frame title={null} fallback={null}>
            <WorkingGroupsTabbedCard
              isUserAlumni={!!user.alumniSinceDate}
              groups={user.workingGroups}
            />
          </Frame>
        }
        userProfileTeamsCard={
          <Frame title={null} fallback={null}>
            <UserTeamsTabbedCard
              userAlumni={!!user.alumniSinceDate}
              teams={user.teams}
            />
          </Frame>
        }
        editExpertiseAndResourcesHref={
          id === user.id ? route.editExpertiseAndResources({}).$ : undefined
        }
        editQuestionsHref={
          id === user.id ? route.editQuestions({}).$ : undefined
        }
        editRoleHref={id === user.id ? route.editRole({}).$ : undefined}
        isOwnProfile={id === user.id}
      />
      {id === user.id && (
        <Routes>
          <Route
            path={route.editRole.template}
            element={
              <Frame title="Edit Role">
                <RoleModal
                  {...commonModalProps}
                  teams={user.teams}
                  labs={user.labs}
                  researchInterests={user.researchInterests}
                  responsibilities={user.responsibilities}
                  role={user.role}
                  reachOut={user.reachOut}
                  firstName={user.firstName}
                />
              </Frame>
            }
          />
          <Route
            path={route.editQuestions.template}
            element={
              <Frame title="Edit Open Questions">
                <OpenQuestionsModal {...user} {...commonModalProps} />
              </Frame>
            }
          />
          <Route
            path={route.editExpertiseAndResources.template}
            element={
              <Frame title="Edit Expertise and Resources">
                <ExpertiseAndResourcesModal
                  {...user}
                  {...commonModalProps}
                  suggestions={researchTagsSuggestions}
                />
              </Frame>
            }
          />
        </Routes>
      )}
    </>
  );
};

export default Research;
