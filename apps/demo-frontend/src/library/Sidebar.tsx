/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import {
  FC,
  FormEvent,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Link } from 'react-router';

import type { Folder, FolderCounts } from '../api/types';
import { Spinner } from '../ui/components';
import { charcoal, lead, mint, pine, rem, silver, tin } from '../ui/theme';
import { CaretIcon, FolderIcon, HomeIcon, KebabIcon, PlusIcon } from './icons';
import { aggregateCount, buildTree, pathOf, type FolderNode } from './tree';

const headerStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingBottom: rem(8),
});

const headingStyles = css({
  margin: 0,
  fontSize: rem(12),
  letterSpacing: rem(1.2),
  textTransform: 'uppercase',
  color: lead.rgb,
  fontWeight: 'bold',
});

const iconButtonStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: rem(26),
  height: rem(26),
  padding: 0,
  border: 'none',
  borderRadius: rem(4),
  background: 'none',
  color: lead.rgb,
  cursor: 'pointer',
  ':hover': { backgroundColor: silver.rgb, color: charcoal.rgb },
});

const listStyles = css({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'grid',
  gap: rem(2),
});

const rowStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(10),
  padding: `${rem(8)} ${rem(12)}`,
  borderRadius: rem(6),
  color: charcoal.rgb,
  textDecoration: 'none',
  fontSize: rem(15),
  ':hover': { backgroundColor: silver.rgb },
});

const activeRowStyles = css({
  backgroundColor: mint.rgb,
  color: pine.rgb,
  fontWeight: 'bold',
  ':hover': { backgroundColor: mint.rgb },
});

const dropTargetStyles = css({
  backgroundColor: mint.rgb,
  outline: `2px solid ${pine.rgb}`,
  outlineOffset: rem(-2),
  color: pine.rgb,
});

const labelStyles = css({
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const countStyles = css({
  fontSize: rem(13),
  fontWeight: 'normal',
  color: tin.rgb,
  fontVariantNumeric: 'tabular-nums',
});

const caretStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: rem(18),
  height: rem(18),
  marginLeft: rem(-4),
  padding: 0,
  border: 'none',
  borderRadius: rem(4),
  background: 'none',
  color: tin.rgb,
  cursor: 'pointer',
  transition: 'transform 120ms',
  ':hover': { color: charcoal.rgb },
});

const caretOpenStyles = css({ transform: 'rotate(90deg)' });

const caretSpacerStyles = css({ width: rem(18), marginLeft: rem(-4) });

const kebabStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: rem(20),
  height: rem(20),
  padding: 0,
  border: 'none',
  borderRadius: rem(4),
  background: 'none',
  color: lead.rgb,
  cursor: 'pointer',
  opacity: 0,
  transition: 'opacity 120ms',
  ':hover, :focus-visible': { color: charcoal.rgb },
});

const rowHoverStyles = css({
  ':hover .row-kebab, :focus-within .row-kebab': { opacity: 1 },
});

const inputStyles = css({
  boxSizing: 'border-box',
  width: '100%',
  padding: `${rem(7)} ${rem(11)}`,
  borderRadius: rem(6),
  border: `1px solid ${pine.rgb}`,
  font: 'inherit',
  fontSize: rem(15),
  color: charcoal.rgb,
});

export const InlineFolderInput: FC<{
  readonly initialValue?: string;
  readonly label: string;
  readonly onSubmit: (name: string) => void;
  readonly onCancel: () => void;
}> = ({ initialValue = '', label, onSubmit, onCancel }) => {
  const [value, setValue] = useState(initialValue);
  return (
    <form
      onSubmit={(event: FormEvent) => {
        event.preventDefault();
        const trimmed = value.trim();
        if (trimmed) onSubmit(trimmed);
        else onCancel();
      }}
    >
      <input
        autoFocus
        aria-label={label}
        css={inputStyles}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onBlur={onCancel}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            onCancel();
          }
        }}
      />
    </form>
  );
};

