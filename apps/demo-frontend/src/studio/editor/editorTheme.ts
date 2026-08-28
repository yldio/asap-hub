// The editor chrome stays dark in both app themes, the way every video editor
// does: a bright surround changes how the footage itself reads.
export const editorTheme = {
  surface: '#0f1116',
  panel: '#161923',
  raised: '#1d212c',
  track: '#232838',
  line: '#2d3342',
  text: '#e9ecf3',
  muted: '#98a1b3',
  clip: '#e0a33c',
  clipEdge: '#f3c26b',
  clipText: '#241a06',
  title: '#7b61ff',
  zoom: '#5661f0',
  audio: '#2fb6a6',
  banner: '#e4679b',
  record: '#e5484d',
  playhead: '#5eb0ff',
  selected: '#ffffff',
} as const;

export const trackHeights = {
  ruler: 26,
  clip: 68,
  lane: 40,
  header: 132,
} as const;

// the fixed track name column beside the scrolling lanes
export const trackHeaders = 116;
