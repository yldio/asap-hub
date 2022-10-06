import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import NewsCard from '../NewsCard';

describe('News', () => {
  const newsCardProps: ComponentProps<typeof NewsCard> = {
    id: 'uuid',
    type: 'News',
    title: 'Not a Title',
    created: new Date().toISOString(),
  };

  it('renders the title', () => {
    const { getByRole } = render(<NewsCard {...newsCardProps} title="Title" />);
    expect(getByRole('heading').textContent).toEqual('Title');
    expect(getByRole('heading').tagName).toEqual('H4');
  });

  it('renders short text when present', () => {
    const { rerender, queryByText, getByText } = render(
      <NewsCard {...newsCardProps} />,
    );
    expect(queryByText(/short text/i)).not.toBeInTheDocument();

    rerender(<NewsCard {...newsCardProps} shortText="short text" />);
    expect(getByText(/short text/i)).toBeVisible();
  });

  it('renders thumbnail when when present', () => {
    const { rerender, getByRole, queryByRole } = render(
      <NewsCard {...newsCardProps} />,
    );
    expect(queryByRole('img')).not.toBeInTheDocument();

    rerender(<NewsCard {...newsCardProps} thumbnail="/thumbnail" />);
    expect(getByRole('img')).toBeVisible();
  });

  it('renders external link when present', () => {
    const { rerender, getByRole, queryByRole } = render(
      <NewsCard {...newsCardProps} />,
    );
    expect(queryByRole('link')).not.toBeInTheDocument();

    rerender(<NewsCard {...newsCardProps} link={'https://hub.asap.science'} />);
    expect(getByRole('link').textContent).toContain('External Link');
  });

  it('renders external link when present and use custom name', () => {
    const { rerender, getByRole, queryByRole } = render(
      <NewsCard {...newsCardProps} />,
    );
    expect(queryByRole('link')).not.toBeInTheDocument();

    rerender(
      <NewsCard
        {...newsCardProps}
        link={'https://hub.asap.science'}
        linkText={'Name'}
      />,
    );
    expect(getByRole('link').textContent).toContain('Name');
  });

  it.each`
    type                | route
    ${'News'}           | ${'news'}
    ${'Working Groups'} | ${'news'}
    ${undefined}        | ${'tutorials'}
  `(
    'links to detail page when text is present and type is $type',
    ({ type, route }) => {
      const { rerender, getByText, queryByRole } = render(
        <NewsCard {...newsCardProps} />,
      );
      expect(queryByRole('link')).not.toBeInTheDocument();

      const { type: _type, ...newsCardPropsWithoutType } = newsCardProps;
      const mockType = type ? { type } : {};

      rerender(
        <NewsCard
          {...newsCardPropsWithoutType}
          {...mockType}
          text={'<h1>title</h1>'}
          title="findThis"
          id="news-1"
        />,
      );
      expect(getByText('findThis')).toHaveAttribute('href', `/${route}/news-1`);
    },
  );
});
