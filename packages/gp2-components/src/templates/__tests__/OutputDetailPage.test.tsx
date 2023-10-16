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

  it('displays tags with source, documentType, type, subtype and source name', () => {
    const { getAllByRole, getByText } = render(
      <OutputDetailPage
        {...gp2Fixtures.createOutputResponse()}
        isAdministrator
        documentType="Article"
        type="Blog"
        subtype="Preprints"
        projects={[
          {
            id: 'project-id',
            title:
              'Polygenic Risk Score Project of PD risk in non-European populations',
          },
        ]}
        authors={[]}
        workingGroups={[]}
      />,
    );
    expect(
      getAllByRole('listitem').map(({ textContent }) => textContent),
    ).toEqual([
      'Project',
      'Article',
      'Blog',
      'Preprints',
      'Polygenic Risk Score Project of PD risk in non-European populations',
    ]);
    expect(
      getByText(
        'Polygenic Risk Score Project of PD risk in non-European populations',
      ).closest('a'),
    ).toHaveAttribute('href', '/projects/project-id');
  });

  describe('description and tags section', () => {
    it('handles tags and description omitted', () => {
      const { queryByText, queryByRole } = render(
        <OutputDetailPage
          isAdministrator={false}
          {...gp2Fixtures.createOutputResponse()}
          description={''}
        />,
      );
      expect(queryByText(/tags/i, { selector: 'h2' })).not.toBeInTheDocument();
      expect(
        queryByText(/description/i, { selector: 'h2' }),
      ).not.toBeInTheDocument();
      expect(queryByRole('separator')).not.toBeInTheDocument();
    });

    it('handles just description provided', () => {
      const { queryByText, getByText, queryByRole } = render(
        <OutputDetailPage
          isAdministrator={false}
          {...gp2Fixtures.createOutputResponse()}
          description={'Test Description'}
        />,
      );
      expect(queryByText(/tags/i, { selector: 'h2' })).not.toBeInTheDocument();
      expect(
        queryByText(/description/i, { selector: 'h2' }),
      ).toBeInTheDocument();
      expect(getByText('Test Description')).toBeVisible();
      expect(queryByRole('separator')).not.toBeInTheDocument();
    });

    it('handles just tags provided', () => {
      const { queryByText, getByText, queryByRole } = render(
        <OutputDetailPage
          isAdministrator={false}
          {...gp2Fixtures.createOutputResponse()}
          description={''}
          tags={[{ id: 'test-id', name: 'TestTag' }]}
        />,
      );
      expect(queryByText(/tags/i, { selector: 'h2' })).toBeInTheDocument();
      expect(
        queryByText(/description/i, { selector: 'h2' }),
      ).not.toBeInTheDocument();
      expect(getByText('TestTag')).toBeVisible();
      expect(queryByRole('separator')).not.toBeInTheDocument();
    });
    it('handles tags and description provided', () => {
      const { queryByText, getByText, queryByRole } = render(
        <OutputDetailPage
          isAdministrator={false}
          {...gp2Fixtures.createOutputResponse()}
          description={'Test Description'}
          tags={[{ id: 'test-id', name: 'TestTag' }]}
        />,
      );
      expect(queryByText(/tags/i, { selector: 'h2' })).toBeInTheDocument();
      expect(
        queryByText(/description/i, { selector: 'h2' }),
      ).toBeInTheDocument();
      expect(getByText('TestTag')).toBeVisible();
      expect(getByText('Test Description')).toBeVisible();
      expect(queryByRole('separator')).toBeVisible();
    });
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
