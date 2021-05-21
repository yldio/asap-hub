import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import NewsAndEventsCard from '../NewsAndEventsCard';

describe('News', () => {
  const newsCardProps: ComponentProps<typeof NewsAndEventsCard> = {
    id: 'uuid',
    type: 'News',
    title: 'Not a Title',
    created: new Date().toISOString(),
  };

  it('renders the title', () => {
    const { getByRole } = render(
      <NewsAndEventsCard {...newsCardProps} title="Title" />,
    );
    expect(getByRole('heading').textContent).toEqual('Title');
    expect(getByRole('heading').tagName).toEqual('H2');
  });

  it('renders short text when present', () => {
    const { rerender, queryByText, getByText } = render(
      <NewsAndEventsCard {...newsCardProps} />,
    );
    expect(queryByText(/short text/i)).not.toBeInTheDocument();

    rerender(<NewsAndEventsCard {...newsCardProps} shortText="short text" />);
    expect(getByText(/short text/i)).toBeVisible();
  });

  it('renders thumbnail when when present', () => {
    const { rerender, getByRole, queryByRole } = render(
      <NewsAndEventsCard {...newsCardProps} />,
    );
    expect(queryByRole('img')).not.toBeInTheDocument();

    rerender(<NewsAndEventsCard {...newsCardProps} thumbnail="/thumbnail" />);
    expect(getByRole('img')).toBeVisible();
  });

  it('renders external link when present', () => {
    const { rerender, getByRole, queryByRole } = render(
      <NewsAndEventsCard {...newsCardProps} />,
    );
    expect(queryByRole('link')).not.toBeInTheDocument();

    rerender(
      <NewsAndEventsCard
        {...newsCardProps}
        link={'https://hub.asap.science'}
      />,
    );
    expect(getByRole('link').textContent).toContain('External Link');
  });

  it('renders external link when present and use custom name', () => {
    const { rerender, getByRole, queryByRole } = render(
      <NewsAndEventsCard {...newsCardProps} />,
    );
    expect(queryByRole('link')).not.toBeInTheDocument();

    rerender(
      <NewsAndEventsCard
        {...newsCardProps}
        link={'https://hub.asap.science'}
        linkText={'Name'}
      />,
    );
    expect(getByRole('link').textContent).toContain('Name');
  });

  it('links to detail page when text is present', () => {
    const { rerender, getByRole, queryByRole } = render(
      <NewsAndEventsCard {...newsCardProps} />,
    );
    expect(queryByRole('link')).not.toBeInTheDocument();

    rerender(<NewsAndEventsCard {...newsCardProps} text={'<h1>title</h1>'} />);
    expect(getByRole('link').textContent).toContain(newsCardProps.title);
  });
});
