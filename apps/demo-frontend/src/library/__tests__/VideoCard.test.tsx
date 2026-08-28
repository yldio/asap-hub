import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import type { Video } from '../../api/types';
import { makeVideo } from '../../test-utils';
import { editPathOf, VideoCard, VideoStatusBadge } from '../VideoCard';

const project = (overrides: Partial<Video> = {}): Video => ({
  ...makeVideo(),
  kind: 'studio',
  processingState: 'empty',
  durationMs: 0,
  ...overrides,
});

const renderCard = (video: Video) =>
  render(
    <MemoryRouter>
      <VideoCard
        video={video}
        view="grid"
        isCreator
        isSelected={false}
        onSelect={jest.fn()}
        onContextMenu={jest.fn()}
        onDelete={jest.fn()}
      />
    </MemoryRouter>,
  );

describe('editPathOf', () => {
  it('opens a studio project in the editor', () => {
    expect(editPathOf(project({ id: 'p1' }))).toBe('/studio/projects/p1');
  });

  it('opens an upload in the upload editor', () => {
    expect(editPathOf(project({ id: 'v1', kind: 'upload' }))).toBe(
      '/studio/videos/v1',
    );
  });
});

describe('VideoStatusBadge', () => {
  // a project that was never exported is not stuck encoding, it just has not
  // been finished yet, and saying "Processing" made it look broken
  it('calls a project that has never been exported a studio draft', () => {
    render(<VideoStatusBadge video={project()} />);

    expect(screen.getByText('Studio draft')).toBeVisible();
  });

  it('still reports a real encode as processing', () => {
    render(
      <VideoStatusBadge
        video={project({ kind: 'upload', processingState: 'processing' })}
      />,
    );

    expect(screen.getByText('Processing')).toBeVisible();
  });

  it('reports a failure', () => {
    render(<VideoStatusBadge video={project({ processingState: 'failed' })} />);

    expect(screen.getByText('Failed')).toBeVisible();
  });
});

describe('VideoCard', () => {
  it('links a studio project to its editor', () => {
    renderCard(project({ id: 'p1', title: 'Untitled demo' }));

    expect(screen.getByRole('link', { name: 'Untitled demo' })).toHaveAttribute(
      'href',
      '/studio/projects/p1',
    );
  });

  it('shows no running time until there is something to play', () => {
    renderCard(project());

    expect(screen.queryByText('0:00')).not.toBeInTheDocument();
  });

  it('shows the running time of a finished demo', () => {
    renderCard(
      project({ processingState: 'ready', durationMs: 65000, kind: 'upload' }),
    );

    expect(screen.getByText('1:05')).toBeVisible();
  });
});
