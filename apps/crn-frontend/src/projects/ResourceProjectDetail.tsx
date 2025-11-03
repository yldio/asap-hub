import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Frame } from '@asap-hub/frontend-utils';
import {
  ProjectDetailPage,
  ProjectDetailAbout,
  NotFoundPage,
} from '@asap-hub/react-components';
import { projects } from '@asap-hub/routing';
import { ResourceProjectDetail as ResourceProjectDetailType } from '@asap-hub/model';

// Mock data - this would come from API in real implementation
const mockResourceProjectDetail: ResourceProjectDetailType = {
  id: '1',
  title: 'Resource Project Title',
  status: 'Active',
  projectType: 'Resource',
  resourceType: 'Biospecimen',
  isTeamBased: false,
  startDate: '2023-01-15',
  endDate: '2025-12-31',
  duration: '3 mos',
  tags: ['Biospecimen', 'Data Resource', 'Genomics'],
  googleDriveLink: 'https://drive.google.com/example',
  members: [
    {
      id: 'user-1',
      displayName: 'Alice Johnson',
      firstName: 'Alice',
      lastName: 'Johnson',
      href: '/network/users/user-1',
      avatarUrl: '',
      role: 'Staff',
    },
    {
      id: 'user-2',
      displayName: 'Bob Williams',
      firstName: 'Bob',
      lastName: 'Williams',
      href: '/network/users/user-2',
      avatarUrl: '',
      role: 'Grantee',
    },
  ],
  description:
    "We hypothesize that the functions of multiple Parkinson's disease genes converge on common biochemical pathways involving endocytic organelles and/or mitochondria within vulnerable cell types.",
  originalGrant: {
    title: 'Original Grant - Resource Development',
    description:
      "We hypothesize that the functions of multiple Parkinson's disease genes converge on common biochemical pathways involving endocytic organelles and/or mitochondria within vulnerable cell types. We will use a comprehensive cell biology tool kit including cutting-edge biochemistry, structural biology, microscopy at different scales, and genome editing tools.",
    proposalURL: 'https://example.com/proposal',
  },
  milestones: [
    {
      id: 'm1',
      title: 'Milestone 1',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      status: 'Complete',
      link: 'https://example.com/milestone1',
    },
    {
      id: 'm2',
      title: 'Milestone 2',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
      status: 'In Progress',
    },
  ],
};

type ResourceProjectDetailParams = {
  projectId: string;
};

const ResourceProjectDetail: FC<Record<string, never>> = () => {
  const { projectId } = useParams<ResourceProjectDetailParams>();

  // TODO: Fetch project data from API using projectId
  const project = mockResourceProjectDetail;

  // istanbul ignore next - will be covered when API integration is implemented
  if (!project) {
    return <NotFoundPage />;
  }

  const route = projects({})
    .resourceProjects({})
    .resourceProject({ projectId });

  return (
    <Frame title={project.title}>
      <ProjectDetailPage
        {...project}
        pointOfContactEmail="contact@example.com"
        aboutHref={route.about({}).$}
      >
        <ProjectDetailAbout
          {...project}
          pointOfContactEmail="contact@example.com"
        />
      </ProjectDetailPage>
    </Frame>
  );
};

export default ResourceProjectDetail;
