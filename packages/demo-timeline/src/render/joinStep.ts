import { ClipPlacement } from '../clips';
import { Canvas, NarrationClip } from '../schema';
import { assetPath } from './assets';
import {
  audioCodecArgs,
  containerArgs,
  silentAudioInput,
  startArgs,
  videoEncodeArgs,
} from './encoding';
import {
  clipHasAudio,
  filterSegment,
  graph,
  label,
  secondsFromMs,
  xfadeTransition,
} from './filters';
import { clipOutputPath, concatListPath } from './paths';
import { ConcatListFile, FfmpegStep, RenderAsset } from './types';

export type JoinStepInput = {
  placements: ClipPlacement[];
  canvas: Canvas;
  narration: NarrationClip[];
  assets: Map<string, RenderAsset>;
  durationMs: number;
  workDir: string;
  output: string;
};

export type JoinStepResult = { step: FfmpegStep; listFile?: ConcatListFile };

export const hasVisualTransition = (placements: ClipPlacement[]): boolean =>
  placements.some((placement) => placement.overlapMs > 0);

export type JoinBoundary = {
  index: number;
  offsetMs: number;
  durationMs: number;
  transition: string;
};

// layoutClips is the single source of the arithmetic: the chain built so far
// ends at the previous clip's endMs, which is this clip's startMs plus its
// overlap, so the xfade offset is exactly this clip's startMs
export const joinBoundaries = (placements: ClipPlacement[]): JoinBoundary[] =>
  placements.slice(1).map((placement) => ({
    index: placement.index,
    offsetMs: placement.startMs,
    durationMs: placement.overlapMs,
    transition: xfadeTransition(placement.clip.transitionIn),
  }));

const joinLabel = (clipCount: number, strategy: string): string =>
  `join ${clipCount} clip${clipCount === 1 ? '' : 's'} (${strategy})`;

