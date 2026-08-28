/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ResolvedChapter } from '@asap-hub/demo-timeline';
import { FC } from 'react';
import EditorButton from './EditorButton';
import { editorTheme } from './editorTheme';
import { formatTimecode } from './geometry';
import { PlusIcon, TrashIcon } from './icons';

const listStyles = css({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
});

const rowStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 12,
});

const timeStyles = css({
  color: editorTheme.muted,
  fontVariantNumeric: 'tabular-nums',
  flexShrink: 0,
});

const inputStyles = css({
  flex: 1,
  minWidth: 0,
  height: 26,
  borderRadius: 6,
  border: `1px solid ${editorTheme.line}`,
  backgroundColor: editorTheme.raised,
  color: editorTheme.text,
  padding: '0 6px',
  font: 'inherit',
  fontSize: 12,
});

const fixedStyles = css({ flex: 1, minWidth: 0, color: editorTheme.muted });

const emptyStyles = css({
  margin: 0,
  fontSize: 12,
  color: editorTheme.muted,
  lineHeight: 1.5,
});

type Props = {
  readonly resolved: ResolvedChapter[];
  readonly readOnly: boolean;
  readonly canAdd: boolean;
  readonly onAdd: () => void;
  readonly onRename: (chapterId: string, title: string) => void;
  readonly onRemove: (chapterId: string) => void;
};

// Title cards are chapters by definition, so they show here as fixed rows: the
// way to rename one is to rename the card itself.
const ChapterList: FC<Props> = ({
  resolved,
  readOnly,
  canAdd,
  onAdd,
  onRename,
  onRemove,
}) => (
  <>
    <EditorButton
      icon={<PlusIcon size={15} />}
      disabled={readOnly || !canAdd}
      onClick={onAdd}
    >
      Chapter at the playhead
    </EditorButton>

    {resolved.length === 0 ? (
      <p css={emptyStyles}>
        No chapters yet. Add one at the playhead, or drop in a title card and it
        becomes a chapter of its own.
      </p>
    ) : (
      <ul css={listStyles}>
        {resolved.map((chapter) => (
          <li key={chapter.id} css={rowStyles}>
            <span css={timeStyles}>{formatTimecode(chapter.startMs)}</span>
            {chapter.kind === 'marker' ? (
              <>
                <input
                  css={inputStyles}
                  value={chapter.title}
                  disabled={readOnly}
                  aria-label={`Chapter at ${formatTimecode(chapter.startMs)}`}
                  onChange={(event) => onRename(chapter.id, event.target.value)}
                />
                <EditorButton
                  aria-label={`Remove the chapter at ${formatTimecode(
                    chapter.startMs,
                  )}`}
                  icon={<TrashIcon size={14} />}
                  disabled={readOnly}
                  onClick={() => onRemove(chapter.id)}
                />
              </>
            ) : (
              <span css={fixedStyles}>{`${chapter.title} (title card)`}</span>
            )}
          </li>
        ))}
      </ul>
    )}
  </>
);

export default ChapterList;
