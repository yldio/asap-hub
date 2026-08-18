/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  FC,
  FormEvent,
  MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';

import { useApi } from '../api/ApiProvider';
import {
  useBulkDeleteVideos,
  useBulkMoveVideos,
  useCreateFolder,
  useDeleteFolder,
  useFolders,
  useRenameFolder,
  useVideos,
} from '../api/hooks';
import { rootFolderId, type Folder, type Video } from '../api/types';
import { useIsCreator } from '../auth/MeContext';
import { Badge, Button, Card, Headline, Modal, Spinner } from '../ui/components';
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSubmenu,
  type MenuPosition,
} from '../ui/ContextMenu';
import {
  charcoal,
  ember,
  lead,
  mint,
  paper,
  pine,
  rem,
  rose,
  silver,
  steel,
  tin,
} from '../ui/theme';
import { formatDuration, formatRecordedAt } from '../utils/time';
import {
  applySelection,
  emptySelection,
  pruneSelection,
  selectionForContextMenu,
  type SelectionState,
} from './selection';

const gridStyles = css({
  display: 'grid',
  gridTemplateColumns: `minmax(${rem(200)}, ${rem(240)}) 1fr`,
  gap: rem(32),
  alignItems: 'start',
  '@media (max-width: 800px)': {
    gridTemplateColumns: '1fr',
  },
});

const sidebarHeadingStyles = css({
  fontSize: rem(12),
  letterSpacing: rem(1.2),
  textTransform: 'uppercase',
  color: lead.rgb,
  fontWeight: 'bold',
  paddingBottom: rem(12),
});

const folderListStyles = css({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'grid',
  gap: rem(2),
});

const folderLinkStyles = css({
  display: 'block',
  padding: `${rem(8)} ${rem(12)}`,
  borderRadius: rem(4),
  color: charcoal.rgb,
  textDecoration: 'none',
  fontSize: rem(15),
  ':hover': { backgroundColor: silver.rgb },
});

const folderLinkActiveStyles = css({
  backgroundColor: mint.rgb,
  color: pine.rgb,
  fontWeight: 'bold',
  ':hover': { backgroundColor: mint.rgb },
});

const folderDropTargetStyles = css({
  backgroundColor: mint.rgb,
  outline: `2px solid ${pine.rgb}`,
  outlineOffset: rem(-2),
  color: pine.rgb,
});

const folderInputStyles = css({
  boxSizing: 'border-box',
  width: '100%',
  padding: `${rem(7)} ${rem(11)}`,
  borderRadius: rem(4),
  border: `1px solid ${pine.rgb}`,
  font: 'inherit',
  fontSize: rem(15),
  color: charcoal.rgb,
});

const newFolderButtonStyles = css({
  display: 'block',
  width: '100%',
  marginTop: rem(8),
  padding: `${rem(8)} ${rem(12)}`,
  border: 'none',
  borderRadius: rem(4),
  background: 'none',
  font: 'inherit',
  fontSize: rem(14),
  textAlign: 'left',
  color: lead.rgb,
  cursor: 'pointer',
  ':hover': { backgroundColor: silver.rgb, color: charcoal.rgb },
});

const videoListStyles = css({
  display: 'grid',
  gap: rem(16),
});

const videoCardStyles = css({
  padding: rem(24),
  display: 'grid',
  gap: rem(8),
});

const selectedCardStyles = css({
  backgroundColor: mint.rgb,
  borderColor: pine.rgb,
});

const selectableBodyStyles = css({
  userSelect: 'none',
  cursor: 'default',
});

const titleLinkStyles = css({
  color: charcoal.rgb,
  textDecoration: 'none',
  ':hover': { textDecoration: 'underline' },
});

const metaStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: rem(12),
  fontSize: rem(14),
  color: lead.rgb,
});

const dotStyles = css({ color: tin.rgb });

const emptyStyles = css({
  padding: rem(32),
  border: `1px dashed ${steel.rgb}`,
  borderRadius: rem(8),
  color: lead.rgb,
  textAlign: 'center' as const,
});

const dangerTitleStyles = css({
  margin: 0,
  fontSize: rem(18),
  fontWeight: 'bold',
  color: ember.rgb,
});

const dangerBodyStyles = css({
  margin: `${rem(12)} 0 0`,
  fontSize: rem(15),
  lineHeight: 1.5,
  color: charcoal.rgb,
});

