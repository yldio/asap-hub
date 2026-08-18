/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useDroppable } from '@dnd-kit/core';
import {
  FC,
  FormEvent,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  useState,
} from 'react';
import { Link } from 'react-router';

import type { Folder, FolderCounts } from '../api/types';
import { Spinner } from '../ui/components';
import { charcoal, lead, mint, pine, rem, silver, tin } from '../ui/theme';
import { FolderIcon, HomeIcon, PlusIcon } from './icons';

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
      {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
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
  readonly droppableId?: string;
  readonly onContextMenu?: (event: ReactMouseEvent) => void;
}> = ({ to, icon, name, count, isActive, droppableId, onContextMenu }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: droppableId ?? `sidebar-${name}`,
    disabled: droppableId === undefined,
  });
  return (
    <Link
      ref={setNodeRef}
      to={to}
      onContextMenu={onContextMenu}
      css={[
        rowStyles,
        isActive && activeRowStyles,
        droppableId !== undefined && isOver && dropTargetStyles,
      ]}
    >
      <span css={{ display: 'flex', color: 'inherit' }}>{icon}</span>
      <span css={labelStyles}>{name}</span>
      {count !== undefined && <span css={countStyles}>{count}</span>}
    </Link>
  );
};

export const Sidebar: FC<{
  readonly folders: readonly Folder[];
  readonly counts?: FolderCounts;
  readonly totalCount?: number;
  readonly selectedFolder?: string;
  readonly isCreator: boolean;
  readonly isLoading: boolean;
  readonly rootFolderId: string;
  readonly isCreatingFolder: boolean;
  readonly renamingFolderId?: string;
  readonly onStartCreate: () => void;
  readonly onCreate: (name: string) => void;
  readonly onCancelCreate: () => void;
  readonly onRename: (id: string, name: string) => void;
  readonly onCancelRename: () => void;
  readonly onFolderContextMenu: (
    folder: Folder,
  ) => (event: ReactMouseEvent) => void;
}> = ({
  folders,
  counts,
  totalCount,
  selectedFolder,
  isCreator,
  isLoading,
  rootFolderId,
  isCreatingFolder,
  renamingFolderId,
  onStartCreate,
  onCreate,
  onCancelCreate,
  onRename,
  onCancelRename,
  onFolderContextMenu,
}) => (
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
              count={totalCount}
              isActive={!selectedFolder}
            />
          </li>
          {folders.map((folder) => (
            <li key={folder.id}>
              {renamingFolderId === folder.id ? (
                <InlineFolderInput
                  initialValue={folder.name}
                  label={`Rename ${folder.name}`}
                  onCancel={onCancelRename}
                  onSubmit={(name) => onRename(folder.id, name)}
                />
              ) : (
                <SidebarRow
                  to={`/?folder=${folder.id}`}
                  icon={<FolderIcon />}
                  name={folder.name}
                  count={counts?.[folder.id]}
                  isActive={selectedFolder === folder.id}
                  droppableId={
                    isCreator && selectedFolder !== folder.id
                      ? folder.id
                      : undefined
                  }
                  onContextMenu={
                    isCreator && folder.id !== rootFolderId
                      ? onFolderContextMenu(folder)
                      : undefined
                  }
                />
              )}
            </li>
          ))}
        </ul>
      </>
    )}
  </aside>
);
