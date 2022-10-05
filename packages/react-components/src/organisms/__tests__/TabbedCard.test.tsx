import { fireEvent, render } from '@testing-library/react';
import TabbedCard, { TabProps } from '../TabbedCard';

const tab1: TabProps = {
  title: 'Tab 1',
  counter: 1,
  content: <div>Tab 1 content</div>,
};

const tab2: TabProps = {
  title: 'Tab 2',
  counter: 1,
  content: <div>Tab 2 content</div>,
};

it('renders the TabbedCard', () => {
  const { getByText, queryByText } = render(
    <TabbedCard
      title="Card title"
      description="Card description"
      firstTab={tab1}
      secondTab={tab2}
    />,
  );

  expect(getByText('Card title')).toBeVisible();
  expect(getByText('Card description')).toBeVisible();
  expect(getByText(`Tab 1 (${tab1.counter})`)).toBeVisible();
  expect(getByText(`Tab 2 (${tab2.counter})`)).toBeVisible();
  expect(getByText('Tab 1 content')).toBeVisible();
  expect(queryByText('Tab 2 content')).not.toBeInTheDocument();
});

it('can switch between tabs', () => {
  const { getByText, queryByText } = render(
    <TabbedCard
      title="Card title"
      description="Card description"
      firstTab={tab1}
      secondTab={tab2}
    />,
  );

  expect(getByText('Tab 1 content')).toBeVisible();
  expect(queryByText('Tab 2 content')).not.toBeInTheDocument();
  fireEvent.click(getByText(`Tab 2 (${tab2.counter})`));
  expect(queryByText('Tab 1 content')).not.toBeInTheDocument();
  expect(getByText('Tab 2 content')).toBeInTheDocument();
});

it('cannot switch to disabled tabs', () => {
  const { getByText, queryByText } = render(
    <TabbedCard
      title="Card title"
      description="Card description"
      firstTab={tab1}
      secondTab={tab2}
      secondTabDisabled
    />,
  );

  expect(getByText('Tab 1 content')).toBeVisible();
  expect(queryByText('Tab 2 content')).not.toBeInTheDocument();
  fireEvent.click(getByText(`Tab 2 (${tab2.counter})`));
  expect(getByText('Tab 1 content')).toBeVisible();
  expect(queryByText('Tab 2 content')).not.toBeInTheDocument();
});
