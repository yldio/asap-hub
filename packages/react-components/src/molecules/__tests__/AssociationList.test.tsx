import { render, screen } from '@testing-library/react';

import AssociationList from '../AssociationList';

describe('Teams', () => {
  it('generates an entry with team prefix for each team', () => {
    const { getAllByRole } = render(
      <AssociationList
        type="Team"
        associations={[
          { displayName: 'One', id: 't0' },
          { displayName: 'Two', id: 't1' },
        ]}
      />,
    );
    expect(
      getAllByRole('listitem').map(({ textContent }) => textContent),
    ).toEqual([
      expect.stringContaining('Team One'),
      expect.stringContaining('Team Two'),
    ]);
  });

  it('links to the teams', () => {
    const { getByText } = render(
      <AssociationList
        type="Team"
        associations={[{ displayName: 'One', id: 't0' }]}
      />,
    );
    expect(getByText(/team.one/i).closest('a')).toHaveAttribute(
      'href',
      expect.stringMatching(/t0$/),
    );
  });

  it('displays inactive badge when team is inactive', () => {
    const { getByTitle } = render(
      <AssociationList
        type="Team"
        associations={[
          {
            displayName: 'One',
            id: 't0',
            inactiveSince: '2022-09-30T09:00:00Z',
          },
        ]}
      />,
    );
    expect(getByTitle('Inactive Team')).toBeInTheDocument();
  });

  it('display type in plural if there is more than one', () => {
    const { getByText } = render(
      <AssociationList
        type="Team"
        associations={[
          { displayName: 'One', id: 't0' },
          { displayName: 'One', id: 't0' },
        ]}
        max={1}
      />,
    );
    expect(getByText(/2 teams/i)).toBeInTheDocument();
  });

  describe('in inline mode', () => {
    it('renders one team icon as opposed to one each', () => {
      const { getAllByTitle, rerender } = render(
        <AssociationList
          type="Team"
          associations={[
            { displayName: 'One', id: 't0' },
            { displayName: 'Two', id: 't1' },
          ]}
        />,
      );
      expect(getAllByTitle(/team/i)).toHaveLength(2);

      rerender(
        <AssociationList
          inline
          type="Team"
          associations={[
            { displayName: 'One', id: 't0' },
            { displayName: 'Two', id: 't1' },
          ]}
        />,
      );
      expect(getAllByTitle(/team/i)).toHaveLength(1);
    });

    it('does not render a team icon if there are no teams', () => {
      const { queryByTitle } = render(
        <AssociationList inline type="Team" associations={[]} />,
      );
      expect(queryByTitle(/team/i)).not.toBeInTheDocument();
    });
  });
});

describe('Labs', () => {
  it('generates an entry for each lab with suffix without links', () => {
    const { getAllByRole, queryByRole } = render(
      <AssociationList
        type="Lab"
        associations={[
          { displayName: 'One', id: 't0' },
          { displayName: 'Two', id: 't1' },
        ]}
      />,
    );
    expect(
      getAllByRole('listitem').map(({ textContent }) => textContent),
    ).toEqual([
      expect.stringContaining('One Lab'),
      expect.stringContaining('Two Lab'),
    ]);
    expect(queryByRole('link')).toBeNull();
  });
  describe('in inline mode', () => {
    it('renders one lab icon as opposed to one each', () => {
      const { getAllByTitle, rerender } = render(
        <AssociationList
          type="Lab"
          associations={[
            { displayName: 'One', id: 't0' },
            { displayName: 'Two', id: 't1' },
          ]}
        />,
      );
      expect(getAllByTitle(/lab/i)).toHaveLength(2);

      rerender(
        <AssociationList
          inline
          type="Lab"
          associations={[
            { displayName: 'One', id: 't0' },
            { displayName: 'Two', id: 't1' },
          ]}
        />,
      );
      expect(getAllByTitle(/lab/i)).toHaveLength(1);
    });

    it('does not render a lab icon if there are no labs', () => {
      const { queryByTitle } = render(
        <AssociationList inline type="Lab" associations={[]} />,
      );
      expect(queryByTitle(/lab/i)).not.toBeInTheDocument();
    });
  });
});

describe.each`
  mode        | inline
  ${'block'}  | ${false}
  ${'inline'} | ${true}
`(
  'in $mode mode with a maximum exceeded',
  ({ inline }: { inline: boolean }) => {
    it.each`
      count | type      | expectedText
      ${1}  | ${'Team'} | ${/1 team/i}
      ${3}  | ${'Team'} | ${/3 teams/i}
      ${1}  | ${'Lab'}  | ${/1 lab/i}
      ${3}  | ${'Lab'}  | ${/3 labs/i}
    `(
      'summarizes the list of $count $type to a number',
      ({
        count,
        expectedText,
        type,
      }: {
        count: number;
        expectedText: RegExp;
        type: 'Team' | 'Lab';
      }) => {
        const { container } = render(
          <AssociationList
            max={0}
            inline={inline}
            type={type}
            associations={Array(count)
              .fill(null)
              .map((_, i) => ({ id: `t${i}`, displayName: `${i + 1}` }))}
          />,
        );
        expect(container).toHaveTextContent(expectedText);
      },
    );
  },
);

it('shows number of additional associations when more parameter is provided', () => {
  render(
    <AssociationList
      type="Lab"
      associations={[
        { displayName: 'One', id: 't0' },
        { displayName: 'Two', id: 't1' },
      ]}
      more={4}
    />,
  );

  expect(screen.getByText('+4')).toBeInTheDocument();
});

it('displays the associations', () => {
  render(
    <AssociationList
      type="Lab"
      associations={[
        { displayName: 'One', id: 't0' },
        { displayName: 'Two', id: 't1' },
      ]}
      more={4}
    />,
  );

  expect(screen.getAllByRole('listitem').length).toEqual(2);
  expect(screen.getByText('+4')).toBeInTheDocument();
});

it('renders impact association', () => {
  render(
    <AssociationList
      type="Impact"
      associations={[{ displayName: 'Impact One', id: 'i1' }]}
    />,
  );
  expect(screen.getByText('Impact One')).toBeInTheDocument();
  expect(screen.getByTitle('Impact icon')).toBeInTheDocument();
});

it('renders category associations', () => {
  render(
    <AssociationList
      inline
      type="Category"
      associations={[
        { displayName: 'Cat One', id: 'c1' },
        { displayName: 'Cat Two', id: 'c2' },
      ]}
    />,
  );
  expect(screen.getByText('Cat One')).toBeInTheDocument();
  expect(screen.getByText('Cat Two')).toBeInTheDocument();
  expect(screen.getByTitle('Category icon')).toBeInTheDocument();
});