export const concatListContent = (paths: string[]): string =>
  paths.map((path) => `file '${path.replace(/'/g, `'\\''`)}'\n`).join('');

const narrationInputArgs = (
  narration: NarrationClip[],
  assets: Map<string, RenderAsset>,
): string[] =>
  narration.flatMap((take) => [
    '-i',
    assetPath(assets, take.assetId, `narration ${take.id}`),
  ]);

const narrationLabel = (position: number): string => `n${position}`;

const narrationSegments = (
  narration: NarrationClip[],
  firstInput: number,
): string[] =>
  narration.map((take, position) =>
    filterSegment(
      [`${firstInput + position}:a`],
      [
        `atrim=${secondsFromMs(take.inMs)}:${secondsFromMs(take.outMs)}`,
        'asetpts=PTS-STARTPTS',
        `volume=${take.volume}`,
        `adelay=${take.startMs}|${take.startMs}`,
      ],
      narrationLabel(position),
    ),
  );

// normalize=0 is essential: the default quietly attenuates every input by 1/N
const mixSegment = (inputs: string[], durationMs: number): string =>
  filterSegment(
    inputs,
    [
      `amix=inputs=${inputs.length}:normalize=0:dropout_transition=0`,
      'apad',
      `atrim=0:${secondsFromMs(durationMs)}`,
    ],
    'a',
  );

const concatJoin = ({
  placements,
  narration,
  assets,
  durationMs,
  workDir,
  output,
}: JoinStepInput): JoinStepResult => {
  const listPath = concatListPath(workDir);
  const programAudio = placements.some((placement) =>
    clipHasAudio(placement.clip),
  )
    ? ['0:a']
    : [];
  const mixed = narration.length > 0;
  const segments = mixed
    ? [
        ...narrationSegments(narration, 1),
        mixSegment(
          [
            ...programAudio,
            ...narration.map((_, position) => narrationLabel(position)),
          ],
          durationMs,
        ),
      ]
    : [];

  return {
    listFile: {
      path: listPath,
      content: concatListContent(
        placements.map((placement) => clipOutputPath(workDir, placement.index)),
      ),
    },
    step: {
      label: joinLabel(placements.length, 'concat'),
      output,
      args: [
        ...startArgs,
        '-f',
        'concat',
        '-safe',
        '0',
        '-i',
        listPath,
        ...narrationInputArgs(narration, assets),
        ...(mixed
          ? [
              '-filter_complex',
              graph(segments),
              '-map',
              '0:v',
              '-map',
              label('a'),
            ]
          : []),
        '-c:v',
        'copy',
        ...(mixed ? audioCodecArgs : ['-c:a', 'copy']),
        ...containerArgs,
        output,
      ],
    },
  };
};

type AudioInputs = { labels: string[]; args: string[]; next: number };

// a muted clip carries no audio stream, so the chain gets matching silence
// instead, keeping every acrossfade and concat pair the same shape
const clipAudioInputs = (placements: ClipPlacement[]): AudioInputs =>
  placements.reduce<AudioInputs>(
    (inputs, placement) =>
      clipHasAudio(placement.clip)
        ? { ...inputs, labels: [...inputs.labels, `${placement.index}:a`] }
        : {
            labels: [...inputs.labels, `${inputs.next}:a`],
            args: [
              ...inputs.args,
              ...silentAudioInput(secondsFromMs(placement.durationMs)),
            ],
            next: inputs.next + 1,
          },
    { labels: [], args: [], next: placements.length },
  );

type Chain = { segments: string[]; label: string };

const foldChain = (
  first: string,
  boundaries: { input: string; name: string; filter: string }[],
): Chain =>
  boundaries.reduce<Chain>(
    (chain, boundary) => ({
      segments: [
        ...chain.segments,
        filterSegment(
          [chain.label, boundary.input],
          [boundary.filter],
          boundary.name,
        ),
      ],
      label: boundary.name,
    }),
    { segments: [], label: first },
  );

const xfadeJoin = ({
  placements,
  canvas,
  narration,
  assets,
  durationMs,
  workDir,
  output,
}: JoinStepInput): JoinStepResult => {
  const boundaries = joinBoundaries(placements);
  const audio = clipAudioInputs(placements);

  const video = foldChain(
    '0:v',
    boundaries.map((boundary) => ({
      input: `${boundary.index}:v`,
      name: `v${boundary.index}`,
      filter:
        boundary.durationMs > 0
          ? `xfade=transition=${boundary.transition}:duration=${secondsFromMs(
              boundary.durationMs,
            )}:offset=${secondsFromMs(boundary.offsetMs)}`
          : 'concat=n=2:v=1:a=0',
    })),
  );

  const programAudio = foldChain(
    audio.labels[0] ?? '0:a',
    boundaries.map((boundary, position) => ({
      input: audio.labels[position + 1] ?? `${boundary.index}:a`,
      name: `a${boundary.index}`,
      filter:
        boundary.durationMs > 0
          ? `acrossfade=d=${secondsFromMs(boundary.durationMs)}`
          : 'concat=n=2:v=0:a=1',
    })),
  );

  const mixed = narration.length > 0;
  const mix = mixed
    ? [
        ...narrationSegments(narration, audio.next),
        mixSegment(
          [
            programAudio.label,
            ...narration.map((_, position) => narrationLabel(position)),
          ],
          durationMs,
        ),
      ]
    : [];

  return {
    step: {
      label: joinLabel(placements.length, 'xfade'),
      output,
      args: [
        ...startArgs,
        ...placements.flatMap((placement) => [
          '-i',
          clipOutputPath(workDir, placement.index),
        ]),
        ...audio.args,
        ...narrationInputArgs(narration, assets),
        '-filter_complex',
        graph([...video.segments, ...programAudio.segments, ...mix]),
        '-map',
        label(video.label),
        '-map',
        label(mixed ? 'a' : programAudio.label),
        ...videoEncodeArgs(canvas),
        ...audioCodecArgs,
        ...containerArgs,
        output,
      ],
    },
  };
};

export const buildJoinStep = (input: JoinStepInput): JoinStepResult =>
  hasVisualTransition(input.placements) ? xfadeJoin(input) : concatJoin(input);
