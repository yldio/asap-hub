import { createEmptyTimeline, Timeline } from '@asap-hub/demo-timeline';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FC, useCallback, useMemo, useState } from 'react';
import { ProjectAsset } from '../../../api/types';
import { TimelineAction, timelineReducer } from '../../project/timelineReducer';
import { ProjectEditor as Editor } from '../../project/useProjectEditor';
import ProjectEditor from '../ProjectEditor';

beforeAll(() => {
  HTMLMediaElement.prototype.pause = jest.fn();
  HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
});

export const asset = (overrides: Partial<ProjectAsset> = {}): ProjectAsset => ({
  assetId: 'asset-a',
  kind: 'video',
  state: 'ready',
  mimeType: 'video/mp4',
  label: 'Sprint demo',
  durationMs: 8000,
  width: 1920,
  height: 1080,
  fps: 30,
  url: 'blob:a',
  createdAt: '2026-08-28T00:00:00.000Z',
  updatedAt: '2026-08-28T00:00:00.000Z',
  ...overrides,
});

// every call the editor makes on the document, in the order it made them, so a
// gesture that should collapse into one undo step can be seen doing it
type Call = { name: string; action?: TimelineAction };

const renderEditor = ({
  timeline = createEmptyTimeline(),
  assets = [asset()],
  readOnly = false,
}: {
  timeline?: Timeline;
  assets?: ProjectAsset[];
  readOnly?: boolean;
} = {}) => {
  const calls: Call[] = [];
  const editor: Editor = {
    timeline,
    saveState: 'idle',
    dirty: false,
    canUndo: false,
    canRedo: false,
    version: 1,
    dispatch: (action) => calls.push({ name: 'dispatch', action }),
    beginGesture: () => calls.push({ name: 'beginGesture' }),
    endGesture: () => calls.push({ name: 'endGesture' }),
    undo: () => calls.push({ name: 'undo' }),
    redo: () => calls.push({ name: 'redo' }),
    rebase: () => calls.push({ name: 'rebase' }),
    flush: () => calls.push({ name: 'flush' }),
    discard: () => calls.push({ name: 'discard' }),
  };

  const view = render(
    <ProjectEditor
      editor={editor}
      assets={assets}
      readOnly={readOnly}
      assetUrl={(item) => item.url}
      onImport={jest.fn()}
      onImportAudio={jest.fn()}
      onRenameAsset={jest.fn()}
      onDeleteAsset={jest.fn()}
      uploading={false}
    />,
  );

  return { ...view, calls };
};

// the same editor, but with the real reducer behind it, for the cases that turn
// on what the document became rather than on what was asked of it
const Live: FC<{
  readonly assets: ProjectAsset[];
  readonly initial: Timeline;
}> = ({ assets, initial }) => {
  const [timeline, setTimeline] = useState(initial);
  const dispatch = useCallback(
    (action: TimelineAction) =>
      setTimeline((current) => timelineReducer(current, action)),
    [],
  );
  const editor: Editor = useMemo(
    () => ({
      timeline,
      saveState: 'idle',
      dirty: false,
      canUndo: false,
      canRedo: false,
      version: 1,
      dispatch,
      beginGesture: () => undefined,
      endGesture: () => undefined,
      undo: () => undefined,
      redo: () => undefined,
      rebase: () => undefined,
      flush: () => undefined,
      discard: () => undefined,
    }),
    [dispatch, timeline],
  );

  return (
    <ProjectEditor
      editor={editor}
      assets={assets}
      readOnly={false}
      assetUrl={(item) => item.url}
      onImport={jest.fn()}
      onImportAudio={jest.fn()}
      onRenameAsset={jest.fn()}
      onDeleteAsset={jest.fn()}
      uploading={false}
    />
  );
};

const renderLive = (initial: Timeline = createEmptyTimeline()) =>
  render(<Live assets={[asset()]} initial={initial} />);

const withClip = (): Timeline => ({
  ...createEmptyTimeline(),
  clips: [
    {
      kind: 'source',
      id: 'clip-a',
      assetId: 'asset-a',
      inMs: 0,
      outMs: 8000,
      volume: 1,
    },
  ],
});

