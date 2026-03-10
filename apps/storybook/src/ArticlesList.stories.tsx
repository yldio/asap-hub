import { Meta, StoryObj } from '@storybook/react-vite';

import { ArticlesList } from '@asap-hub/react-components';
import type { ArticleItem } from '@asap-hub/react-components';

const sampleArticles: ArticleItem[] = [
  { id: '1', title: 'First article title', href: '#' },
  { id: '2', title: 'Second article with a longer name', href: '#' },
  { id: '3', title: 'Third article', href: '#' },
  { id: '4', title: 'Fourth article', href: '#' },
  { id: '5', title: 'Fifth article', href: '#' },
  { id: '6', title: 'Sixth article', href: '#' },
  { id: '7', title: 'Seventh article', href: '#' },
];

const manyArticles: ArticleItem[] = Array.from({ length: 20 }, (_, i) => ({
  id: `art-${i + 1}`,
  title: `Article ${i + 1}: Research findings and outcomes`,
  href: '#',
}));

const meta: Meta<typeof ArticlesList> = {
  component: ArticlesList,
  title: 'Molecules/ArticlesList',
  argTypes: {
    maxWidth: {
      control: { type: 'text' },
      description: 'Max width of the list container (e.g. "360px" or "20rem")',
    },
    initiallyExpanded: {
      control: { type: 'boolean' },
      description: 'Whether the list is expanded on first render',
    },
    listMaxHeight: {
      control: { type: 'text' },
      description:
        'Max height of the scrollable list (e.g. "264px" or "15rem")',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ArticlesList>;

export const Default: Story = {
  args: {
    articles: sampleArticles,
    initiallyExpanded: true,
  },
};

export const CollapsedByDefault: Story = {
  args: {
    articles: sampleArticles,
    initiallyExpanded: false,
  },
};

export const ManyArticles: Story = {
  args: {
    articles: manyArticles,
    initiallyExpanded: true,
    listMaxHeight: '264px',
    maxWidth: '508px',
  },
};

export const SmallWidthList: Story = {
  args: {
    articles: manyArticles,
    initiallyExpanded: true,
    listMaxHeight: '264px',
    maxWidth: '360px',
  },
};

export const EmptyList: Story = {
  args: {
    articles: [],
    initiallyExpanded: true,
  },
};

export const SingleArticle: Story = {
  args: {
    articles: [{ id: '1', title: 'Only one article in this list', href: '#' }],
    initiallyExpanded: true,
  },
};
