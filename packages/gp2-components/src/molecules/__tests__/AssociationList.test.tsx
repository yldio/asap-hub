import { render, screen } from '@testing-library/react';

import AssociationList from '../AssociationList';

describe.each`
  associationType    | associationTitle    | link
  ${'Project'}       | ${'Projects'}       | ${'projects'}
  ${'Working Group'} | ${'Working Groups'} | ${'working-groups'}
`('$associationType', ({ associationType, associationTitle, link }) => {
  it(`generates an entry with association type title for each association`, () => {
    const { getAllByRole } = render(
      <AssociationList
        type={associationType}
        associations={[
          { title: 'One', id: 't0' },
          { title: 'Two', id: 't1' },
        ]}
      />,
    );
    expect(
      getAllByRole('listitem').map(({ textContent }) => textContent),
    ).toEqual([expect.stringContaining('One'), expect.stringContaining('Two')]);
  });

  it('links to the association type', () => {
    const { getByText } = render(
      <AssociationList
        type={associationType}
        associations={[{ title: 'One', id: 't0' }]}
      />,
    );
    expect(getByText(/one/i).closest('a')).toHaveAttribute(
      'href',
      `/${link}/t0`,
    );
  });

  it('display type in plural if there is more than one', () => {
    const { getByText } = render(
      <AssociationList
        type={associationType}
        associations={[
          { title: 'One', id: 't0' },
          { title: 'One', id: 't0' },
        ]}
        max={1}
      />,
    );
    expect(getByText(`2 ${associationType}s`)).toBeInTheDocument();
  });

  describe('in inline mode', () => {
    it(`renders one association icon as opposed to one each`, () => {
      const { getAllByTitle, rerender } = render(
        <AssociationList
          type={associationType}
          associations={[
            { title: 'One', id: 't0' },
            { title: 'Two', id: 't1' },
          ]}
        />,
      );
      expect(getAllByTitle(associationTitle)).toHaveLength(2);

      rerender(
        <AssociationList
          inline
          type={associationType}
          associations={[
            { title: 'One', id: 't0' },
            { title: 'Two', id: 't1' },
          ]}
        />,
      );
      expect(getAllByTitle(associationTitle)).toHaveLength(1);
    });

    it(`does not render an association icon if there are no associations`, () => {
      const { queryByTitle } = render(
        <AssociationList inline type={associationType} associations={[]} />,
      );
      expect(queryByTitle(associationTitle)).not.toBeInTheDocument();
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
      count | type               | expectedText
      ${1}  | ${'Project'}       | ${/1 project/i}
      ${3}  | ${'Project'}       | ${/3 projects/i}
      ${1}  | ${'Working Group'} | ${/1 working group/i}
      ${3}  | ${'Working Group'} | ${/3 working groups/i}
    `(
      'summarizes the list of $count $type to a number',
      ({
        count,
        expectedText,
        type,
      }: {
        count: number;
        expectedText: RegExp;
        type: 'Project' | 'Working Group';
      }) => {
        const { container } = render(
          <AssociationList
            max={0}
            inline={inline}
            type={type}
            associations={Array(count)
              .fill(null)
              .map((_, i) => ({ id: `t${i}`, title: `${i + 1}` }))}
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
      type="Working Group"
      associations={[
        { title: 'One', id: 't0' },
        { title: 'Two', id: 't1' },
      ]}
      more={4}
    />,
  );
  expect(screen.getAllByRole('listitem').length).toEqual(2);
  expect(screen.getByText('+4')).toBeInTheDocument();
});
