import { render } from '@testing-library/react';

import AssociationList from '../AssociationList';

it('generates an entry for each team', () => {
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

describe.each`
  mode        | inline
  ${'block'}  | ${false}
  ${'inline'} | ${true}
`(
  'in $mode mode with a maximum exceeded',
  ({ inline }: { inline: boolean }) => {
    it.each`
      teams | expectedText
      ${1}  | ${/1 team/i}
      ${3}  | ${/3 teams/i}
    `(
      'summarizes the list of $teams teams to a number',
      ({ teams, expectedText }: { teams: number; expectedText: RegExp }) => {
        const { container } = render(
          <AssociationList
            max={0}
            inline={inline}
            type="Team"
            associations={Array(teams)
              .fill(null)
              .map((_, i) => ({ id: `t${i}`, displayName: `Team ${i + 1}` }))}
          />,
        );
        expect(container).toHaveTextContent(expectedText);
      },
    );
  },
);
