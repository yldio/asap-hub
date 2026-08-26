import { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createResearchOutputResponse } from '@asap-hub/fixtures';
import { disable, enable } from '@asap-hub/flags';

import SharedResearchListCard from '../SharedResearchListCard';

const sharedResearchListCardProps: ComponentProps<
  typeof SharedResearchListCard
> = {
  researchOutputs: [],
};
it('renders multiple research outputs', () => {
  const { getAllByRole } = render(
    <SharedResearchListCard
      {...sharedResearchListCardProps}
      researchOutputs={[
        {
          ...createResearchOutputResponse(0),
          title: 'Output 1',
        },
        {
          ...createResearchOutputResponse(1),
          title: 'Output 2',
        },
      ]}
    />,
  );
  expect(getAllByRole('heading').map(({ textContent }) => textContent)).toEqual(
    ['Output 1', 'Output 2'],
  );
});

it('links to research outputs', () => {
  const { getByRole } = render(
    <SharedResearchListCard
      {...sharedResearchListCardProps}
      researchOutputs={[
        {
          ...createResearchOutputResponse(0),
          title: 'Output 1',
          id: '123',
        },
      ]}
    />,
  );
  expect(getByRole('heading').closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/123/i),
  );
});

it('shows external link icon when link provided', () => {
  const { getByTitle, queryByTitle, rerender } = render(
    <SharedResearchListCard
      {...sharedResearchListCardProps}
      researchOutputs={[
        {
          ...createResearchOutputResponse(0),
          link: undefined,
        },
      ]}
    />,
  );
  expect(queryByTitle(/external/i)).not.toBeInTheDocument();
  rerender(
    <SharedResearchListCard
      {...sharedResearchListCardProps}
      researchOutputs={[
        {
          ...createResearchOutputResponse(0),
          link: 'http://example.com',
        },
      ]}
    />,
  );
  expect(getByTitle(/external/i).closest('a')).toHaveAttribute(
    'href',
    'http://example.com',
  );
});

describe('association pill', () => {
  const userBasedProjectOutput = {
    ...createResearchOutputResponse(0),
    publishingEntity: 'Project' as const,
    workingGroups: undefined,
    teams: [
      {
        id: '1',
        displayName: 'Team A',
        teamType: 'Discovery Team' as const,
      },
    ],
  };

  const teamBasedProjectOutput = {
    ...createResearchOutputResponse(0),
    publishingEntity: 'Team' as const,
    workingGroups: undefined,
    teams: [
      {
        id: '1',
        displayName: 'Team A',
        teamType: 'Discovery Team' as const,
        project: {
          id: 'project-1',
          title: 'My Project',
          projectType: 'Trainee Project' as const,
          projectId: 'ASAP-P1',
        },
      },
    ],
  };

  afterEach(() => {
    disable('PROJECT_OUTPUTS');
  });

  it('shows a Project pill for a user-based project output when PROJECT_OUTPUTS is enabled', () => {
    enable('PROJECT_OUTPUTS');
    const { getByText } = render(
      <SharedResearchListCard
        {...sharedResearchListCardProps}
        researchOutputs={[userBasedProjectOutput]}
      />,
    );
    expect(getByText('Project')).toBeVisible();
  });

  it('shows a Project pill for a team-based project output when PROJECT_OUTPUTS is enabled', () => {
    enable('PROJECT_OUTPUTS');
    const { getByText } = render(
      <SharedResearchListCard
        {...sharedResearchListCardProps}
        researchOutputs={[teamBasedProjectOutput]}
      />,
    );
    expect(getByText('Project')).toBeVisible();
  });
});
