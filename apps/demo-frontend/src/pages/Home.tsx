/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  FC,
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
  useFolderCounts,
  useFolders,
  useMoveFolder,
  useRenameFolder,
  useVideos,
} from '../api/hooks';
import {
  rootFolderId,
  topLevelParentId,
  type Folder,
  type Video,
} from '../api/types';
import { useIsCreator } from '../auth/MeContext';
import { FolderCard } from '../library/FolderCard';
import { Sidebar } from '../library/Sidebar';
import { Toolbar } from '../library/Toolbar';
import { useSearchResults } from '../library/useSearchResults';
import { isWatchable, VideoCard } from '../library/VideoCard';
import {
  aggregateCount,
  buildTree,
  childrenOf,
  depthOf,
  flattenTree,
  maxFolderDepth,
  pathOf,
  subtreeIds,
} from '../library/tree';
import {
  matchesStatusFilter,
  nextStatusFilter,
  sortVideos,
  useDebounced,
  useViewMode,
  type SortMode,
  type StatusFilter,
} from '../library/state';
import { Button, Modal, Spinner } from '../ui/components';
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSubmenu,
  type MenuPosition,
} from '../ui/ContextMenu';
import { charcoal, ember, lead, paper, pine, rem, rose, steel } from '../ui/theme';
import { folderCount, videoCount } from '../utils/format';
import {
  applySelection,
  emptySelection,
  pruneSelection,
  selectionForContextMenu,
  type SelectionState,
} from './selection';

const layoutStyles = css({
  display: 'grid',
  gridTemplateColumns: `minmax(${rem(200)}, ${rem(240)}) 1fr`,
  gap: rem(32),
  alignItems: 'start',
  '@media (max-width: 800px)': {
    gridTemplateColumns: '1fr',
  },
});

const breadcrumbStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'baseline',
  gap: rem(10),
  paddingBottom: rem(16),
});

const breadcrumbNameStyles = css({
  margin: 0,
  fontSize: rem(20),
  fontWeight: 'bold',
  color: charcoal.rgb,
});

const summaryStyles = css({ fontSize: rem(14), color: lead.rgb });

const crumbLinkStyles = css({
  color: lead.rgb,
  textDecoration: 'none',
  ':hover': { textDecoration: 'underline' },
});

const crumbSeparatorStyles = css({ color: steel.rgb, fontWeight: 'normal' });

const sectionLabelStyles = css({
  fontSize: rem(12),
  letterSpacing: rem(1.2),
  textTransform: 'uppercase',
  color: lead.rgb,
  fontWeight: 'bold',
  paddingBottom: rem(10),
});

const folderGridStyles = css({
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fill, minmax(${rem(200)}, 1fr))`,
  gap: rem(12),
  paddingBottom: rem(28),
});

const videoGridStyles = css({
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fill, minmax(${rem(230)}, 1fr))`,
  gap: rem(16),
});

const videoListStyles = css({ display: 'grid', gap: rem(10) });

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

type FolderMenuState = { folder: Folder; position: MenuPosition };
type VideoMenuState = { position: MenuPosition };

// folder cards register as `card-<id>` so they never collide with the sidebar row ids
const folderIdFromDropTarget = (id: string): string =>
  id.startsWith('card-') ? id.slice('card-'.length) : id;

const folderDragPrefix = 'folder:';

