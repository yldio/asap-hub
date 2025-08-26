import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import { AnalyticsCollaborationPageBody } from '..';

describe('AnalyticsCollaborationPageBody', () => {
  const props: ComponentProps<typeof AnalyticsCollaborationPageBody> = {
    children: <span>table</span>,
    currentPage: 2,
    exportResults: () => Promise.resolve(),
    loadTags: jest.fn().mockResolvedValue([]),
    metric: 'user',
    setMetric: () => null,
    setTags: jest.fn(),
    setType: () => null,
    tags: [],
    timeRange: '30d',
    type: 'within-team',
    isPrelimSharingEnabled: false,
  };

  describe('user tab', () => {
    it('renders user collaboration within team header & description', () => {
      const { container, getByRole } = render(
        <AnalyticsCollaborationPageBody {...props} />,
      );

      expect(
        getByRole('heading', { name: /Co-Production Within Team by User/i }),
      ).toBeInTheDocument();
      expect(container).toHaveTextContent(
        'another user on the same team from a different lab',
      );
    });

    it('renders user collaboration across teams header & description', () => {
      const { container, getByRole } = render(
        <AnalyticsCollaborationPageBody {...props} type="across-teams" />,
      );

      expect(
        getByRole('heading', { name: /Co-Production Across Teams by User/i }),
      ).toBeInTheDocument();

      expect(container).toHaveTextContent(
        'another CRN user who is not from the same CRN team',
      );
    });
  });

  describe('team tab', () => {
    it('renders team collaboration within team header & description', () => {
      const { container, getByRole } = render(
        <AnalyticsCollaborationPageBody
          {...props}
          metric="team"
          type="within-team"
        />,
      );

      expect(
        getByRole('heading', { name: /Co-Production Within Teams by Team/i }),
      ).toBeInTheDocument();
      expect(container).toHaveTextContent('different labs within same team');
    });

    it('renders team collaboration across teams header & description', () => {
      const { container, getByRole } = render(
        <AnalyticsCollaborationPageBody
          {...props}
          metric="team"
          type="across-teams"
        />,
      );

      expect(
        getByRole('heading', { name: /Co-Production Across Teams by Team/i }),
      ).toBeInTheDocument();

      expect(container).toHaveTextContent(
        'additional teams are listed as contributors to the output',
      );
    });
  });

  describe('sharing prelim findings tab', () => {
    it('renders sharing preliminary findings page header & description', () => {
      const { container, getByRole } = render(
        <AnalyticsCollaborationPageBody
          {...props}
          metric="sharing-prelim-findings"
          type={undefined}
          isPrelimSharingEnabled
        />,
      );

      expect(
        getByRole('heading', { name: /Sharing Preliminary Findings/i }),
      ).toBeInTheDocument();
      expect(container).toHaveTextContent(
        'Percentage of preliminary findings shared by each team',
      );
    });

    it('does not display type dropdown when not provided', () => {
      const { queryByText } = render(
        <AnalyticsCollaborationPageBody
          {...props}
          metric="team"
          isPrelimSharingEnabled
          type={undefined}
        />,
      );

      expect(queryByText(/Type/i)).not.toBeInTheDocument();
    });
  });
});
