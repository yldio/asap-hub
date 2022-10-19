import { ComponentProps } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import TabbedCard from '../TabbedCard';

const props: ComponentProps<typeof TabbedCard<{ name: string }>> = {
  title: '',
  tabs: [{ tabTitle: '', items: [] }],
  getShowMoreText: (showMore) => `View ${showMore ? 'less' : 'more'}`,
  children: ({ data }) => (
    <ul>
      {data.map(({ name }, index) => (
        <li title="item" key={`${index}`}>
          {name}
        </li>
      ))}
    </ul>
  ),
};

it('renders the tabbed card', () => {
  const { getByRole } = render(<TabbedCard {...props} title="test card" />);
  expect(getByRole('heading', { name: 'test card' })).toBeVisible();
});

it('shows a provided description', () => {
  render(<TabbedCard {...props} description="Example Description" />);
  expect(screen.getByText(/Example Description/)).toBeVisible();
});

describe('tabs', () => {
  it('can switch to the second tab', () => {
    render(
      <TabbedCard
        {...props}
        tabs={[
          {
            tabTitle: 'First Tab',
            items: [{ name: 'item a' }, { name: 'item b' }, { name: 'item c' }],
          },
          {
            tabTitle: 'Second Tab',
            items: [{ name: 'item d' }, { name: 'item e' }, { name: 'item f' }],
          },
        ]}
      />,
    );
    expect(
      screen
        .getAllByRole('listitem', { name: 'item' })
        .map(({ textContent }) => textContent),
    ).toEqual(['item a', 'item b', 'item c']);

    fireEvent.click(screen.getByText('Second Tab'));

    expect(
      screen
        .getAllByRole('listitem', { name: 'item' })
        .map(({ textContent }) => textContent),
    ).toEqual(['item d', 'item e', 'item f']);
  });

  it('cannot switch to a disabled tab', () => {
    const { getByText, getByRole } = render(
      <TabbedCard
        {...props}
        tabs={[
          { items: [], tabTitle: 'First Tab' },
          { items: [], tabTitle: 'Second Tab', disabled: true },
        ]}
      />,
    );
    expect(getByRole('button', { name: 'First Tab' })).toHaveStyleRule(
      'font-weight',
      'bold',
    );
    expect(getByRole('button', { name: 'First Tab' })).toBeEnabled();

    expect(getByRole('button', { name: 'Second Tab' })).toBeDisabled();
    expect(getByRole('button', { name: 'Second Tab' })).not.toHaveStyleRule(
      'font-weight',
      'bold',
    );
    fireEvent.click(getByText('Second Tab'));
    expect(getByRole('button', { name: 'First Tab' })).toBeEnabled();
    expect(getByRole('button', { name: 'First Tab' })).toHaveStyleRule(
      'font-weight',
      'bold',
    );

    expect(getByRole('button', { name: 'Second Tab' })).toBeDisabled();
    expect(getByRole('button', { name: 'Second Tab' })).not.toHaveStyleRule(
      'font-weight',
      'bold',
    );
  });

  it('shows the second tab', () => {
    render(
      <TabbedCard
        {...props}
        activeTabIndex={1}
        tabs={[
          { items: [{ name: 'item a' }], tabTitle: 'First Tab' },
          { items: [{ name: 'item b' }], tabTitle: 'Second Tab' },
        ]}
      />,
    );
    expect(
      screen.getByRole('button', { name: 'First Tab' }),
    ).not.toHaveStyleRule('font-weight', 'bold');
    expect(screen.getByRole('button', { name: 'Second Tab' })).toHaveStyleRule(
      'font-weight',
      'bold',
    );
    expect(
      screen
        .getAllByRole('listitem', { name: 'item' })
        .map(({ textContent }) => textContent),
    ).toEqual(['item b']);
  });

  it('displays tabs as active by default', () => {
    const { rerender } = render(
      <TabbedCard
        {...props}
        tabs={[
          { items: [{ name: 'item a' }], tabTitle: 'First Tab' },
          { items: [{ name: 'item b' }], tabTitle: 'Second Tab' },
        ]}
      />,
    );
    expect(screen.getByRole('button', { name: 'First Tab' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Second Tab' })).toBeEnabled();
    rerender(
      <TabbedCard
        {...props}
        tabs={[
          {
            items: [{ name: 'item a' }],
            tabTitle: 'First Tab',
            disabled: true,
          },
          {
            items: [{ name: 'item b' }],
            tabTitle: 'Second Tab',
            disabled: true,
          },
        ]}
      />,
    );
    expect(screen.getByRole('button', { name: 'First Tab' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Second Tab' })).toBeDisabled();
  });
});

describe('the view more functionality', () => {
  it('display the data once the button is clicked', () => {
    render(
      <TabbedCard
        {...props}
        tabs={[
          {
            items: [
              { name: 'item a' },
              { name: 'item b' },
              { name: 'item c' },
              { name: 'item d' },
            ],
            tabTitle: 'First Tab',
            truncateFrom: 2,
          },
        ]}
      />,
    );
    expect(
      screen
        .getAllByRole('listitem', { name: 'item' })
        .map(({ textContent }) => textContent),
    ).toEqual(['item a', 'item b']);
    fireEvent.click(screen.getByText(/View more/i));
    expect(
      screen
        .getAllByRole('listitem', { name: 'item' })
        .map(({ textContent }) => textContent),
    ).toEqual(['item a', 'item b', 'item c', 'item d']);
    fireEvent.click(screen.getByText(/View less/i));
    expect(
      screen
        .getAllByRole('listitem', { name: 'item' })
        .map(({ textContent }) => textContent),
    ).toEqual(['item a', 'item b']);
  });

  it('truncates on tab change', () => {
    const { getByText } = render(
      <TabbedCard
        {...props}
        tabs={[
          {
            items: [
              { name: 'item a' },
              { name: 'item b' },
              { name: 'item c' },
              { name: 'item d' },
            ],
            tabTitle: 'First Tab',
            truncateFrom: 2,
          },
          {
            items: [
              { name: 'item e' },
              { name: 'item f' },
              { name: 'item g' },
              { name: 'item h' },
            ],
            tabTitle: 'Second Tab',
            truncateFrom: 2,
          },
        ]}
      />,
    );
    fireEvent.click(getByText('View more'));
    expect(
      screen
        .getAllByRole('listitem', { name: 'item' })
        .map(({ textContent }) => textContent),
    ).toEqual(['item a', 'item b', 'item c', 'item d']);

    expect(getByText('View less')).toBeVisible();

    fireEvent.click(getByText('Second Tab'));
    expect(getByText('View more')).toBeVisible();
    expect(
      screen
        .getAllByRole('listitem', { name: 'item' })
        .map(({ textContent }) => textContent),
    ).toEqual(['item e', 'item f']);
  });
});
