import {
  ManuscriptVersionResponse,
  ResearchOutputPublishingEntities,
  ResearchOutputResponse,
} from '@asap-hub/model';
import { mapManuscriptVersionToResearchOutput } from './util';

export type ImportDecision =
  | { action: 'redirect-to-add-version'; researchOutputId: string }
  | { action: 'create-output' }
  | { action: 'create-preprint-then-add-version' };

export const decideManuscriptImport = (
  version: ManuscriptVersionResponse,
): ImportDecision => {
  if (version.researchOutputId) {
    return {
      action: 'redirect-to-add-version',
      researchOutputId: version.researchOutputId,
    };
  }

  if (version.lifecycle === 'Preprint') {
    return { action: 'create-output' };
  }

  return { action: 'create-preprint-then-add-version' };
};

export type ManuscriptImport =
  | {
      kind: 'new-output';
      manuscriptVersion: ManuscriptVersionResponse;
    }
  | {
      kind: 'new-version';
      manuscriptVersion: ManuscriptVersionResponse;
      preprintOutput: ResearchOutputResponse;
    };

export type ResolveManuscriptOutputStateParams = {
  existingOutput?: ResearchOutputResponse;
  manuscriptImport?: ManuscriptImport;
  latestManuscriptVersion?: ManuscriptVersionResponse;
  versionAction?: 'create' | 'edit';
  publishingEntity: ResearchOutputPublishingEntities;
};

export type ManuscriptOutputState = {
  researchOutput?: ResearchOutputResponse;
  importedVersion?: ManuscriptVersionResponse;
  isImportedFromManuscript: boolean;
  versionAction?: 'create' | 'edit';
};

export const isAddingVersionOfManuscriptOutput = ({
  versionAction,
  existingOutput,
}: Pick<
  ResolveManuscriptOutputStateParams,
  'versionAction' | 'existingOutput'
>): boolean =>
  versionAction === 'create' && !!existingOutput?.relatedManuscript;

export const resolveManuscriptOutputState = ({
  existingOutput,
  manuscriptImport,
  latestManuscriptVersion,
  versionAction,
  publishingEntity,
}: ResolveManuscriptOutputStateParams): ManuscriptOutputState => {
  if (manuscriptImport?.kind === 'new-output') {
    const { manuscriptVersion } = manuscriptImport;
    return {
      researchOutput: mapManuscriptVersionToResearchOutput(
        undefined,
        manuscriptVersion,
        publishingEntity,
      ),
      importedVersion: manuscriptVersion,
      isImportedFromManuscript: true,
      versionAction: undefined,
    };
  }

  if (manuscriptImport?.kind === 'new-version') {
    const { manuscriptVersion, preprintOutput } = manuscriptImport;
    return {
      researchOutput: {
        ...mapManuscriptVersionToResearchOutput(
          undefined,
          manuscriptVersion,
          publishingEntity,
        ),
        id: preprintOutput.id,
        versions: [preprintOutput],
      },
      importedVersion: manuscriptVersion,
      isImportedFromManuscript: true,
      versionAction: 'create',
    };
  }

  if (isAddingVersionOfManuscriptOutput({ versionAction, existingOutput })) {
    return {
      researchOutput:
        existingOutput && latestManuscriptVersion
          ? mapManuscriptVersionToResearchOutput(
              { ...existingOutput, published: true },
              latestManuscriptVersion,
              publishingEntity,
            )
          : undefined,
      importedVersion: latestManuscriptVersion,
      isImportedFromManuscript: true,
      versionAction: 'create',
    };
  }

  return {
    researchOutput: existingOutput,
    importedVersion: undefined,
    isImportedFromManuscript: Boolean(
      existingOutput?.relatedManuscriptVersion ||
        existingOutput?.relatedManuscript,
    ),
    versionAction,
  };
};
