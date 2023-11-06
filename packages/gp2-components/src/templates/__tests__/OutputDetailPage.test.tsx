import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { render } from '@testing-library/react';

import OutputDetailPage from '../OutputDetailPage';

describe('OutputDetailPage', () => {
  it('displays edit and duplicate buttons if user is administrator', () => {
    const { queryByTitle } = render(
      <OutputDetailPage
        isAdministrator
        {...gp2Fixtures.createOutputResponse()}
      />,
    );
    expect(queryByTitle('Edit')).toBeInTheDocument();
    expect(queryByTitle('Duplicate')).toBeInTheDocument();
  });

  it('does not display edit and duplicate buttons if user is not administrator', () => {
    const { queryByTitle } = render(
      <OutputDetailPage
        isAdministrator={false}
        {...gp2Fixtures.createOutputResponse()}
      />,
    );
    expect(queryByTitle('Edit')).not.toBeInTheDocument();
    expect(queryByTitle('Duplicate')).not.toBeInTheDocument();
  });

  it('uses project duplicate output route if output is linked to a project', () => {
    const output = gp2Fixtures.createOutputResponse();
    const { getByRole } = render(
      <OutputDetailPage
        isAdministrator
        {...output}
        mainEntity={{ id: 'proj-id', title: 'Test Project', type: 'Projects' }}
      />,
    );
    expect(getByRole('link', { name: /Duplicate/i })).toHaveAttribute(
      'href',
      `/projects/proj-id/duplicate/${output.id}`,
    );
  });

  it('uses working group duplicate output route if output is linked to a working group', () => {
    const output = gp2Fixtures.createOutputResponse();
    const { getByRole } = render(
      <OutputDetailPage
        isAdministrator
        {...output}
        mainEntity={{ id: 'wg-id', title: 'Test WG', type: 'WorkingGroups' }}
      />,
    );

    expect(getByRole('link', { name: /Duplicate/i })).toHaveAttribute(
      'href',
      `/working-groups/wg-id/duplicate/${output.id}`,
    );
  });

  it('does not have a url if output owner type is undefined', () => {
    const output = gp2Fixtures.createOutputResponse();
    const { getByText } = render(
      <OutputDetailPage
        isAdministrator
        {...output}
        mainEntity={{ id: 'wg-id', title: 'Test WG' }}
      />,
    );

    expect(
      getByText(/Duplicate/i, { selector: 'span' }).closest('a'),
    ).not.toHaveAttribute('href');
  });

  describe('description and tags section', () => {
    it('handles tags and description omitted', () => {
      const { queryByText } = render(
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
    });

    it('handles just description provided', () => {
      const { queryByText, getByText } = render(
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
    });

    it('handles just tags provided', () => {
      const { queryByText, getByText } = render(
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
    });
    it('handles tags and description provided', () => {
      const { queryByText, getByText } = render(
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
    });
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