const SidebarRow: FC<{
  readonly to: string;
  readonly icon: ReactNode;
  readonly name: string;
  readonly count?: number;
  readonly isActive: boolean;
  readonly depth?: number;
  readonly hasChildren?: boolean;
  readonly isExpanded?: boolean;
  readonly onToggle?: () => void;
  readonly droppableId?: string;
  readonly draggableId?: string;
  readonly onContextMenu?: (event: ReactMouseEvent) => void;
  readonly onMenuButton?: (event: ReactMouseEvent) => void;
}> = ({
  to,
  icon,
  name,
  count,
  isActive,
  depth = 0,
  hasChildren = false,
  isExpanded = false,
  onToggle,
  droppableId,
  draggableId,
  onContextMenu,
  onMenuButton,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: droppableId ?? `sidebar-${name}`,
    disabled: droppableId === undefined,
  });
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id: draggableId ?? `sidebar-drag-${name}`,
    disabled: draggableId === undefined,
  });
  return (
    <Link
      ref={(node: HTMLAnchorElement | null) => {
        setNodeRef(node);
        if (draggableId !== undefined) setDragRef(node);
      }}
      to={to}
      draggable={false}
      onContextMenu={onContextMenu}
      {...(draggableId !== undefined ? attributes : {})}
      {...(draggableId !== undefined ? listeners : {})}
      css={[
        rowStyles,
        rowHoverStyles,
        { paddingLeft: rem(12 + depth * 16) },
        isDragging && { opacity: 0.4 },
        isActive && activeRowStyles,
        droppableId !== undefined && isOver && dropTargetStyles,
      ]}
    >
      {hasChildren && onToggle ? (
        <button
          type="button"
          aria-label={isExpanded ? `Collapse ${name}` : `Expand ${name}`}
          aria-expanded={isExpanded}
          css={[caretStyles, isExpanded && caretOpenStyles]}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onToggle();
          }}
        >
          <CaretIcon size={12} />
        </button>
      ) : (
        <span css={caretSpacerStyles} aria-hidden />
      )}
      <span css={{ display: 'flex', color: 'inherit' }}>{icon}</span>
      <span css={labelStyles}>{name}</span>
      {onMenuButton && (
        <button
          type="button"
          className="row-kebab"
          aria-label={`Actions for ${name}`}
          css={kebabStyles}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onMenuButton(event);
          }}
        >
          <KebabIcon size={14} />
        </button>
      )}
      {count !== undefined && <span css={countStyles}>{count}</span>}
    </Link>
  );
};

const expandedKey = 'demo-hub.library.expanded-folders';

const readExpanded = (): string[] => {
  try {
    const raw = window.localStorage.getItem(expandedKey);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((id) => typeof id === 'string')
      : [];
  } catch {
    return [];
  }
};

const useExpandedFolders = (
  folders: readonly Folder[],
  selectedFolder?: string,
): [ReadonlySet<string>, (id: string) => void] => {
  const [expanded, setExpanded] = useState<string[]>(readExpanded);

  const ancestors = useMemo(
    () =>
      selectedFolder
        ? pathOf(selectedFolder, folders)
            .slice(0, -1)
            .map(({ id }) => id)
        : [],
    [selectedFolder, folders],
  );

  const persist = useCallback((next: string[]) => {
    setExpanded(next);
    try {
      window.localStorage.setItem(expandedKey, JSON.stringify(next));
    } catch {
      // a blocked storage should not break the tree
    }
  }, []);

  const toggle = useCallback(
    (id: string) =>
      persist(
        expanded.includes(id)
          ? expanded.filter((value) => value !== id)
          : [...expanded, id],
      ),
    [expanded, persist],
  );

  const visible = useMemo(
    () => new Set([...expanded, ...ancestors]),
    [expanded, ancestors],
  );

  return [visible, toggle];
};