const Home: FC = () => {
  const [searchParams] = useSearchParams();
  const selectedFolder = searchParams.get('folder') ?? undefined;
  const isCreator = useIsCreator();
  const navigate = useNavigate();
  const api = useApi();

  const folders = useFolders();
  const videos = useVideos(selectedFolder);
  const counts = useFolderCounts();

  const createFolder = useCreateFolder();
  const renameFolder = useRenameFolder();
  const deleteFolder = useDeleteFolder();
  const moveFolder = useMoveFolder();
  const bulkMove = useBulkMoveVideos();
  const bulkDelete = useBulkDeleteVideos();

  const [selection, setSelection] = useState<SelectionState>(emptySelection);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [renamingFolderId, setRenamingFolderId] = useState<string>();
  const [folderMenu, setFolderMenu] = useState<FolderMenuState>();
  const [videoMenu, setVideoMenu] = useState<VideoMenuState>();
  const [folderToDelete, setFolderToDelete] = useState<Folder>();
  const [confirmName, setConfirmName] = useState('');
  const [isDeletingVideos, setIsDeletingVideos] = useState(false);
  const [draggingIds, setDraggingIds] = useState<string[]>([]);
  const [creatingChildOf, setCreatingChildOf] = useState<string>();
  const [draggingFolderId, setDraggingFolderId] = useState<string>();
  const [subtreeCounts, setSubtreeCounts] = useState<{
    videos: number;
    folders: number;
  }>();

  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortMode>('newest');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [view, setView] = useViewMode();

  const debouncedQuery = useDebounced(query, 250).trim();
  const isSearching = debouncedQuery.length > 0;

  const folderList = useMemo(() => folders.data ?? [], [folders.data]);
  const folderNames = useMemo(
    () => new Map(folderList.map(({ id, name }) => [id, name])),
    [folderList],
  );

  const search = useSearchResults(
    folderList,
    isSearching ? debouncedQuery : '',
  );

  const filterAndSort = useCallback(
    (list: readonly Video[]): Video[] =>
      sortVideos(
        list.filter(
          (video) =>
            (isCreator || isWatchable(video)) &&
            (!isCreator || matchesStatusFilter(video, statusFilter)),
        ),
        sort,
      ),
    [isCreator, statusFilter, sort],
  );

  const searchVideos = useMemo(
    () => filterAndSort(search.results.map(({ video }) => video)),
    [search.results, filterAndSort],
  );

  const folderVideos = useMemo(
    () => filterAndSort(videos.data ?? []),
    [videos.data, filterAndSort],
  );

  const visibleVideos = isSearching ? searchVideos : folderVideos;

  const orderedIds = useMemo(
    () => visibleVideos.map(({ id }) => id),
    [visibleVideos],
  );

  const clearSelection = useCallback(() => setSelection(emptySelection), []);

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

  const onCardDelete = (id: string) => () => {
    setSelection((current) => selectionForContextMenu(current, id));
    setIsDeletingVideos(true);
  };

  const onFolderContextMenu = (folder: Folder) => (event: ReactMouseEvent) => {
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

    if (id.startsWith(folderDragPrefix)) {
      setDraggingFolderId(id.slice(folderDragPrefix.length));
      return;
    }

    const next = selectionForContextMenu(selection, id);
    if (next !== selection) setSelection(next);
    draggingIdsRef.current = [...next.ids];
    setDraggingIds(draggingIdsRef.current);
  };

  const resetDrag = () => {
    draggingIdsRef.current = [];
    setDraggingIds([]);
    setDraggingFolderId(undefined);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const ids = draggingIdsRef.current;
    const movedFolderId = draggingFolderId;
    resetDrag();

    const target = event.over
      ? folderIdFromDropTarget(String(event.over.id))
      : undefined;
    if (!target) return;

    if (movedFolderId) {
      // a folder can never land on itself or inside its own subtree
      if (
        target !== topLevelParentId &&
        subtreeIds(movedFolderId, folderList).includes(target)
      ) {
        return;
      }
      if (target === rootFolderId) return;
      moveFolder.mutate({ id: movedFolderId, parentId: target });
      return;
    }

    if (ids.length === 0) return;
    bulkMove.mutate({ ids, folderId: target }, { onSuccess: clearSelection });
  };

  const openFolderDeleteModal = useCallback(
    async (folder: Folder) => {
      setFolderToDelete(folder);
      setConfirmName('');
      setSubtreeCounts(undefined);
      const ids = subtreeIds(folder.id, folderList);
      try {
        const lists = await Promise.all(
          ids.map((folderId) => api.listVideos(folderId)),
        );
        setSubtreeCounts({
          videos: lists.reduce((sum, list) => sum + list.length, 0),
          folders: ids.length - 1,
        });
      } catch {
        setSubtreeCounts(undefined);
      }
    },
    [api, folderList],
  );

  const closeFolderDeleteModal = () => {
    setFolderToDelete(undefined);
    setSubtreeCounts(undefined);
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

  const moveTargets = useMemo(() => {
    const unfiled = folderList.find(({ id }) => id === rootFolderId);
    return [
      ...(unfiled ? [{ folder: unfiled, depth: 0 }] : []),
      ...flattenTree(buildTree(folderList)),
    ].filter(({ folder }) => folder.id !== selectedFolder);
  }, [folderList, selectedFolder]);
  const singleSelected =
    selectedVideos.length === 1 ? selectedVideos[0] : undefined;

  const dragLabel =
    draggingIds.length === 1
      ? visibleVideos.find(({ id }) => id === draggingIds[0])?.title ??
        videoCount(1)
      : videoCount(draggingIds.length);

  const isEmptyFolderDelete =
    subtreeCounts !== undefined &&
    subtreeCounts.videos === 0 &&
    subtreeCounts.folders === 0;

  const totalCount = useMemo(
    () =>
      counts.data
        ? Object.values(counts.data).reduce((sum, value) => sum + value, 0)
        : undefined,
    [counts.data],
  );

  const currentFolderName = selectedFolder
    ? folderNames.get(selectedFolder) ?? 'Folder'
    : 'Home';

  const breadcrumbPath = useMemo(
    () =>
      selectedFolder && selectedFolder !== rootFolderId
        ? pathOf(selectedFolder, folderList)
        : [],
    [selectedFolder, folderList],
  );

  // top level on Home, the direct subfolders of the folder being viewed otherwise
  const childFolders = useMemo(
    () => childrenOf(selectedFolder, folderList),
    [selectedFolder, folderList],
  );

  const currentDepth =
    selectedFolder && selectedFolder !== rootFolderId
      ? depthOf(selectedFolder, folderList)
      : 0;

  const canCreateHere =
    selectedFolder === rootFolderId ? false : currentDepth < maxFolderDepth;

  const blockedTargetIds = useMemo(
    () =>
      draggingFolderId
        ? new Set(subtreeIds(draggingFolderId, folderList))
        : new Set<string>(),
    [draggingFolderId, folderList],
  );

  const isBlockedTarget = useCallback(
    (folderId: string) => blockedTargetIds.has(folderId),
    [blockedTargetIds],
  );

  const folderPathLabel = useCallback(
    (folderId: string) =>
      folderId === rootFolderId
        ? folderNames.get(rootFolderId)
        : pathOf(folderId, folderList)
            .map(({ name }) => name)
            .join(' / '),
    [folderList, folderNames],
  );

  const createFolderHere = (name: string) =>
    createFolder.mutate({
      name,
      parentId:
        selectedFolder && selectedFolder !== rootFolderId
          ? selectedFolder
          : undefined,
    });

  const isLoadingList = isSearching ? search.isLoading : videos.isLoading;
  const isEmpty = !isLoadingList && visibleVideos.length === 0;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={resetDrag}
    >
      <div
        css={layoutStyles}
        onClick={(event) => {
          if (event.target === event.currentTarget) clearSelection();
        }}
      >
        <Sidebar
          folders={folderList}
          counts={counts.data}
          totalCount={totalCount}
          selectedFolder={selectedFolder}
          isCreator={isCreator}
          isLoading={folders.isLoading}
          rootFolderId={rootFolderId}
          isCreatingFolder={isCreatingFolder}
          creatingChildOf={creatingChildOf}
          renamingFolderId={renamingFolderId}
          onStartCreate={() => setIsCreatingFolder(true)}
          onCancelCreate={() => setIsCreatingFolder(false)}
          onCreate={(name) => {
            setIsCreatingFolder(false);
            createFolder.mutate({ name });
          }}
          onCancelCreateChild={() => setCreatingChildOf(undefined)}
          onCreateChild={(parentId, name) => {
            setCreatingChildOf(undefined);
            createFolder.mutate({ name, parentId });
          }}
          onCancelRename={() => setRenamingFolderId(undefined)}
          onRename={(id, name) => {
            setRenamingFolderId(undefined);
            renameFolder.mutate({ id, name });
          }}
          isBlockedTarget={isBlockedTarget}
          isDraggingFolder={draggingFolderId !== undefined}
          onFolderContextMenu={onFolderContextMenu}
        />

        <section
          onClick={(event) => {
            if (event.target === event.currentTarget) clearSelection();
          }}
        >
          <Toolbar
            query={query}
            onQueryChange={setQuery}
            sort={sort}
            onSortChange={setSort}
            view={view}
            onViewChange={setView}
            statusFilter={statusFilter}
            onStatusFilterClick={() =>
              setStatusFilter(nextStatusFilter(statusFilter))
            }
            isCreator={isCreator}
            currentLocationName={currentFolderName}
            canCreateHere={canCreateHere}
            onCreateFolderHere={createFolderHere}
          />

          <div css={breadcrumbStyles}>
            <h2 css={breadcrumbNameStyles}>
              {isSearching ? (
                `Results for "${debouncedQuery}"`
              ) : breadcrumbPath.length > 1 ? (
                <span>
                  <Link to="/" css={crumbLinkStyles}>
                    Home
                  </Link>
                  {breadcrumbPath.map((folder, index) => (
                    <span key={folder.id}>
                      <span css={crumbSeparatorStyles}> / </span>
                      {index === breadcrumbPath.length - 1 ? (
                        folder.name
                      ) : (
                        <Link
                          to={`/?folder=${folder.id}`}
                          css={crumbLinkStyles}
                        >
                          {folder.name}
                        </Link>
                      )}
                    </span>
                  ))}
                </span>
              ) : (
                currentFolderName
              )}
            </h2>
            <span css={summaryStyles}>
              {videoCount(visibleVideos.length)}
              {!isSearching &&
                childFolders.length > 0 &&
                ` · ${folderCount(childFolders.length)}`}
            </span>
          </div>

          {!isSearching && childFolders.length > 0 && (
            <>
              <div css={sectionLabelStyles}>Folders</div>
              <div css={folderGridStyles}>
                {childFolders.map((folder) => (
                  <FolderCard
                    key={folder.id}
                    folder={folder}
                    count={
                      childrenOf(folder.id, folderList).length > 0
                        ? aggregateCount(folder.id, folderList, counts.data)
                        : counts.data?.[folder.id]
                    }
                    isDropTarget={isCreator && !isBlockedTarget(folder.id)}
                    isDraggable={isCreator}
                    onContextMenu={
                      isCreator ? onFolderContextMenu(folder) : undefined
                    }
                  />
                ))}
              </div>
            </>
          )}

          {isLoadingList && <Spinner label="Loading videos" />}
          {!isSearching && videos.isError && (
            <div css={emptyStyles}>
              We could not load the videos in this folder.
            </div>
          )}
          {isEmpty && (
            <div css={emptyStyles}>
              {isSearching
                ? `No results for ${debouncedQuery}`
                : 'No videos here yet.'}
            </div>
          )}

          <div css={view === 'grid' ? videoGridStyles : videoListStyles}>
            {visibleVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                view={view}
                isCreator={isCreator}
                isSelected={selection.ids.includes(video.id)}
                folderName={
                  isSearching ? folderPathLabel(video.folderId) : undefined
                }
                onSelect={onCardSelect(video.id)}
                onContextMenu={onCardContextMenu(video.id)}
                onDelete={onCardDelete(video.id)}
              />
            ))}
          </div>
        </section>
      </div>

      <DragOverlay dropAnimation={null}>
        {draggingFolderId ? (
          <div css={dragOverlayStyles}>
            {folderNames.get(draggingFolderId) ?? 'Folder'}
          </div>
        ) : draggingIds.length > 0 ? (
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
          {depthOf(folderMenu.folder.id, folderList) < maxFolderDepth && (
            <ContextMenuItem
              onSelect={() => {
                setCreatingChildOf(folderMenu.folder.id);
                setFolderMenu(undefined);
              }}
            >
              New subfolder
            </ContextMenuItem>
          )}
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
          label="Video actions"
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
            {moveTargets.map(({ folder, depth }) => (
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
                <span css={{ paddingLeft: rem(depth * 14) }}>{folder.name}</span>
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
              ? `Delete ${videoCount(selection.ids.length)}`
              : 'Delete'}
          </ContextMenuItem>
        </ContextMenu>
      )}

      {folderToDelete && (
        <Modal
          label={`Delete folder ${folderToDelete.name}`}
          onClose={closeFolderDeleteModal}
        >
          {subtreeCounts === undefined ? (
            <Spinner label="Checking folder contents" />
          ) : (
            <>
              <h2 css={dangerTitleStyles}>
                Delete &ldquo;{folderToDelete.name}&rdquo;?
              </h2>
              {isEmptyFolderDelete ? (
                <p css={dangerBodyStyles}>
                  This folder is empty. Deleting it cannot be undone.
                </p>
              ) : (
                <>
                  <p css={dangerBodyStyles}>
                    This folder contains {videoCount(subtreeCounts.videos)} and{' '}
                    {folderCount(subtreeCounts.folders)}.
                  </p>
                  <div css={dangerNoticeStyles}>
                    {videoCount(subtreeCounts.videos)} and{' '}
                    {subtreeCounts.folders === 1
                      ? '1 subfolder'
                      : `${subtreeCounts.folders} subfolders`}
                    , including their video files, will be permanently deleted
                    and cannot be recovered.
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
                    (!isEmptyFolderDelete &&
                      confirmName !== folderToDelete.name)
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
        <Modal label="Delete videos" onClose={() => setIsDeletingVideos(false)}>
          <h2 css={dangerTitleStyles}>
            Delete {videoCount(selection.ids.length)}?
          </h2>
          <div css={dangerNoticeStyles}>
            {videoCount(selection.ids.length)} and their video files will be
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