const dangerNoticeStyles = css({
  marginTop: rem(16),
  padding: rem(12),
  borderRadius: rem(4),
  borderLeft: `${rem(3)} solid ${ember.rgb}`,
  backgroundColor: rose.rgb,
  fontSize: rem(14),
  color: charcoal.rgb,
});

const confirmInputStyles = css({
  boxSizing: 'border-box',
  width: '100%',
  marginTop: rem(8),
  padding: rem(10),
  borderRadius: rem(4),
  border: `1px solid ${steel.rgb}`,
  font: 'inherit',
  fontSize: rem(15),
});

const modalActionsStyles = css({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: rem(12),
  marginTop: rem(24),
});

const dragOverlayStyles = css({
  padding: `${rem(10)} ${rem(16)}`,
  borderRadius: rem(6),
  backgroundColor: pine.rgb,
  color: paper.rgb,
  fontSize: rem(14),
  fontWeight: 'bold',
  boxShadow: `0 ${rem(4)} ${rem(12)} rgba(0, 0, 0, 0.3)`,
});

const isWatchable = (video: Video): boolean =>
  video.processingState === 'ready' && video.status === 'published';

const demoCount = (count: number): string =>
  `${count} ${count === 1 ? 'demo' : 'demos'}`;

const VideoStatusBadge: FC<{ readonly video: Video }> = ({ video }) => {
  if (video.processingState === 'failed') {
    return <Badge tone="error">Failed</Badge>;
  }
  if (video.processingState !== 'ready') {
    return <Badge tone="warning">Processing</Badge>;
  }
  if (video.status === 'draft') {
    return <Badge tone="neutral">Draft</Badge>;
  }
  return null;
};

type VideoCardProps = {
  readonly video: Video;
  readonly isCreator: boolean;
  readonly isSelected: boolean;
  readonly onSelect: (event: ReactMouseEvent) => void;
  readonly onContextMenu: (event: ReactMouseEvent) => void;
};