describe('adding a source to the timeline', () => {
  // the add and the format that follows it used to be two entries, so the first
  // Ctrl+Z after the click only put the canvas back and looked like nothing
  it('is a single undoable gesture', async () => {
    const { calls } = renderEditor({
      assets: [asset({ width: 3840, height: 2160, fps: 60 })],
    });

    await userEvent.click(
      screen.getByRole('button', { name: 'Add to timeline' }),
    );

    expect(calls.map((call) => call.name)).toEqual([
      'beginGesture',
      'dispatch',
      'dispatch',
      'endGesture',
    ]);
  });

  it('follows the format of the footage it was given', async () => {
    const { calls } = renderEditor({
      assets: [asset({ width: 3840, height: 2160, fps: 60 })],
    });

    await userEvent.click(
      screen.getByRole('button', { name: 'Add to timeline' }),
    );

    expect(calls.map((call) => call.action).filter(Boolean)).toContainEqual({
      type: 'setCanvas',
      canvas: { width: 3840, height: 2160, fps: 60 },
    });
  });

  // a source added before the ingest had read it pinned the whole project to
  // 1080p30, and nothing ever ran again to correct it
  it('leaves the format alone while the source is still being prepared', async () => {
    const { calls } = renderEditor({
      assets: [
        asset({
          state: 'preparing',
          width: undefined,
          height: undefined,
          fps: undefined,
        }),
      ],
    });

    await userEvent.click(
      screen.getByRole('button', { name: 'Add to timeline' }),
    );

    expect(calls.some((call) => call.action?.type === 'setCanvas')).toBe(false);
  });
});

describe('the side panels', () => {
  // at 1366x768 most of both panels is below the fold, and an overlay scrollbar
  // gave no sign of it, so they are reachable from the keyboard as well
  it.each(['Media', 'Clip'])('lets the keyboard scroll %s', (name) => {
    renderEditor();

    expect(screen.getByRole('complementary', { name })).toHaveAttribute(
      'tabindex',
      '0',
    );
  });

  it('keeps the controls at the far end of the inspector reachable', async () => {
    renderLive();

    await userEvent.click(
      screen.getByRole('button', { name: 'Add to timeline' }),
    );

    const inspector = screen.getByRole('complementary', { name: 'Clip' });
    expect(inspector).toHaveTextContent('Volume');
    expect(inspector).toHaveTextContent('Move earlier');
    expect(inspector).toHaveTextContent('Remove clip');
  });
});

describe('the action bar', () => {
  // Split acts on the clip under the playhead, so it was disabled while the S
  // key it duplicates went on working
  it('offers Split whenever a clip is under the playhead', () => {
    renderEditor({ timeline: withClip() });

    expect(screen.getByRole('button', { name: 'Split' })).toBeEnabled();
  });

  it('has nothing to split on an empty timeline', () => {
    renderEditor();

    expect(screen.getByRole('button', { name: 'Split' })).toBeDisabled();
  });

  // Duplicate and Mute returned early unless a clip was selected, so with a
  // banner selected they looked live and did nothing at all
  it('withholds Duplicate and Mute until a clip is selected', () => {
    renderEditor({ timeline: withClip() });

    expect(screen.getByRole('button', { name: 'Duplicate' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Mute' })).toBeDisabled();
  });

  it('offers Duplicate and Mute once a clip is selected', async () => {
    renderLive();

    await userEvent.click(
      screen.getByRole('button', { name: 'Add to timeline' }),
    );

    expect(screen.getByRole('button', { name: 'Duplicate' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Mute' })).toBeEnabled();
  });
});

describe('adding a source', () => {
  // the inspector used to keep saying "Select a clip on the timeline to edit it"
  it('selects the clip it just made so the inspector shows it', async () => {
    renderLive();

    await userEvent.click(
      screen.getByRole('button', { name: 'Add to timeline' }),
    );

    expect(
      screen.queryByText('Select a clip on the timeline to edit it.'),
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText('Clip')).toHaveTextContent('Sprint demo');
  });
});

describe('the format the export uses', () => {
  it('is raised once the ingest reports what the footage really is', () => {
    const { calls } = renderEditor({
      timeline: withClip(),
      assets: [asset({ width: 3840, height: 2160, fps: 60 })],
    });

    expect(calls.map((call) => call.action).filter(Boolean)).toContainEqual({
      type: 'setCanvas',
      canvas: { width: 3840, height: 2160, fps: 60 },
    });
  });

  it('is left alone when it already matches the footage', () => {
    const { calls } = renderEditor({ timeline: withClip() });

    expect(calls.some((call) => call.action?.type === 'setCanvas')).toBe(false);
  });
});
