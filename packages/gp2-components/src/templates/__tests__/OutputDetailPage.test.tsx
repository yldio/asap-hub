import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { render } from '@testing-library/react';

import OutputDetailPage from '../OutputDetailPage';

describe('OutputDetailPage', () => {
  it('displays edit button if user is administrator', () => {
    const { queryByTitle } = render(
      <OutputDetailPage
        isAdministrator
        {...gp2Fixtures.createOutputResponse()}
      />,
    );
    expect(queryByTitle('Edit')).toBeInTheDocument();
  });

  it('does not display edit button if user is not administrator', () => {
    const { queryByTitle } = render(
      <OutputDetailPage
        isAdministrator={false}
        {...gp2Fixtures.createOutputResponse()}
      />,
    );
    expect(queryByTitle('Edit')).not.toBeInTheDocument();
  });

  it('displays the related research card when data provided', () => {
    const { queryByText, getByText, rerender } = render(
      <OutputDetailPage
        {...gp2Fixtures.createOutputResponse()}
        isAdministrator
        documentType="Article"
        relatedOutputs={[]}
      />,
    );
    expect(queryByText(/Related Outputs/i)).not.toBeInTheDocument();

    rerender(
      <OutputDetailPage
        {...gp2Fixtures.createOutputResponse()}
        isAdministrator
        documentType="Article"
        relatedOutputs={[
          {
            id: 'id1',
            title: 'Related research article',
            type: 'Blog',
            documentType: 'Article',
            entity: {
              id: 'wg-1',
              title: 'Working Group 1',
              type: 'WorkingGroups',
            },
          },
        ]}
      />,
    );
    expect(getByText('Related Outputs')).toBeVisible();
    expect(
      getByText('Find all outputs that contributed to this one.'),
    ).toBeVisible();
    expect(getByText(/Related research article/i)).toBeVisible();
    expect(getByText(/Related research article/i).closest('a')).toHaveAttribute(
      'href',
      '/outputs/id1',
    );
    expect(getByText(/Working Group 1/i)).toBeVisible();
    expect(getByText(/Working Group 1/i).closest('a')).toHaveAttribute(
      'href',
      '/working-groups/wg-1',
    );
  });

  it('displays contact support footer', () => {
    const { getByText } = render(
      <OutputDetailPage
        isAdministrator
        {...gp2Fixtures.createOutputResponse()}
      />,
    );
    expect(getByText('Have additional questions?')).toBeInTheDocument();
    expect(
      getByText('Reach out to tech support if you need help.'),
    ).toBeInTheDocument();

    expect(getByText('Contact Tech Support')).toBeInTheDocument();
    expect(getByText('Contact Tech Support').closest('a')).toHaveAttribute(
      'href',
      expect.stringMatching(/techsupport@gp2.org/i),
    );
  });
});