const VideoCard: FC<VideoCardProps> = ({
  video,
  isCreator,
  isSelected,
  onSelect,
  onContextMenu,
}) => {
  const editPath = `/studio/videos/${video.id}`;
  const titlePath =
    isCreator && !isWatchable(video) ? editPath : `/videos/${video.id}`;

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: video.id,
    disabled: !isCreator,
  });

  return (
    <div
      ref={isCreator ? setNodeRef : undefined}
      data-testid={`video-card-${video.id}`}
      aria-selected={isCreator ? isSelected : undefined}
      css={{ opacity: isDragging ? 0.4 : 1 }}
      {...(isCreator ? attributes : {})}
      {...(isCreator ? listeners : {})}
      onContextMenu={isCreator ? onContextMenu : undefined}
      onMouseDown={
        isCreator
          ? (event: ReactMouseEvent) => {
              // shift-click would otherwise paint a text selection across cards
              if (event.shiftKey) event.preventDefault();
            }
          : undefined
      }
      onClick={isCreator ? onSelect : undefined}
    >
      <Card
        overrideStyles={
          isSelected
            ? css([videoCardStyles, selectedCardStyles])
            : videoCardStyles
        }
      >
        <div
          css={[
            { display: 'flex', gap: rem(12), alignItems: 'baseline' },
            isCreator && selectableBodyStyles,
          ]}
        >
          <h3 css={{ fontSize: rem(18), fontWeight: 'bold', margin: 0 }}>
            <Link
              to={titlePath}
              css={titleLinkStyles}
              draggable={false}
              onClick={(event) => event.stopPropagation()}
              onMouseDown={(event) => event.stopPropagation()}
            >
              {video.title}
            </Link>
          </h3>
          {isCreator && <VideoStatusBadge video={video} />}
        </div>
        <div css={[metaStyles, isCreator && selectableBodyStyles]}>
          <span>{formatRecordedAt(video.recordedAt)}</span>
          <span css={dotStyles}>&middot;</span>
          <span>{formatDuration(video.durationMs)}</span>
          <span css={dotStyles}>&middot;</span>
          <span>
            {video.chapters.length}{' '}
            {video.chapters.length === 1 ? 'chapter' : 'chapters'}
          </span>
          {isCreator && (
            <>
              <span css={dotStyles}>&middot;</span>
              <Link
                to={editPath}
                css={titleLinkStyles}
                draggable={false}
                onClick={(event) => event.stopPropagation()}
                onMouseDown={(event) => event.stopPropagation()}
              >
                Edit
              </Link>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

const FolderRow: FC<{
  readonly folder: Folder;
  readonly isActive: boolean;
  readonly isDropTarget: boolean;
  readonly onContextMenu?: (event: ReactMouseEvent) => void;
}> = ({ folder, isActive, isDropTarget, onContextMenu }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: folder.id,
    disabled: !isDropTarget,
  });
  return (
    <Link
      ref={setNodeRef}
      to={`/?folder=${folder.id}`}
      onContextMenu={onContextMenu}
      css={[
        folderLinkStyles,
        isActive && folderLinkActiveStyles,
        isDropTarget && isOver && folderDropTargetStyles,
      ]}
    >
      {folder.name}
    </Link>
  );
};

const InlineFolderInput: FC<{
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
        css={folderInputStyles}
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

type FolderMenuState = { folder: Folder; position: MenuPosition };
type VideoMenuState = { position: MenuPosition };

const Home: FC = () => {
  const [searchParams] = useSearchParams();
  const selectedFolder = searchParams.get('folder') ?? undefined;
  const isCreator = useIsCreator();
  const navigate = useNavigate();
  const api = useApi();

  const folders = useFolders();
  const videos = useVideos(selectedFolder);

  const createFolder = useCreateFolder();
  const renameFolder = useRenameFolder();
  const deleteFolder = useDeleteFolder();
  const bulkMove = useBulkMoveVideos();
  const bulkDelete = useBulkDeleteVideos();

  const [selection, setSelection] = useState<SelectionState>(emptySelection);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [renamingFolderId, setRenamingFolderId] = useState<string>();
  const [folderMenu, setFolderMenu] = useState<FolderMenuState>();
  const [videoMenu, setVideoMenu] = useState<VideoMenuState>();
  const [folderToDelete, setFolderToDelete] = useState<Folder>();
  const [folderVideoCount, setFolderVideoCount] = useState<number>();
  const [confirmName, setConfirmName] = useState('');
  const [isDeletingVideos, setIsDeletingVideos] = useState(false);
  const [draggingIds, setDraggingIds] = useState<string[]>([]);

  const folderList = useMemo(() => folders.data ?? [], [folders.data]);

  const visibleVideos = useMemo(
    () =>
      (videos.data ?? []).filter((video) => isCreator || isWatchable(video)),
    [videos.data, isCreator],
  );

  const orderedIds = useMemo(
    () => visibleVideos.map(({ id }) => id),
    [visibleVideos],
  );

  const clearSelection = useCallback(
    () => setSelection(emptySelection),
    [],
  );

  useEffect(() => {
    setSelection((current) => pruneSelection(current, orderedIds));
  }, [orderedIds]);

  useEffect(() => {
    clearSelection();
  }, [selectedFolder, clearSelection]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') clearSelection();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [clearSelection]);

  const selectedVideos = useMemo(
    () => visibleVideos.filter(({ id }) => selection.ids.includes(id)),
    [visibleVideos, selection.ids],
  );

  const onCardSelect = (id: string) => (event: ReactMouseEvent) => {
    setSelection((current) =>
      applySelection(current, orderedIds, id, {
        toggle: event.metaKey || event.ctrlKey,
        range: event.shiftKey,
      }),
    );
  };

  const onCardContextMenu = (id: string) => (event: ReactMouseEvent) => {
    event.preventDefault();
    setFolderMenu(undefined);
    setSelection((current) => selectionForContextMenu(current, id));
    setVideoMenu({ position: { x: event.clientX, y: event.clientY } });
  };

  const onFolderContextMenu =
    (folder: Folder) => (event: ReactMouseEvent) => {
      event.preventDefault();
      setVideoMenu(undefined);
      setFolderMenu({ folder, position: { x: event.clientX, y: event.clientY } });
    };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const draggingIdsRef = useRef<string[]>([]);

  const onDragStart = (event: DragStartEvent) => {
    const id = String(event.active.id);
    setVideoMenu(undefined);
    setFolderMenu(undefined);
    const next = selectionForContextMenu(selection, id);
    if (next !== selection) setSelection(next);
    draggingIdsRef.current = [...next.ids];
    setDraggingIds(draggingIdsRef.current);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const ids = draggingIdsRef.current;
    draggingIdsRef.current = [];
    setDraggingIds([]);
    const folderId = event.over ? String(event.over.id) : undefined;
    if (!folderId || ids.length === 0) return;
    bulkMove.mutate({ ids, folderId }, { onSuccess: clearSelection });
  };

  const openFolderDeleteModal = useCallback(
    async (folder: Folder) => {
      setFolderToDelete(folder);
      setConfirmName('');
      setFolderVideoCount(undefined);
      try {
        const folderVideos = await api.listVideos(folder.id);
        setFolderVideoCount(folderVideos.length);
      } catch {
        setFolderVideoCount(undefined);
      }
    },
    [api],
  );

  const closeFolderDeleteModal = () => {
    setFolderToDelete(undefined);
    setFolderVideoCount(undefined);
    setConfirmName('');
  };

  const confirmFolderDelete = () => {
    if (!folderToDelete) return;
    const { id } = folderToDelete;
    deleteFolder.mutate(id, {
      onSuccess: () => {
        closeFolderDeleteModal();
        if (selectedFolder === id) void navigate('/');
      },
    });
  };

  const confirmVideoDelete = () => {
    bulkDelete.mutate(selection.ids as string[], {
      onSuccess: () => {
        setIsDeletingVideos(false);
        clearSelection();
      },
    });
  };

  const moveTargets = folderList.filter(({ id }) => id !== selectedFolder);
  const singleSelected = selectedVideos.length === 1 ? selectedVideos[0] : undefined;

  const dragLabel =
    draggingIds.length === 1
      ? visibleVideos.find(({ id }) => id === draggingIds[0])?.title ??
        demoCount(1)
      : demoCount(draggingIds.length);

  const isEmptyFolderDelete = folderVideoCount === 0;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={() => {
        draggingIdsRef.current = [];
        setDraggingIds([]);
      }}
    >
      <div
        css={gridStyles}
        onClick={(event) => {
          if (event.target === event.currentTarget) clearSelection();
        }}
      >
        <aside>
          <h2 css={sidebarHeadingStyles}>Folders</h2>
          {folders.isLoading ? (
            <Spinner label="Loading folders" />
          ) : (
            <>
              <ul css={folderListStyles}>
                <li>
                  <Link
                    to="/"
                    css={[
                      folderLinkStyles,
                      !selectedFolder && folderLinkActiveStyles,
                    ]}
                  >
                    All demos
                  </Link>
                </li>
                {folderList.map((folder) => (
                  <li key={folder.id}>
                    {renamingFolderId === folder.id ? (
                      <InlineFolderInput
                        initialValue={folder.name}
                        label={`Rename ${folder.name}`}
                        onCancel={() => setRenamingFolderId(undefined)}
                        onSubmit={(name) => {
                          setRenamingFolderId(undefined);
                          renameFolder.mutate({ id: folder.id, name });
                        }}
                      />
                    ) : (
                      <FolderRow
                        folder={folder}
                        isActive={selectedFolder === folder.id}
                        isDropTarget={
                          isCreator && selectedFolder !== folder.id
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
              {isCreator &&
                (isCreatingFolder ? (
                  <div css={{ marginTop: rem(8) }}>
                    <InlineFolderInput
                      label="New folder name"
                      onCancel={() => setIsCreatingFolder(false)}
                      onSubmit={(name) => {
                        setIsCreatingFolder(false);
                        createFolder.mutate(name);
                      }}
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    css={newFolderButtonStyles}
                    onClick={() => setIsCreatingFolder(true)}
                  >
                    + New folder
                  </button>
                ))}
            </>
          )}
        </aside>

        <section
          onClick={(event) => {
            if (event.target === event.currentTarget) clearSelection();
          }}
        >
          <Headline level={3}>
            {folderList.find(({ id }) => id === selectedFolder)?.name ??
              'All demos'}
          </Headline>
          <div css={{ height: rem(16) }} />
          {videos.isLoading && <Spinner label="Loading demos" />}
          {videos.isError && (
            <div css={emptyStyles}>
              We could not load the demos in this folder.
            </div>
          )}
          {!videos.isLoading &&
            !videos.isError &&
            visibleVideos.length === 0 && (
              <div css={emptyStyles}>No demos here yet.</div>
            )}
          <div css={videoListStyles}>
            {visibleVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                isCreator={isCreator}
                isSelected={selection.ids.includes(video.id)}
                onSelect={onCardSelect(video.id)}
                onContextMenu={onCardContextMenu(video.id)}
              />
            ))}
          </div>
        </section>
      </div>

      <DragOverlay dropAnimation={null}>
        {draggingIds.length > 0 ? (
          <div css={dragOverlayStyles}>{dragLabel}</div>
        ) : null}
      </DragOverlay>

      {folderMenu && (
        <ContextMenu
          label={`Actions for ${folderMenu.folder.name}`}
          position={folderMenu.position}
          onClose={() => setFolderMenu(undefined)}
        >
          <ContextMenuItem
            onSelect={() => {
              setRenamingFolderId(folderMenu.folder.id);
              setFolderMenu(undefined);
            }}
          >
            Rename
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            danger
            onSelect={() => {
              const { folder } = folderMenu;
              setFolderMenu(undefined);
              void openFolderDeleteModal(folder);
            }}
          >
            Delete
          </ContextMenuItem>
        </ContextMenu>
      )}

      {videoMenu && (
        <ContextMenu
          label="Demo actions"
          position={videoMenu.position}
          onClose={() => setVideoMenu(undefined)}
        >
          {singleSelected && isWatchable(singleSelected) && (
            <ContextMenuItem
              onSelect={() => {
                setVideoMenu(undefined);
                void navigate(`/videos/${singleSelected.id}`);
              }}
            >
              Watch
            </ContextMenuItem>
          )}
          {singleSelected && (
            <ContextMenuItem
              onSelect={() => {
                setVideoMenu(undefined);
                void navigate(`/studio/videos/${singleSelected.id}`);
              }}
            >
              Edit
            </ContextMenuItem>
          )}
          <ContextMenuSubmenu label="Move to">
            {moveTargets.map((folder) => (
              <ContextMenuItem
                key={folder.id}
                onSelect={() => {
                  setVideoMenu(undefined);
                  bulkMove.mutate(
                    { ids: selection.ids as string[], folderId: folder.id },
                    { onSuccess: clearSelection },
                  );
                }}
              >
                {folder.name}
              </ContextMenuItem>
            ))}
          </ContextMenuSubmenu>
          <ContextMenuSeparator />
          <ContextMenuItem
            danger
            onSelect={() => {
              setVideoMenu(undefined);
              setIsDeletingVideos(true);
            }}
          >
            {selection.ids.length > 1
              ? `Delete ${demoCount(selection.ids.length)}`
              : 'Delete'}
          </ContextMenuItem>
        </ContextMenu>
      )}

      {folderToDelete && (
        <Modal
          label={`Delete folder ${folderToDelete.name}`}
          onClose={closeFolderDeleteModal}
        >
          {folderVideoCount === undefined ? (
            <Spinner label="Checking folder contents" />
          ) : (
            <>
              <h2 css={dangerTitleStyles}>Delete &ldquo;{folderToDelete.name}&rdquo;?</h2>
              {isEmptyFolderDelete ? (
                <p css={dangerBodyStyles}>
                  This folder is empty. Deleting it cannot be undone.
                </p>
              ) : (
                <>
                  <p css={dangerBodyStyles}>
                    This folder contains {demoCount(folderVideoCount)}.
                  </p>
                  <div css={dangerNoticeStyles}>
                    All {demoCount(folderVideoCount)} inside
                    &ldquo;{folderToDelete.name}&rdquo;, including their video
                    files, will be permanently deleted and cannot be recovered.
                  </div>
                  <label css={{ display: 'block', marginTop: rem(16) }}>
                    <span css={{ fontSize: rem(14), color: lead.rgb }}>
                      Type <strong>{folderToDelete.name}</strong> to confirm
                    </span>
                    <input
                      css={confirmInputStyles}
                      aria-label="Type the folder name to confirm"
                      value={confirmName}
                      onChange={(event) => setConfirmName(event.target.value)}
                    />
                  </label>
                </>
              )}
              <div css={modalActionsStyles}>
                <Button onClick={closeFolderDeleteModal}>Cancel</Button>
                <Button
                  danger
                  disabled={
                    deleteFolder.isPending ||
                    (!isEmptyFolderDelete && confirmName !== folderToDelete.name)
                  }
                  onClick={confirmFolderDelete}
                >
                  Delete
                </Button>
              </div>
            </>
          )}
        </Modal>
      )}

      {isDeletingVideos && (
        <Modal
          label="Delete demos"
          onClose={() => setIsDeletingVideos(false)}
        >
          <h2 css={dangerTitleStyles}>
            Delete {demoCount(selection.ids.length)}?
          </h2>
          <div css={dangerNoticeStyles}>
            {demoCount(selection.ids.length)} and their video files will be
            permanently removed and cannot be recovered.
          </div>
          <div css={modalActionsStyles}>
            <Button onClick={() => setIsDeletingVideos(false)}>Cancel</Button>
            <Button
              danger
              disabled={bulkDelete.isPending}
              onClick={confirmVideoDelete}
            >
              Delete
            </Button>
          </div>
        </Modal>
      )}
    </DndContext>
  );
};

export default Home;