export const Sidebar: FC<{
  readonly folders: readonly Folder[];
  readonly counts?: FolderCounts;
  readonly unfiledCount?: number;
  readonly selectedFolder?: string;
  readonly isCreator: boolean;
  readonly isLoading: boolean;
  readonly isCreatingFolder: boolean;
  readonly creatingChildOf?: string;
  readonly renamingFolderId?: string;
  readonly onStartCreate: () => void;
  readonly onCreate: (name: string) => void;
  readonly onCancelCreate: () => void;
  readonly onCreateChild: (parentId: string, name: string) => void;
  readonly onCancelCreateChild: () => void;
  readonly onRename: (id: string, name: string) => void;
  readonly onCancelRename: () => void;
  readonly isBlockedTarget: (folderId: string) => boolean;
  readonly homeDroppableId?: string;
  readonly onFolderContextMenu: (
    folder: Folder,
  ) => (event: ReactMouseEvent) => void;
}> = ({
  folders,
  counts,
  unfiledCount,
  selectedFolder,
  isCreator,
  isLoading,
  isCreatingFolder,
  creatingChildOf,
  renamingFolderId,
  onStartCreate,
  onCreate,
  onCancelCreate,
  onCreateChild,
  onCancelCreateChild,
  onRename,
  onCancelRename,
  isBlockedTarget,
  homeDroppableId,
  onFolderContextMenu,
}) => {
  const [expanded, toggle] = useExpandedFolders(folders, selectedFolder);
  const tree = useMemo(() => buildTree(folders), [folders]);

  const renderNode = ({ folder, depth, children }: FolderNode): ReactNode => {
    const isExpanded = expanded.has(folder.id) || creatingChildOf === folder.id;
    const hasChildren = children.length > 0;
    const direct = counts?.[folder.id];
    const count = hasChildren
      ? aggregateCount(folder.id, folders, counts)
      : direct;

    return (
      <li key={folder.id}>
        {renamingFolderId === folder.id ? (
          <div css={{ paddingLeft: rem(depth * 16) }}>
            <InlineFolderInput
              initialValue={folder.name}
              label={`Rename ${folder.name}`}
              onCancel={onCancelRename}
              onSubmit={(name) => onRename(folder.id, name)}
            />
          </div>
        ) : (
          <SidebarRow
            to={`/?folder=${folder.id}`}
            icon={<FolderIcon />}
            name={folder.name}
            count={count}
            depth={depth}
            hasChildren={hasChildren}
            isExpanded={isExpanded}
            onToggle={hasChildren ? () => toggle(folder.id) : undefined}
            isActive={selectedFolder === folder.id}
            droppableId={
              isCreator &&
              selectedFolder !== folder.id &&
              !isBlockedTarget(folder.id)
                ? folder.id
                : undefined
            }
            draggableId={isCreator ? `folder:${folder.id}` : undefined}
            onContextMenu={isCreator ? onFolderContextMenu(folder) : undefined}
            onMenuButton={isCreator ? onFolderContextMenu(folder) : undefined}
          />
        )}
        {(isExpanded || creatingChildOf === folder.id) && (
          <ul css={listStyles}>
            {creatingChildOf === folder.id && (
              <li css={{ paddingLeft: rem((depth + 1) * 16) }}>
                <InlineFolderInput
                  label={`New subfolder in ${folder.name}`}
                  onCancel={onCancelCreateChild}
                  onSubmit={(name) => onCreateChild(folder.id, name)}
                />
              </li>
            )}
            {children.map(renderNode)}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside>
      <div css={headerStyles}>
        <h2 css={headingStyles}>Folders</h2>
        {isCreator && (
          <button
            type="button"
            css={iconButtonStyles}
            aria-label="New folder"
            title="New folder"
            onClick={onStartCreate}
          >
            <PlusIcon />
          </button>
        )}
      </div>
      {isLoading ? (
        <Spinner label="Loading folders" />
      ) : (
        <>
          {isCreator && isCreatingFolder && (
            <div css={{ paddingBottom: rem(6) }}>
              <InlineFolderInput
                label="New folder name"
                onCancel={onCancelCreate}
                onSubmit={onCreate}
              />
            </div>
          )}
          <ul css={listStyles}>
            <li>
              <SidebarRow
                to="/"
                icon={<HomeIcon />}
                name="Home"
                count={unfiledCount}
                isActive={!selectedFolder}
                droppableId={homeDroppableId}
              />
            </li>
            {tree.map(renderNode)}
          </ul>
        </>
      )}
    </aside>
  );
};
