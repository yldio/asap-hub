import { ClipPlacement } from '@asap-hub/demo-timeline';
import { FC } from 'react';
import { ProjectAsset } from '../../api/types';
import { TimelineAction } from '../project/timelineReducer';
import BannerInspector from './BannerInspector';
import ClipInspector from './ClipInspector';
import CursorEffectInspector from './CursorEffectInspector';
import { ResolvedSelection } from './selection';
import TitleCardInspector from './TitleCardInspector';
import ZoomInspector from './ZoomInspector';

type Props = {
  readonly selected: ResolvedSelection;
  readonly current?: ClipPlacement;
  readonly assets: Record<string, ProjectAsset>;
  readonly clipCount: number;
  readonly readOnly: boolean;
  readonly assetDurationOf: (assetId: string, fallbackMs: number) => number;
  readonly dispatch: (action: TimelineAction) => void;
  readonly onRemove: () => void;
};

// the right-hand column: one inspector for whatever is selected, and the clip
// inspector's own empty state when nothing is
const InspectorPanel: FC<Props> = ({
  selected,
  current,
  assets,
  clipCount,
  readOnly,
  assetDurationOf,
  dispatch,
  onRemove,
}) => {
  const { effect, zoom, banner, clip } = selected;

  if (effect && current) {
    return (
      <CursorEffectInspector
        effect={effect}
        readOnly={readOnly}
        onChange={(change) =>
          dispatch({
            type: 'updateCursorEffect',
            clipId: current.clip.id,
            effectId: effect.id,
            change,
          })
        }
        onRemove={onRemove}
      />
    );
  }

  if (zoom) {
    return (
      <ZoomInspector
        zoom={zoom}
        readOnly={readOnly}
        onChange={(change) =>
          dispatch({ type: 'updateZoom', zoomId: zoom.id, change })
        }
        onRemove={onRemove}
      />
    );
  }

  if (banner) {
    return (
      <BannerInspector
        banner={banner}
        readOnly={readOnly}
        onChange={(change) =>
          dispatch({ type: 'updateBanner', bannerId: banner.id, change })
        }
        onRemove={onRemove}
      />
    );
  }

  if (clip?.clip.kind === 'title') {
    const title = clip.clip;
    return (
      <TitleCardInspector
        placement={clip}
        clip={title}
        readOnly={readOnly}
        onChange={(change) =>
          dispatch({ type: 'updateTitleCard', clipId: title.id, ...change })
        }
        onRemove={onRemove}
      />
    );
  }

  const source = clip?.clip.kind === 'source' ? clip.clip : undefined;

  return (
    <ClipInspector
      placement={clip}
      asset={source ? assets[source.assetId] : undefined}
      readOnly={readOnly}
      index={clip?.index ?? 0}
      clipCount={clipCount}
      onTrim={(change) => {
        if (!source) return;
        dispatch({
          type: 'trimClip',
          clipId: source.id,
          ...change,
          assetDurationMs: assetDurationOf(source.assetId, source.outMs),
        });
      }}
      onVolume={(volume) => {
        if (!clip) return;
        dispatch({ type: 'setClipVolume', clipId: clip.clip.id, volume });
      }}
      onMove={(toIndex) => {
        if (!clip) return;
        dispatch({ type: 'moveClip', clipId: clip.clip.id, toIndex });
      }}
      onRemove={onRemove}
      onTransition={(transition) => {
        if (!clip) return;
        dispatch({ type: 'setTransition', clipId: clip.clip.id, transition });
      }}
    />
  );
};

export default InspectorPanel;
