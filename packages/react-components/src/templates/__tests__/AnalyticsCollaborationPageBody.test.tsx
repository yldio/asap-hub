import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import { AnalyticsCollaborationPageBody } from '..';

describe('AnalyticsProductivityPageBody', () => {
  const props: ComponentProps<typeof AnalyticsCollaborationPageBody> = {
    setMetric: () => null,
    setType: () => null,
    metric: 'user',
    type: 'within-team',
    children: <span>table</span>,
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
      expect(container).toHaveTextContent(
        'different core labs within same team',
      );
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
});
