const { selector, snapshot_UNSTABLE } = require('recoil');

// This resets the recoil cache between tests

const clearSelectorCachesState = selector({
  key: 'ClearSelectorCaches',
  get: ({ getCallback }) =>
    getCallback(({ snapshot, refresh }) => () => {
      for (const node of snapshot.getNodes_UNSTABLE()) {
        refresh(node);
      }
    }),
});

afterEach(() => {
  const initialSnapshot = snapshot_UNSTABLE();
  const clearSelectorCaches = initialSnapshot
    .getLoadable(clearSelectorCachesState)
    .getValue();
  clearSelectorCaches();
});
