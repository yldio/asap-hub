import { gp2 } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';
import OutputCard from '../OutputCard';

describe('OutputCard', () => {
  const defaultProps = gp2.createOutputResponse();

  it('renders title', () => {
    render(
      <OutputCard {...defaultProps} title="Output Title" id="output-id" />,
    );
    expect(screen.getByRole('heading', { name: 'Output Title' })).toBeVisible();
    expect(screen.getByText('Output Title').closest('a')).toHaveAttribute(
      'href',
      '/outputs/output-id',
    );
  });

  it('renders link to project', () => {
    render(
      <OutputCard
        {...defaultProps}
        projects={[{ id: '42', title: 'project name' }]}
      />,
    );
    expect(screen.getByRole('link', { name: /project name/i })).toHaveAttribute(
      'href',
      expect.stringContaining('42'),
    );
  });

  it('renders project pill', () => {
    render(
      <OutputCard
        {...defaultProps}
        projects={[{ id: '42', title: 'project name' }]}
      />,
    );
    expect(screen.getByText('Project')).toBeVisible();
  });

  it('renders link to workingGroup', () => {
    render(
      <OutputCard
        {...defaultProps}
        workingGroups={[{ id: '42', title: 'working group name' }]}
      />,
    );
    expect(
      screen.getByRole('link', { name: /working group name/i }),
    ).toHaveAttribute('href', expect.stringContaining('42'));
  });

  it('renders working Group pill', () => {
    render(
      <OutputCard
        {...defaultProps}
        workingGroups={[{ id: '42', title: 'working group name' }]}
        mainEntity={{
          id: '42',
          title: 'working group name',
          type: 'WorkingGroups',
        }}
      />,
    );
    expect(screen.getByText('Working Group')).toBeVisible();
  });

  it('renders multiple projects', () => {
    render(
      <OutputCard
        {...defaultProps}
        projects={[
          { id: '42', title: 'project name' },
          { id: '44', title: 'project name 2' },
        ]}
      />,
    );
    expect(screen.getByText(/2 projects/i)).toBeVisible();
  });

  it('renders multiple workingGroups', () => {
    render(
      <OutputCard
        {...defaultProps}
        workingGroups={[
          { id: '42', title: 'working group name' },
          { id: '44', title: 'working group name 2' },
        ]}
      />,
    );
    expect(screen.getByText(/2 working groups/i)).toBeVisible();
  });

  it('renders the link when available', () => {
    render(<OutputCard {...defaultProps} link="https://example.com" />);
    expect(
      screen.getByRole('link', { name: /access output/i }),
    ).toHaveAttribute('href', 'https://example.com');
  });

  it('renders documentType and output type as pills', () => {
    render(
      <OutputCard {...defaultProps} documentType="Article" type="Research" />,
    );
    expect(
      screen.getAllByRole('listitem').map(({ textContent }) => textContent),
    ).toEqual(expect.arrayContaining(['Article', 'Research']));
  });

  it('renders at most 3 authors names when detailed view is false', () => {
    const authors = [];
    const numAuthors = 10;

    for (let i = 1; i <= numAuthors; i += 1) {
      authors.push({
        ...gp2.createUserResponse(),
        displayName: `John ${i}`,
        id: `john-${i}`,
      });
    }

    const { getByText } = render(
      <OutputCard
        {...gp2.createOutputResponse()}
        detailedView={false}
        authors={authors}
      />,
    );

    for (let i = 1; i <= 3; i += 1) {
      expect(getByText(`John ${i}`)).toBeVisible();
      expect(getByText(`John ${i}`).closest('a')).toHaveAttribute(
        'href',
        `/users/john-${i}`,
      );
    }
    expect(getByText('+7')).toBeVisible();
  });

  describe('detailedView', () => {
    it('shows all authors names', () => {
      const authors = [];
      const numAuthors = 10;

      for (let i = 1; i <= numAuthors; i += 1) {
        authors.push({
          ...gp2.createUserResponse(),
          displayName: `John ${i}`,
          id: `john-${i}`,
        });
      }

      const { getByText } = render(
        <OutputCard
          detailedView
          {...gp2.createOutputResponse()}
          authors={authors}
        />,
      );

      for (let i = 1; i <= numAuthors; i += 1) {
        expect(getByText(`John ${i}`)).toBeVisible();
        expect(getByText(`John ${i}`).closest('a')).toHaveAttribute(
          'href',
          `/users/john-${i}`,
        );
      }
    });

    it('renders an output with the last updated date', () => {
      const { getByText } = render(
        <OutputCard
          detailedView
          {...gp2.createOutputResponse()}
          // month index starts with 0, so month 1 is Feb
          lastUpdatedPartial={new Date(2003, 1, 1, 1).toISOString()}
        />,
      );
      expect(getByText(/1st February 2003/)).toBeVisible();
    });

    it('falls back to created date when added date omitted', () => {
      const { getByText, rerender } = render(
        <OutputCard
          detailedView
          {...gp2.createOutputResponse()}
          created={new Date(2011, 1, 1, 1).toISOString()}
          addedDate={new Date(2012, 1, 1, 1).toISOString()}
        />,
      );
      expect(getByText(/1st February 2012/)).toBeVisible();
      rerender(
        <OutputCard
          detailedView
          {...gp2.createOutputResponse()}
          created={new Date(2011, 1, 1, 1).toISOString()}
          addedDate={new Date(2011, 1, 1, 1).toISOString()}
        />,
      );
      expect(getByText(/1st February 2011/)).toBeVisible();
    });

    it('renders an output with source (project/working group), document type, type, subtype and source name', () => {
      const { getAllByRole, getByText, rerender } = render(
        <OutputCard
          {...gp2.createOutputResponse()}
          detailedView
          authors={[]}
          documentType="Code/Software"
          projects={[]}
          mainEntity={{
            id: 'wg-id',
            type: 'WorkingGroups',
            title: 'Steering Committee',
          }}
          workingGroups={[
            {
              id: 'wg-1',
              title: 'Steering Committee',
            },
            {
              id: 'wg-2',
              title: 'Training, Networking and Communication',
            },
          ]}
          type={undefined}
        />,
      );
      expect(
        getAllByRole('listitem').map(({ textContent }) => textContent),
      ).toEqual([
        'Working Group',
        'Code/Software',
        'Steering Committee·',
        'Training, Networking and Communication',
      ]);
      expect(getByText('Steering Committee').closest('a')).toHaveAttribute(
        'href',
        '/working-groups/wg-1',
      );
      expect(
        getByText('Training, Networking and Communication').closest('a'),
      ).toHaveAttribute('href', '/working-groups/wg-2');

      rerender(
        <OutputCard
          {...gp2.createOutputResponse()}
          detailedView
          authors={[]}
          documentType="Article"
          mainEntity={{
            id: 'project-id',
            type: 'Projects',
            title:
              'Polygenic Risk Score Project of PD risk in non-European populations',
          }}
          projects={[
            {
              id: 'project-id',
              title:
                'Polygenic Risk Score Project of PD risk in non-European populations',
            },
          ]}
          workingGroups={[]}
          type="Blog"
          subtype="Preprints"
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
  });
});
