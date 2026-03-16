import { Meta, StoryObj } from '@storybook/react-vite';

import { ArticlesList } from '@asap-hub/react-components';
import type { ArticleItem } from '@asap-hub/model';

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

const mockFetch =
  (articles: ReadonlyArray<ArticleItem>, delayMs = 300) =>
  (): Promise<ReadonlyArray<ArticleItem>> =>
    new Promise((resolve) => {
      setTimeout(() => resolve(articles), delayMs);
    });

const meta: Meta<typeof ArticlesList> = {
  component: ArticlesList,
  title: 'Molecules/ArticlesList',
  argTypes: {
    aimId: { control: { type: 'text' } },
    articlesCount: { control: { type: 'number' } },
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
    aimId: 'aim-1',
    articlesCount: sampleArticles.length,
    initiallyExpanded: false,
    fetchArticles: mockFetch(sampleArticles),
  },
};

export const ExpandedWithArticles: Story = {
  args: {
    aimId: 'aim-1',
    articlesCount: sampleArticles.length,
    initiallyExpanded: true,
    fetchArticles: mockFetch(sampleArticles),
  },
};

export const ManyArticles: Story = {
  args: {
    aimId: 'aim-2',
    articlesCount: manyArticles.length,
    initiallyExpanded: false,
    listMaxHeight: '264px',
    maxWidth: '508px',
    fetchArticles: mockFetch(manyArticles),
  },
};

export const SmallWidthList: Story = {
  args: {
    aimId: 'aim-3',
    articlesCount: manyArticles.length,
    initiallyExpanded: false,
    listMaxHeight: '264px',
    maxWidth: '360px',
    fetchArticles: mockFetch(manyArticles),
  },
};

export const EmptyList: Story = {
  args: {
    aimId: 'aim-empty',
    articlesCount: 0,
    initiallyExpanded: false,
    fetchArticles: mockFetch([]),
  },
};

export const SingleArticle: Story = {
  args: {
    aimId: 'aim-single',
    articlesCount: 1,
    initiallyExpanded: false,
    fetchArticles: mockFetch([
      { id: '1', title: 'Only one article in this list', href: '#' },
    ]),
  },
};
